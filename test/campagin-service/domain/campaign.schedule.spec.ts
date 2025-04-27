import { Campaign } from '@/src/campagin-service/domain/campaign';
import { CampaignSchedule } from '../../../src/campagin-service/domain/campaign.schedule';

describe('CampaignSchedule', () => {
  describe('createSchedule', () => {
    it('should create a schedule with correct properties', () => {
      // Arrange
      const campaignId = 1001;
      const scheduleTypeCode = 'RECRUIT';
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');

      // Act
      const schedule = CampaignSchedule.createSchedule(
        campaignId,
        scheduleTypeCode,
        startDate,
        endDate,
      );

      // Assert
      expect(schedule).toBeInstanceOf(CampaignSchedule);
      expect(schedule.campaignId).toBe(campaignId);
      expect(schedule.scheduleTypeCode).toBe(scheduleTypeCode);
      expect(schedule.startDate).toBe(startDate);
      expect(schedule.endDate).toBe(endDate);
    });

    it('should create a schedule with null end date for indefinite campaigns', () => {
      // Arrange
      const campaignId = 1002;
      const scheduleTypeCode = 'BID';
      const startDate = new Date('2023-02-01');
      const endDate = null;

      // Act
      const schedule = CampaignSchedule.createSchedule(
        campaignId,
        scheduleTypeCode,
        startDate,
        endDate,
      );

      // Assert
      expect(schedule).toBeInstanceOf(CampaignSchedule);
      expect(schedule.campaignId).toBe(campaignId);
      expect(schedule.scheduleTypeCode).toBe(scheduleTypeCode);
      expect(schedule.startDate).toBe(startDate);
      expect(schedule.endDate).toBeNull();
    });
  });

  describe('validate', () => {
    it('should validate a schedule with start and end dates for definite campaigns', () => {
      // Arrange
      const schedule = CampaignSchedule.createSchedule(
        1001,
        'RECRUIT',
        new Date('2023-01-01'),
        new Date('2023-01-31'),
      );
      const campaign = new Campaign();
      campaign.isIndefinite = false;
      schedule.campaign = campaign;

      // Act & Assert
      expect(schedule.validate()).toBe(true);
    });

    it('should invalidate a schedule without end date for definite campaigns', () => {
      // Arrange
      const schedule = CampaignSchedule.createSchedule(
        1001,
        'RECRUIT',
        new Date('2023-01-01'),
        null,
      );
      const campaign = new Campaign();
      campaign.isIndefinite = false;
      schedule.campaign = campaign;

      // Act & Assert
      expect(schedule.validate()).toBe(false);
    });

    it('should validate a schedule with only start date for indefinite campaigns', () => {
      // Arrange
      const schedule = CampaignSchedule.createSchedule(
        1002,
        'BID',
        new Date('2023-02-01'),
        null,
      );
      const campaign = new Campaign();
      campaign.isIndefinite = true;
      schedule.campaign = campaign;

      // Act & Assert
      expect(schedule.validate()).toBe(true);
    });

    it('should invalidate a schedule without start date for indefinite campaigns', () => {
      // Arrange
      const schedule = CampaignSchedule.createSchedule(1002, 'BID', null, null);
      const campaign = new Campaign();
      campaign.isIndefinite = true;
      schedule.campaign = campaign;

      // Act & Assert
      expect(schedule.validate()).toBe(false);
    });
  });

  describe('isWithinPeriod', () => {
    it('should return true for a date within the schedule period', () => {
      // Arrange
      const schedule = CampaignSchedule.createSchedule(
        1001,
        'RECRUIT',
        new Date('2023-01-01'),
        new Date('2023-01-31'),
      );
      const testDate = new Date('2023-01-15');

      // Act & Assert
      expect(schedule.isWithinPeriod(testDate)).toBe(true);
    });

    it('should return true for a date equal to start date', () => {
      // Arrange
      const startDate = new Date('2023-01-01');
      const schedule = CampaignSchedule.createSchedule(
        1001,
        'RECRUIT',
        startDate,
        new Date('2023-01-31'),
      );

      // Act & Assert
      expect(schedule.isWithinPeriod(startDate)).toBe(true);
    });

    it('should return true for a date equal to end date', () => {
      // Arrange
      const endDate = new Date('2023-01-31');
      const schedule = CampaignSchedule.createSchedule(
        1001,
        'RECRUIT',
        new Date('2023-01-01'),
        endDate,
      );

      // Act & Assert
      expect(schedule.isWithinPeriod(endDate)).toBe(true);
    });

    it('should return false for a date before the schedule period', () => {
      // Arrange
      const schedule = CampaignSchedule.createSchedule(
        1001,
        'RECRUIT',
        new Date('2023-01-01'),
        new Date('2023-01-31'),
      );
      const testDate = new Date('2022-12-31');

      // Act & Assert
      expect(schedule.isWithinPeriod(testDate)).toBe(false);
    });

    it('should return false for a date after the schedule period', () => {
      // Arrange
      const schedule = CampaignSchedule.createSchedule(
        1001,
        'RECRUIT',
        new Date('2023-01-01'),
        new Date('2023-01-31'),
      );
      const testDate = new Date('2023-02-01');

      // Act & Assert
      expect(schedule.isWithinPeriod(testDate)).toBe(false);
    });

    it('should return true for a date after start date with no end date (indefinite)', () => {
      // Arrange
      const schedule = CampaignSchedule.createSchedule(
        1002,
        'BID',
        new Date('2023-02-01'),
        null,
      );
      const testDate = new Date('2023-03-15');

      // Act & Assert
      expect(schedule.isWithinPeriod(testDate)).toBe(true);
    });

    it('should return false for a date before start date with no end date (indefinite)', () => {
      // Arrange
      const schedule = CampaignSchedule.createSchedule(
        1002,
        'BID',
        new Date('2023-02-01'),
        null,
      );
      const testDate = new Date('2023-01-15');

      // Act & Assert
      expect(schedule.isWithinPeriod(testDate)).toBe(false);
    });

    it('should return false if start date is null', () => {
      // Arrange
      const schedule = CampaignSchedule.createSchedule(1002, 'BID', null, null);
      const testDate = new Date('2023-01-15');

      // Act & Assert
      expect(schedule.isWithinPeriod(testDate)).toBe(false);
    });
  });
});
