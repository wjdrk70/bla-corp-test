import { Campaign } from '@/src/campagin-service/domain/campaign';
import {
  CampaignType,
  CampaignTypeCode,
} from '@/src/campagin-service/domain/campaign.type';
import {
  InfluencerPlatform,
  InfluencerPlatformCode,
} from '@/src/campagin-service/domain/influencer.platform';
import { CampaignSchedule } from '@/src/campagin-service/domain/campaign.schedule';
import {
  ScheduleType,
  ScheduleTypeCode,
} from '@/src/campagin-service/domain/schedule.type';

describe('Campaign 도메인 엔티티', () => {
  // Mock Data
  const recruitType = Object.assign(new CampaignType(), {
    id: 1,
    code: CampaignTypeCode.RECRUIT,
    label: '모집형',
  });
  const bidType = Object.assign(new CampaignType(), {
    id: 2,
    code: CampaignTypeCode.BID,
    label: '입찰형',
  });
  const youtubePlatform = Object.assign(new InfluencerPlatform(), {
    id: 2,
    code: InfluencerPlatformCode.YOUTUBE,
    label: '유튜브',
  });

  const recruitSchedType = Object.assign(new ScheduleType(), {
    id: 1,
    code: CampaignTypeCode.RECRUIT,
    label: '모집 일정',
    isCasting: false,
    isIndefinite: false,
    campaignType: recruitType,
    influencerPlatform: youtubePlatform,
  });
  const bidSchedType = Object.assign(new ScheduleType(), {
    id: 2,
    code: CampaignTypeCode.BID,
    label: '입찰 일정',
    isCasting: false,
    isIndefinite: true,
    campaignType: bidType,
    influencerPlatform: youtubePlatform,
  });
  const castingSchedType = Object.assign(new ScheduleType(), {
    id: 3,
    code: ScheduleTypeCode.CASTING,
    label: '캐스팅 일정',
    isCasting: true,
    isIndefinite: false,
    campaignType: bidType,
    influencerPlatform: youtubePlatform,
  });
  const contentUploadSchedType = Object.assign(new ScheduleType(), {
    id: 4,
    code: ScheduleTypeCode.CONTENT_UPLOAD,
    label: '콘텐츠 업로드 일정',
    isCasting: false,
    isIndefinite: false,
    campaignType: bidType,
    influencerPlatform: youtubePlatform,
  });

  const recruitSchedule = Object.assign(new CampaignSchedule(), {
    id: 1,
    scheduleType: recruitSchedType,
    startDate: new Date('2025-04-21'),
    endDate: new Date('2025-04-28'),
  });
  const bidSchedule = Object.assign(new CampaignSchedule(), {
    id: 2,
    scheduleType: bidSchedType,
    startDate: new Date('2025-04-21'),
    endDate: null,
  });
  const castingSchedule = Object.assign(new CampaignSchedule(), {
    id: 3,
    scheduleType: castingSchedType,
    startDate: new Date('2025-04-22'),
    endDate: new Date('2025-04-25'),
  });
  const contentUploadSchedule = Object.assign(new CampaignSchedule(), {
    id: 4,
    scheduleType: contentUploadSchedType,
    startDate: new Date('2025-04-26'),
    endDate: new Date('2025-05-05'),
  });

  describe('Campaign 생성 및 초기', () => {
    it('모집형 + 유튜브 캠페인 생성', () => {
      //Arrange
      const props = {
        name: '테스트 모집형 유튜브 캠페인',
        budget: 1_000_000,
        peopleCount: 10,
        productId: 123,
        campaignType: recruitType,
        influencerPlatform: youtubePlatform,
        schedules: [recruitSchedule],
      };

      //Act
      const campaign = Campaign.create(props);

      //Assert
      //기본 설정
      expect(campaign).toBeInstanceOf(Campaign);
      expect(campaign.name).toBe(props.name);
      expect(campaign.budget).toBe(props.budget);
      expect(campaign.peopleCount).toBe(props.peopleCount);
      expect(campaign.productId).toBe(props.productId);
      expect(campaign.campaignType).toBe(recruitType); // 객체 자체 비교
      expect(campaign.influencerPlatform).toBe(youtubePlatform); // 객체 자체 비교
      expect(campaign.isDeleted).toBe(false);

      // 스케
      expect(campaign.schedules).toBeDefined();
      expect(campaign.schedules.length).toBe(1);
      expect(campaign.schedules[0]).toBe(recruitSchedule); // 전달된 스케줄 객체와 동일한지 확인
      expect(campaign.schedules[0].scheduleType).toBe(recruitSchedType);

      expect(campaign.schedules[0].campaign).toBe(campaign);
    });

    it('입찰형 + 유튜브 캠페인 생성', () => {
      //Arrange
      const relatedSchedules = [
        bidSchedule,
        castingSchedule,
        contentUploadSchedule,
      ];

      const props = {
        name: '테스트 입찰형 유튜브 캠페인',
        budget: 2_000_000,
        peopleCount: 5,
        productId: 456,
        campaignType: bidType,
        influencerPlatform: youtubePlatform,
        schedules: relatedSchedules,
      };
      //Act
      const campaign = Campaign.create(props);

      //Assert
      expect(campaign).toBeInstanceOf(Campaign);
      expect(campaign.name).toBe(props.name);
      expect(campaign.budget).toBe(props.budget);
      expect(campaign.peopleCount).toBe(props.peopleCount);
      expect(campaign.productId).toBe(props.productId);
      expect(campaign.campaignType).toBe(bidType);
      expect(campaign.influencerPlatform).toBe(youtubePlatform);
      expect(campaign.isDeleted).toBe(false);

      //스케줄
      expect(campaign.schedules).toBeDefined();
      expect(campaign.schedules.length).toBe(relatedSchedules.length);
      expect(campaign.schedules).toEqual(
        expect.arrayContaining(relatedSchedules),
      );

      campaign.schedules.map((schedule) => {
        expect(schedule.campaign).toBe(campaign);
      });

      expect(
        campaign.schedules.some((s) => s.scheduleType === bidSchedType),
      ).toBe(true);
      expect(
        campaign.schedules.some((s) => s.scheduleType === castingSchedType),
      ).toBe(true);
      expect(
        campaign.schedules.some(
          (s) => s.scheduleType === contentUploadSchedType,
        ),
      ).toBe(true);
    });
  });
});
