import { Campaign } from '@/src/campagin-service/domain/campaign';

export interface CampaignWriter {
  save(campaign: Campaign): Promise<Campaign>;
}
