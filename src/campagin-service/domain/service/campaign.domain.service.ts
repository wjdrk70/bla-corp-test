import { BadRequestException, Injectable } from '@nestjs/common';
import { Campaign } from '@/src/campagin-service/domain/campaign';
import { CampaignType } from '@/src/campagin-service/domain/campaign.type';
import { ScheduleType } from '@/src/campagin-service/domain/schedule.type';
import { CampaignSchedule } from '@/src/campagin-service/domain/campaign.schedule';
import { CampaignProps } from '@/src/campagin-service/domain/interface/campaign.props';

@Injectable()
export class CampaignDomainService {
  // 캠페인 생성
  createCampaign(props: CampaignProps): Campaign {
    this.validateCampaignCreation(props);
    return Campaign.create(props);
  }

  // 캠페인 스케줄 생성
  createCampaignSchedule(
    campaignId: number,
    scheduleType: ScheduleType,
    startDate?: Date | null,
    endDate?: Date | null,
  ): CampaignSchedule {
    this.validateScheduleCreation(scheduleType, startDate, endDate);

    return CampaignSchedule.create({
      campaignId: campaignId,
      scheduleTypeId: scheduleType.id,
      startDate: startDate || null,
      endDate: endDate || null,
    });
  }

  // 캠페인 생성 시 유효성 검증 - 필드별로 메서드 분리
  validateCampaignCreation(props: CampaignProps): void {
    this.validateBasicCampaignFields(props);
    this.validateCampaignRelationships(props);
  }

  // 기본 필드 검증
  private validateBasicCampaignFields(props: CampaignProps): void {
    if (!props.name || props.name.trim() === '') {
      throw new Error('캠페인 이름은 필수입니다.');
    }

    if (props.budget <= 0) {
      throw new Error('예산은 0보다 커야 합니다.');
    }

    if (props.peopleCount <= 0) {
      throw new Error('인원 수는 0보다 커야 합니다.');
    }
  }

  // 연관 관계 검증
  private validateCampaignRelationships(props: CampaignProps): void {
    if (!props.productId) {
      throw new Error('상품 ID는 필수입니다.');
    }

    if (!props.campaignType) {
      throw new Error('캠페인 타입은 필수입니다.');
    }

    if (!props.influencerPlatform) {
      throw new Error('인플루언서 플랫폼은 필수입니다.');
    }
  }

  // 캠페인 스케줄 생성 전 유효성 검증 - 스케줄 타입별 분리
  validateScheduleCreation(
    scheduleType: ScheduleType,
    startDate?: Date | null,
    endDate?: Date | null,
  ): void {
    if (scheduleType.isCastingSchedule()) {
      this.validateCastingSchedule(startDate);
      return;
    }
    // 2) 콘텐츠 업로드 일정이면 전용 검증
    if (scheduleType.isContentUploadSchedule()) {
      this.validateContentUploadSchedule(startDate, endDate);
      return;
    }
    // 3) 그 외 (일반/입찰) 일정에 대해 날짜 쌍 검증
    this.validateCommonScheduleRules(scheduleType, startDate, endDate);
  }

  // 공통 스케줄 규칙 검증
  private validateCommonScheduleRules(
    scheduleType: ScheduleType,
    startDate?: Date | null,
    endDate?: Date | null,
  ): void {
    // 무기한 일정이 아닌데 날짜가 없는 경우
    if (!scheduleType.isIndefinite && (!startDate || !endDate)) {
      throw new Error('무기한이 아닌 일정은 시작일과 종료일이 필요합니다.');
    }

    // 시작일이 종료일보다 늦은 경우
    if (startDate && endDate && startDate > endDate) {
      throw new Error('일정 시작일은 종료일보다 이전이어야 합니다.');
    }
  }

  // 캐스팅 일정 검증
  private validateCastingSchedule(startDate?: Date | null): void {
    if (!startDate) {
      throw new Error('캐스팅 일정은 시작일이 필요합니다.');
    }
  }

  // 컨텐츠 업로드 일정 검증
  private validateContentUploadSchedule(startDate?: Date | null, endDate?: Date | null): void {
    if (!startDate || !endDate) {
      throw new Error('컨텐츠 업로드 일정은 시작일과 종료일이 모두 필요합니다.');
    }

    // 현재 날짜 기준으로 미래 날짜인지 확인
    const now = new Date();
    if (startDate < now) {
      throw new Error('컨텐츠 업로드 시작일은 현재 이후여야 합니다.');
    }
  }
  validateSupportedScheduleTypes(
    campaign: Campaign,
    requestedCodes: string[],
    validTypes: ScheduleType[],
  ): void {
    const validCodes = new Set(validTypes.map((t) => t.code));
    for (const code of requestedCodes) {
      if (!validCodes.has(code)) {
        throw new BadRequestException(
          `플랫폼(${campaign.influencerPlatform.code})에 ` +
          `유효하지 않은 스케줄 타입입니다: ${code}`,
        );
      }
    }
  }


  // 캠페인에 필요한 스케줄 타입 검증
  validateRequiredScheduleTypes(
    campaign: Campaign,
    scheduleTypes: ScheduleType[],
  ): void {
    // 캠페인 타입별 필수 스케줄 검증
    this.validateCampaignTypeRequiredSchedules(campaign.campaignType, scheduleTypes);

    // 기타 필수 스케줄 검증
    this.validateCastingScheduleRequirement(scheduleTypes);
  }

  // 캠페인 타입별 필수 스케줄 검증
  private validateCampaignTypeRequiredSchedules(
    campaignType: CampaignType,
    scheduleTypes: ScheduleType[]
  ): void {
    // 모집형 캠페인은 모집 스케줄이 필요
    if (
      campaignType.isRecruitType() &&
      !scheduleTypes.some((s) => s.isRecruitSchedule())
    ) {
      throw new Error('모집형 캠페인에는 모집 일정이 필요합니다.');
    }

    // 입찰형 캠페인은 입찰 스케줄이 필요
    if (
      campaignType.isBidType() &&
      !scheduleTypes.some((s) => s.isBidSchedule())
    ) {
      throw new Error('입찰형 캠페인에는 입찰 일정이 필요합니다.');
    }
  }

  // 캐스팅 스케줄 필요 여부 검증
  private validateCastingScheduleRequirement(scheduleTypes: ScheduleType[]): void {
    // 필수 스케줄 타입 검증 (isCasting이 true인 스케줄)
    const requiredCastingSchedules = scheduleTypes.filter((s) => s.isCasting);
    if (
      requiredCastingSchedules.length > 0 &&
      !scheduleTypes.some((s) => s.isCastingSchedule())
    ) {
      throw new Error('이 캠페인에는 캐스팅 일정이 필요합니다.');
    }
  }
}
