import { CampaignType } from '@/src/campagin-service/domain/campaign.type';
import { InfluencerPlatform } from '@/src/campagin-service/domain/influencer.platform';
import { CampaignSchedule } from '@/src/campagin-service/domain/campaign.schedule';
import { Product } from '@/src/product-service/domain/product';

export interface CampaignProps {
  name: string;
  budget: number;
  peopleCount: number;
  productId: number;
  product: Product;
  campaignType: CampaignType;
  influencerPlatform: InfluencerPlatform;
}
