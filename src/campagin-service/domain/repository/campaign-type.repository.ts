import { CampaignType } from '@/src/campagin-service/domain/campaign.type';

export interface CampaignTypeRepository {
  findByCode(code: string): Promise<CampaignType | null>;
}
