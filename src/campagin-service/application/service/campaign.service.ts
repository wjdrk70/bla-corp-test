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
import { CampaignListItemDto } from '@/src/campagin-service/ui/dto/campaign-list-item.dto';
import { CampaignQueryRepository } from '@/src/campagin-service/domain/repository/campaign.query.repository';
import { PaginatedCampaignListDto } from '@/src/campagin-service/ui/dto/paginated.campaign.list.dto';

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

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    return await this.dataSource.transaction(async (manager) => {
      // 상품 생성
      const product = await this.productService.createProduct(
        dto.product,
        manager,
      );

      // 캠페인 생성 참조 데이터 조회
      const campaignTypeReader =
        this.campaignTypeRepository.withTransaction(manager);
      const influencerPlatformReader =
        this.influencerPlatformRepository.withTransaction(manager);

      const campaignType = await campaignTypeReader.findByCodeOrThrow(
        dto.campaignTypeCode,
      );
      const influencerPlatform =
        await influencerPlatformReader.findByCodeOrThrow(
          dto.influencerPlatformCode,
        );

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
      if (dto.schedules && dto.schedules.length > 0) {
        await this.createSchedules(savedCampaign, dto.schedules, manager);
      }

      return savedCampaign;
    });
  }

  private async createSchedules(
    campaign: Campaign,
    dto: CreateScheduleRequestDto[],
    manager: EntityManager,
  ): Promise<void> {
    const scheduleTypeReader =
      this.scheduleTypeRepository.withTransaction(manager);
    const campaignScheduleWriter =
      this.campaignScheduleRepository.withTransaction(manager);

    const validTypes = await scheduleTypeReader.findByCampaignTypeAndPlatform(
      campaign.campaignType.id,
      campaign.influencerPlatform.id,
    );

    const requestedCodes = dto.map((d) => d.scheduleTypeCode);
    this.campaignDomainService.validateSupportedScheduleTypes(
      campaign,
      requestedCodes,
      validTypes,
    );

    const typeMap = new Map(validTypes.map((t) => [t.code, t]));
    const schedules = dto.map(({ scheduleTypeCode, startDate, endDate }) => {
      const scheduleType = typeMap.get(scheduleTypeCode)!; // 이제 무조건 존재
      return this.campaignDomainService.createCampaignSchedule(
        campaign.id,
        scheduleType,
        startDate,
        endDate ?? null,
      );
    });

    this.campaignDomainService.validateRequiredScheduleTypes(
      campaign,
      validTypes,
    );
    await campaignScheduleWriter.saveMany(schedules);
  }
}
