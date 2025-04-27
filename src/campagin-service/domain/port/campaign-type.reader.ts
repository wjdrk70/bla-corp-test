import { CampaignType } from '@/src/campagin-service/domain/campaign.type';

export interface CampaignTypeReader {
  findByCodeOrThrow(code: string): Promise<CampaignType>;

  findByIdOrThrow(id: number): Promise<CampaignType>;
}
