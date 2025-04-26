import { ScheduleType } from '@/src/campagin-service/domain/schedule.type';

export interface ScheduleTypeReader {
  findByCodeOrThrow(code: string): Promise<ScheduleType>;

  findByCampaignTypeAndPlatform(
    campaignTypeId: number,
    influencerPlatformId: number,
  ): Promise<ScheduleType[]>;
}
