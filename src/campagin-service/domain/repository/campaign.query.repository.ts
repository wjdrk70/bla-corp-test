import { Injectable } from '@nestjs/common';
import { CampaignReader } from '@/src/campagin-service/domain/port/campaign.reader';
import { CampaignDetailItemDto } from '../../ui/dto/campaign-detail-item.dto';
import { DataSource } from 'typeorm';
import {
  RawAddress,
  RawCampaignBase,
  RawGender,
  RawProductType,
  RawSchedule,
} from '@/src/campagin-service/domain/interface/query-type';
import { ScheduleItemDto } from '@/src/campagin-service/ui/dto/schedule-item.dto';
import { PaginatedCampaignListDto } from '@/src/campagin-service/ui/dto/paginated.campaign.list.dto';

@Injectable()
export class CampaignQueryRepository implements CampaignReader {
  constructor(private readonly dataSource: DataSource) {}

  async findAllForList(page: number, limit: number): Promise<PaginatedCampaignListDto> {
    const totalCount = await this.dataSource.createQueryBuilder()
      .from('campaign', 'c').getCount();

    const offset = (page - 1) * limit;


    const campaignsBaseRaw = await this.dataSource
      .createQueryBuilder()
      .select([
        // Campaign
        'c.id AS id',
        'c.name AS name',
        'c.budget AS budget',
        'c.people_count AS peopleCount',
        "DATE_FORMAT(c.created_at, '%Y-%m-%dT%TZ') AS createdAt",
        // Product (Base + FKs)
        'p.id AS productId',
        'p.product_name AS productName',
        'p.brand_name AS brandName',
        'p.brief_description AS briefDescription',
        'p.is_sponsored AS isSponsored',
        'p.product_type_id AS productTypeId',
        'p.address_id AS addressId',
        'p.gender_id AS genderId',
        // Campaign Type
        'ct.code AS campaignTypeCode',
        'ct.label AS campaignTypeLabel',
        // Influencer Platform
        'ip.code AS influencerPlatformCode',
        'ip.label AS influencerPlatformLabel',
      ])
      .from('campaign', 'c')
      .leftJoin('product', 'p', 'p.id = c.product_id') // Product 정보는 필요하므로 LEFT JOIN (INNER도 가능할 수 있음)
      .leftJoin('campaign_type', 'ct', 'ct.id = c.campaign_type_id')
      .leftJoin('influencer_platform', 'ip', 'ip.id = c.influencer_platform_id')
      // .where('c.is_deleted = FALSE')
      .orderBy('c.created_at', 'DESC')
      .addOrderBy('c.id', 'DESC')
      .skip(offset)
      .take(limit)
      .getRawMany<RawCampaignBase>();

    if (!campaignsBaseRaw || campaignsBaseRaw.length === 0) {
      return { items: [], totalCount };
    }

    const campaignIds = campaignsBaseRaw.map((c) => c.id);
    const addressIds = [
      ...new Set(
        campaignsBaseRaw.map((c) => c.addressId).filter((id) => id != null),
      ),
    ];
    const genderIds = [
      ...new Set(
        campaignsBaseRaw.map((c) => c.genderId).filter((id) => id != null),
      ),
    ];
    const productTypeIds = [
      ...new Set(
        campaignsBaseRaw.map((c) => c.productTypeId).filter((id) => id != null),
      ),
    ];
    // 2. 후속 쿼리 병렬 실행 (Promise.all 사용)
    const [schedulesRaw, addressesRaw, gendersRaw, productTypesRaw] =
      await Promise.all([
        // 스케줄 조회
        campaignIds.length > 0
          ? this.dataSource
              .createQueryBuilder()
              .select([
                'cs.campaign_id AS campaignId',
                'st.code AS scheduleTypeCode',
                "DATE_FORMAT(cs.start_date, '%Y-%m-%d') AS startDate",
                "IF(cs.end_date IS NULL, NULL, DATE_FORMAT(cs.end_date, '%Y-%m-%d')) AS endDate",
              ])
              .from('campaign_schedule', 'cs')
              .innerJoin('schedule_type', 'st', 'st.id = cs.schedule_type_id')
              .where('cs.campaign_id IN (:...ids)', { ids: campaignIds })
              .getRawMany<RawSchedule>()
          : Promise.resolve([]),

        // 주소 상세 조회
        addressIds.length > 0
          ? this.dataSource
              .createQueryBuilder()
              .select([
                'a.id AS addressId',
                'a.postal_code AS postalCode',
                'a.road_name AS roadName',
              ])
              .from('address', 'a')
              .where('a.id IN (:...ids)', { ids: addressIds })
              .getRawMany<RawAddress>()
          : Promise.resolve([]),

        // 성별 상세 조회
        genderIds.length > 0
          ? this.dataSource
              .createQueryBuilder()
              .select(['g.id AS genderId', 'g.code AS genderCode']) // 필요시 'g.label AS genderLabel' 추가
              .from('gender', 'g')
              .where('g.id IN (:...ids)', { ids: genderIds })
              .getRawMany<RawGender>()
          : Promise.resolve([]),

        // 상품 타입 상세 조회 (productTypeCode가 필요하므로 조회)
        productTypeIds.length > 0
          ? this.dataSource
              .createQueryBuilder()
              .select(['pt.id AS productTypeId', 'pt.code AS productTypeCode']) // 필요시 'pt.label AS productTypeLabel' 추가
              .from('product_type', 'pt')
              .where('pt.id IN (:...ids)', { ids: productTypeIds })
              .getRawMany<RawProductType>()
          : Promise.resolve([]),
      ]);

    // 3. 조회된 상세 정보 Map으로 변환 (빠른 조회를 위해)
    const scheduleMap = new Map<number, ScheduleItemDto[]>();
    schedulesRaw.forEach((s) => {
      const arr = scheduleMap.get(s.campaignId) || [];
      arr.push({
        scheduleTypeCode: s.scheduleTypeCode,
        startDate: s.startDate,
        endDate: s.endDate,
      });
      scheduleMap.set(s.campaignId, arr);
    });

    const addressMap = new Map(addressesRaw.map((a) => [a.addressId, a]));
    const genderMap = new Map(gendersRaw.map((g) => [g.genderId, g]));
    const productTypeMap = new Map(
      productTypesRaw.map((pt) => [pt.productTypeId, pt]),
    );

    // 4. 최종 DTO 매핑
    const items =  campaignsBaseRaw.map((c) => {
      const addressInfo = c.addressId ? addressMap.get(c.addressId) : null;
      const genderInfo = c.genderId ? genderMap.get(c.genderId) : null;
      const productTypeInfo = productTypeMap.get(c.productTypeId);

      const productDto: CampaignDetailItemDto['product'] = {
        productId: c.productId,
        productName: c.productName,
        brandName: c.brandName,
        productTypeCode: productTypeInfo?.productTypeCode ?? '', // 조회된 정보 사용
        briefDescription: c.briefDescription,
        postalCode: addressInfo?.postalCode,
        roadName: addressInfo?.roadName,
        genderCode: genderInfo?.genderCode,
        isSponsored: c.isSponsored ?? false,
      };

      return {
        id: c.id,
        name: c.name,
        budget: Number(c.budget),
        peopleCount: c.peopleCount,
        createdAt: c.createdAt,
        product: productDto,
        campaignType: { code: c.campaignTypeCode, label: c.campaignTypeLabel },
        influencerPlatform: {
          code: c.influencerPlatformCode,
          label: c.influencerPlatformLabel,
        },
        schedules: scheduleMap.get(c.id) || [],
      };
    });
    return { items, totalCount };
  }
}
