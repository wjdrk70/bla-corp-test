import { ScheduleType } from '@/src/campagin-service/domain/schedule.type';

export interface ScheduleTypeReader {
  findByIdOrThrow(id: number): Promise<ScheduleType>;

  findByCodeOrThrow(code: string): Promise<ScheduleType>;

  findByCampaignTypeAndPlatform(
    campaignTypeId: number,
    influencerPlatformId: number,
  ): Promise<ScheduleType[]>;
}
