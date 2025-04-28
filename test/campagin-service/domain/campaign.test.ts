import { Campaign } from '@/src/campagin-service/domain/campaign';
import { CampaignType, CampaignTypeCode} from '@/src/campagin-service/domain/campaign.type';
import { InfluencerPlatform, InfluencerPlatformCode} from '@/src/campagin-service/domain/influencer.platform';
import { CampaignProps } from '@/src/campagin-service/domain/interface/campaign.props';
import { Product } from '@/src/product-service/domain/product';

describe('Campaign 도메인 엔티티', () => {
  const mockProduct = { id: 123 } as Product; // Product는 ID만 있어도 충분
  const mockCampaignType = { id: 1, code: CampaignTypeCode.RECRUIT} as CampaignType;
  const mockPlatform = { id: 2, code: InfluencerPlatformCode.YOUTUBE} as InfluencerPlatform;

  describe('create', () => {
    it('제공된 속성으로 Campaign 인스턴스를 올바르게 생성해야 한다', () => {
      // given
      const props: CampaignProps = {
        name: '테스트 캠페인',
        budget: 100000,
        peopleCount: 10,
        productId: mockProduct.id,
        product: mockProduct,
        campaignType: mockCampaignType,
        influencerPlatform: mockPlatform,
      };

      // when
      const campaign = Campaign.create(props);

      // then
      expect(campaign).toBeInstanceOf(Campaign);
      expect(campaign.name).toBe(props.name);
      expect(campaign.budget).toBe(props.budget);
      expect(campaign.peopleCount).toBe(props.peopleCount);
      expect(campaign.productId).toBe(props.productId);
      expect(campaign.product).toBe(props.product); // 객체 할당 확인
      expect(campaign.campaignType).toBe(props.campaignType); // 객체 할당 확인
      expect(campaign.influencerPlatform).toBe(props.influencerPlatform); // 객체 할당 확인
    });
  });
});
