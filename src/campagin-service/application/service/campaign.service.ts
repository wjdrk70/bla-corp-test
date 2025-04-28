import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CampaignRepository } from '@/src/campagin-service/domain/repository/campaign.repository';
import { Campaign } from '@/src/campagin-service/domain/campaign';
import { CreateCampaignDto } from '@/src/campagin-service/ui/dto/create-campaign.dto';
import { CampaignTypeRepository } from '@/src/campagin-service/domain/repository/campaign-type-repository';
import { CampaignScheduleRepository } from '@/src/campagin-service/domain/repository/campaign-schedule.repository';
import { ProductService } from '@/src/product-service/application/service/product.service';
import { CampaignDomainService } from '@/src/campagin-service/domain/service/campaign.domain.service';
import { InfluencePlatformRepository } from '@/src/campagin-service/domain/repository/influence-platform.repository';
import { ScheduleTypeRepository } from '@/src/campagin-service/domain/repository/scehduel-type.repository';
import { CreateScheduleRequestDto } from '@/src/campagin-service/ui/dto/create-schedule-request.dto';

import { CampaignQueryRepository } from '@/src/campagin-service/domain/repository/campaign.query.repository';
import { PaginatedCampaignListDto } from '@/src/campagin-service/ui/dto/paginated.campaign.list.dto';
import { Product } from '@/src/product-service/domain/product';
import { CampaignSchedule } from '@/src/campagin-service/domain/campaign.schedule';
import { CampaignDetailItemDto } from '@/src/campagin-service/ui/dto/campaign-detail-item.dto';


@Injectable()
export class CampaignService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly campaignRepository: CampaignRepository,
    private readonly campaignTypeRepository: CampaignTypeRepository,
    private readonly campaignScheduleRepository: CampaignScheduleRepository,
    private readonly campaignDomainService: CampaignDomainService,
    private readonly influencerPlatformRepository: InfluencePlatformRepository,
    private readonly scheduleTypeRepository: ScheduleTypeRepository,
    private readonly productService: ProductService,
    private readonly campaignQueryRepository: CampaignQueryRepository,
  ) {}

  async getAllCampaign(page: number, limit: number): Promise<PaginatedCampaignListDto> {
    return await this.campaignQueryRepository.findAllForList(page,limit);
  }

  async create(dto: CreateCampaignDto): Promise<CampaignDetailItemDto> {
    return await this.dataSource.transaction(async (manager) => {
      // 상품 생성
      const product = await this.productService.createProduct(
        dto.product,
        manager,
      );

      // 캠페인 생성 참조 데이터 조회
      const campaignTypeReader = this.campaignTypeRepository.withTransaction(manager);
      const influencerPlatformReader = this.influencerPlatformRepository.withTransaction(manager);

      const campaignType = await campaignTypeReader.findByCodeOrThrow(dto.campaignTypeCode,);
      const influencerPlatform = await influencerPlatformReader.findByCodeOrThrow(dto.influencerPlatformCode,);

      // 캠페인 생성
      const campaignWriter = this.campaignRepository.withTransaction(manager);

      const campaign = this.campaignDomainService.createCampaign({
        name: dto.name,
        budget: dto.budget,
        peopleCount: dto.peopleCount,
        productId: product.id,
        product: product,
        campaignType: campaignType,
        influencerPlatform: influencerPlatform,
      });

      const savedCampaign = await campaignWriter.save(campaign);

      // 스케줄 생성 및 저장
      let savedSchedules = [];
      if (dto.schedules && dto.schedules.length > 0) {
        savedSchedules =  await this.createSchedules(savedCampaign, dto.schedules, manager);
      }

      return this.mapCampaignToCreationResponseDto(savedCampaign, product, savedSchedules);
    });
  }

  private async createSchedules(
    campaign: Campaign,
    dto: CreateScheduleRequestDto[],
    manager: EntityManager,
  ): Promise<CampaignSchedule[]> {
    const scheduleTypeReader = this.scheduleTypeRepository.withTransaction(manager);
    const campaignScheduleWriter = this.campaignScheduleRepository.withTransaction(manager);

    const validTypes = await scheduleTypeReader.findByCampaignTypeAndPlatform(campaign.campaignType.id, campaign.influencerPlatform.id,);

    const requestedCodes = dto.map((d) => d.scheduleTypeCode);

    // domainService 내 유효성 검증 로직
    this.campaignDomainService.validateSupportedScheduleTypes(
      campaign, // campaign 엔티티 객체 전달
      requestedCodes,
      validTypes, // ScheduleType 엔티티 목록 전달
    );

    this.campaignDomainService.validateRequiredScheduleTypes(
      campaign, // campaign 엔티티 객체 전달
      validTypes, // ScheduleType 엔티티 목록 전달
    );

    const typeMap = new Map(validTypes.map((t) => [t.code, t]));
    const schedules = dto.map(({ scheduleTypeCode, startDate, endDate }) => {
      const scheduleType = typeMap.get(scheduleTypeCode)!;
      return this.campaignDomainService.createCampaignSchedule(
        campaign.id,
        scheduleType,
        startDate,
        endDate ?? null,
      );
    });


   return await campaignScheduleWriter.saveMany(schedules);
  }

  private mapCampaignToCreationResponseDto(
    campaign: Campaign,
    product: Product, // product 엔티티 필요
    schedules: CampaignSchedule[] // schedule 엔티티 목록 필요
  ): CampaignDetailItemDto {
    const responseDto = new CampaignDetailItemDto();
    responseDto.id = campaign.id;
    responseDto.name = campaign.name;
    responseDto.budget = Number(campaign.budget);
    responseDto.peopleCount = campaign.peopleCount;
    responseDto.createdAt = campaign.createdAt.toISOString();

    // Product 정보 매핑
    responseDto.product = {
      productId: product.id,
      brandName: product.brandName,
      productName: product.productName,
      productTypeCode: product.productType?.code ?? '',
      briefDescription: product.briefDescription,

      postalCode: product.address?.postalCode,
      roadName: product.address?.roadName,
      genderCode: product.gender?.code,
      isSponsored: product.isSponsored ?? false,
    };

    // CampaignType 정보 매핑
    responseDto.campaignType = {
      code: campaign.campaignType.code,
      label: campaign.campaignType.label,
    };

    // InfluencerPlatform 정보 매핑
    responseDto.influencerPlatform = {
      code: campaign.influencerPlatform.code,
      label: campaign.influencerPlatform.label,
    };

    // Schedules 정보 매핑
    responseDto.schedules = schedules.map(schedule => ({
      scheduleTypeCode: schedule.scheduleType?.code ?? '',
      startDate: schedule.startDate ? String(schedule.startDate) : '',
      endDate: schedule.endDate ? String(schedule.endDate) : null,
    }));


    return responseDto;
  }
}
