import { ScheduleType } from '@/src/campagin-service/domain/schedule.type';
import { ScheduleItemDto } from '@/src/campagin-service/ui/dto/schedule-item.dto';

export interface ScheduleTypeReader {
  findByIdOrThrow(id: number): Promise<ScheduleType>;

  findByCodeOrThrow(code: string): Promise<ScheduleType>;

  findByCampaignTypeAndPlatform(
    campaignTypeId: number,
    influencerPlatformId: number,
  ): Promise<ScheduleType[]>;


}
