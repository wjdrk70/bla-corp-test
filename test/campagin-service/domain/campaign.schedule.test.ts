import { CampaignSchedule } from '@/src/campagin-service/domain/campaign.schedule';

describe('CampaignSchedule 도메인 엔티티', () => {
  describe('create', () => {
    it('정상적인 속성으로 CampaignSchedule 인스턴스를 생성해야 한다', () => {
      // given
      const props = {
        campaignId: 10,
        scheduleTypeId: 20,
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-10-10'),
      };

      // when
      const schedule = CampaignSchedule.create(props);

      // then
      expect(schedule).toBeInstanceOf(CampaignSchedule);
      expect(schedule.campaignId).toBe(props.campaignId);
      expect(schedule.scheduleTypeId).toBe(props.scheduleTypeId);
      expect(schedule.startDate).toEqual(props.startDate);
      expect(schedule.endDate).toEqual(props.endDate);
    });

    it('startDate가 제공되지 않으면 null로 설정되어야 한다', () => {
      // given
      const props = { campaignId: 11, scheduleTypeId: 21, endDate: new Date('2025-11-11') };
      // when
      const schedule = CampaignSchedule.create(props);
      // then
      expect(schedule.startDate).toBeNull();
      expect(schedule.endDate).toEqual(props.endDate);
    });

    it('endDate가 제공되지 않으면 null로 설정되어야 한다', () => {
      // given
      const props = { campaignId: 12, scheduleTypeId: 22, startDate: new Date('2025-12-12') };
      // when
      const schedule = CampaignSchedule.create(props);
      // then
      expect(schedule.startDate).toEqual(props.startDate);
      expect(schedule.endDate).toBeNull();
    });

    it('startDate와 endDate가 모두 제공되지 않으면 null로 설정되어야 한다', () => {
      // given
      const props = { campaignId: 13, scheduleTypeId: 23 };
      // when
      const schedule = CampaignSchedule.create(props);
      // then
      expect(schedule.startDate).toBeNull();
      expect(schedule.endDate).toBeNull();
    });
  });
});