import { Campaign } from '@/src/campagin-service/domain/campaign';

export interface CampaignRepository {
  save(campaign: Campaign): Promise<Campaign>;
}
