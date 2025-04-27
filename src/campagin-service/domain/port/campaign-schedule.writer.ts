import { CampaignSchedule } from '@/src/campagin-service/domain/campaign.schedule';

export interface CampaignScheduleWriter {
  save(campaignSchedule: CampaignSchedule): Promise<CampaignSchedule>;

  saveMany(campaignSchedules: CampaignSchedule[]): Promise<CampaignSchedule[]>;
}
