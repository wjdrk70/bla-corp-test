import { ScheduleType, ScheduleTypeCode } from '@/src/campagin-service/domain/schedule.type';

describe('ScheduleType 도메인 엔티티', () => {


  describe('create', () => {
    it('정상적인 속성으로 ScheduleType 인스턴스를 생성해야 한다', () => {
      // given
      const props = {
        code: ScheduleTypeCode.CONTENT_UPLOAD,
        label: '콘텐츠 업로드',
        campaignTypeId: 1,
        influencerPlatformId: 2,
        isCasting: false,
        isIndefinite: false,
      };

      // when
      const scheduleType = ScheduleType.create(props);

      // then
      expect(scheduleType).toBeInstanceOf(ScheduleType);
      expect(scheduleType.code).toBe(props.code);
      expect(scheduleType.label).toBe(props.label);
      expect(scheduleType.campaignTypeId).toBe(props.campaignTypeId);
      expect(scheduleType.influencerPlatformId).toBe(props.influencerPlatformId);
      expect(scheduleType.isCasting).toBe(props.isCasting);
      expect(scheduleType.isIndefinite).toBe(props.isIndefinite);
    });

    it('isCasting과 isIndefinite가 제공되지 않으면 false로 기본 설정되어야 한다', () => {
      // given
      const props = {
        code: ScheduleTypeCode.BID,
        label: '입찰',
        campaignTypeId: 2,
        influencerPlatformId: 1,
        // isCasting, isIndefinite 생략
      };

      // when
      const scheduleType = ScheduleType.create(props);

      // then
      expect(scheduleType.isCasting).toBe(false);
      expect(scheduleType.isIndefinite).toBe(false);
    });
  });


  // boolean 메서드 테스트
  it('isRecruitSchedule은 코드가 RECRUIT일 때 true를 반환해야 한다', () => {
    // given
    const scheduleType = new ScheduleType();
    scheduleType.code = ScheduleTypeCode.RECRUIT;
    // when & then
    expect(scheduleType.isRecruitSchedule()).toBe(true);
    expect(scheduleType.isBidSchedule()).toBe(false);
  });

  it('isBidSchedule은 코드가 BID일 때 true를 반환해야 한다', () => {
    // given
    const scheduleType = new ScheduleType();
    scheduleType.code = ScheduleTypeCode.BID;
    // when & then
    expect(scheduleType.isBidSchedule()).toBe(true);
    expect(scheduleType.isRecruitSchedule()).toBe(false);
  });

  it('isContentUploadSchedule은 코드가 CONTENT_UPLOAD일 때 true를 반환해야 한다', () => {
    // given
    const scheduleType = new ScheduleType();
    scheduleType.code = ScheduleTypeCode.CONTENT_UPLOAD;
    // when & then
    expect(scheduleType.isContentUploadSchedule()).toBe(true);
  });

  it('isCastingSchedule은 코드가 CASTING일 때 true를 반환해야 한다', () => {
    // given
    const scheduleType = new ScheduleType();
    scheduleType.code = ScheduleTypeCode.CASTING;
    // when & then
    expect(scheduleType.isCastingSchedule()).toBe(true);
  });
});