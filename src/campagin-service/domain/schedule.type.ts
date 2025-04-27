import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  CampaignType,
  CampaignTypeCode,
} from '@/src/campagin-service/domain/campaign.type';
import { InfluencerPlatform } from '@/src/campagin-service/domain/influencer.platform';

export enum ScheduleTypeCode {
  CONTENT_UPLOAD = 'CONTENT_UPLOAD',
  CASTING = 'CASTING',
  RECRUIT = 'RECRUIT', // 추가: CampaignTypeCode와 중복되지만 별도 관리
  BID = 'BID',
}

@Entity('schedule_type')
export class ScheduleType {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ length: 50, unique: true })
  code!: string;

  @Column({ length: 100 })
  label!: string;

  @Column({ name: 'campaign_type_id' })
  campaignTypeId!: number;

  @Column({ name: 'influencer_platform_id' })
  influencerPlatformId!: number;

  @Column({ name: 'is_casting', type: 'boolean', default: false })
  isCasting: boolean = false;

  @Column({ name: 'is_indefinite', type: 'boolean', default: false })
  isIndefinite: boolean = false;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @ManyToOne(() => CampaignType)
  @JoinColumn({ name: 'campaign_type_id' })
  campaignType!: CampaignType;

  @ManyToOne(() => InfluencerPlatform)
  @JoinColumn({ name: 'influencer_platform_id' })
  influencerPlatform!: InfluencerPlatform;

  public static create(props: {
    code: string;
    label: string;
    campaignTypeId: number;
    influencerPlatformId: number;
    isCasting?: boolean;
    isIndefinite?: boolean;
  }): ScheduleType {
    const scheduleType = new ScheduleType();
    scheduleType.code = props.code;
    scheduleType.label = props.label;
    scheduleType.campaignTypeId = props.campaignTypeId;
    scheduleType.influencerPlatformId = props.influencerPlatformId;
    scheduleType.isCasting = props.isCasting || false;
    scheduleType.isIndefinite = props.isIndefinite || false;
    return scheduleType;
  }

  // 스케줄 타입 관련 메서드
  isRecruitSchedule(): boolean {
    return this.code === ScheduleTypeCode.RECRUIT;
  }

  isBidSchedule(): boolean {
    return this.code === ScheduleTypeCode.BID;
  }

  isContentUploadSchedule(): boolean {
    return this.code === ScheduleTypeCode.CONTENT_UPLOAD;
  }

  isCastingSchedule(): boolean {
    return this.code === ScheduleTypeCode.CASTING;
  }
}
