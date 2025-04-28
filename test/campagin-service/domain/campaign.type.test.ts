import { CampaignType, CampaignTypeCode } from '@/src/campagin-service/domain/campaign.type';

describe('CampaignType 도메인 엔티티', () => {
  it('isRecruitType은 코드가 RECRUIT일 때 true를 반환해야 한다', () => {
    // given
    const campaignType = new CampaignType(); // 직접 생성 또는 팩토리 사용
    campaignType.code = CampaignTypeCode.RECRUIT;

    // when
    const result = campaignType.isRecruitType();

    // then
    expect(result).toBe(true);
  });

  it('isBidType은 코드가 BID일 때 true를 반환해야 한다', () => {
    // given
    const campaignType = new CampaignType();
    campaignType.code = CampaignTypeCode.BID;

    // when
    const result = campaignType.isBidType();

    // then
    expect(result).toBe(true);
  });

  it('isRecruitType은 코드가 BID일 때 false를 반환해야 한다', () => {
    // given
    const campaignType = new CampaignType();
    campaignType.code = CampaignTypeCode.BID;

    // when
    const result = campaignType.isRecruitType();

    // then
    expect(result).toBe(false);
  });

  it('isBidType은 코드가 RECRUIT일 때 false를 반환해야 한다', () => {
    // given
    const campaignType = new CampaignType();
    campaignType.code = CampaignTypeCode.RECRUIT;

    // when
    const result = campaignType.isBidType();

    // then
    expect(result).toBe(false);
  });
});