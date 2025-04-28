import { InfluencerPlatform, InfluencerPlatformCode } from '@/src/campagin-service/domain/influencer.platform';

describe('InfluencerPlatform 도메인 엔티티', () => {
  it('isInstagram은 코드가 INSTAGRAM일 때 true를 반환해야 한다', () => {
    // given
    const platform = new InfluencerPlatform();
    platform.code = InfluencerPlatformCode.INSTAGRAM;

    // when
    const result = platform.isInstagram();

    // then
    expect(result).toBe(true);
  });

  it('isYoutube은 코드가 YOUTUBE일 때 true를 반환해야 한다', () => {
    // given
    const platform = new InfluencerPlatform();
    platform.code = InfluencerPlatformCode.YOUTUBE;

    // when
    const result = platform.isYoutube();

    // then
    expect(result).toBe(true);
  });

  it('isInstagram은 코드가 YOUTUBE일 때 false를 반환해야 한다', () => {
    // given
    const platform = new InfluencerPlatform();
    platform.code = InfluencerPlatformCode.YOUTUBE;

    // when
    const result = platform.isInstagram();

    // then
    expect(result).toBe(false);
  });

  it('isYoutube은 코드가 INSTAGRAM일 때 false를 반환해야 한다', () => {
    // given
    const platform = new InfluencerPlatform();
    platform.code = InfluencerPlatformCode.INSTAGRAM;

    // when
    const result = platform.isYoutube();

    // then
    expect(result).toBe(false);
  });
});