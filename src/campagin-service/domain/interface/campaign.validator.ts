import { Campaign } from '@/src/campagin-service/domain/campaign';
import { InfluencerPlatform } from '@/src/campagin-service/domain/influencer.platform';
import { CampaignTypeCode } from '@/src/campagin-service/domain/campaign.type';

export interface CampaignValidator {
  validate(campaign: Campaign, platform: InfluencerPlatform): void;

  getRequiredFields(): string[];

  getRequiredScheduleTypes(): CampaignTypeCode;

  isIndefiniteAllowed?(platform: InfluencerPlatform): boolean;
}
