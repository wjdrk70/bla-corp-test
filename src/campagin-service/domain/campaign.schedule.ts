import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Campaign } from '@/src/campagin-service/domain/campaign';
import { ScheduleType } from '@/src/campagin-service/domain/schedule.type';

@Entity('campaign_schedule')
@Unique('uq_campaign_schedule', ['campaignId', 'scheduleTypeId'])
export class CampaignSchedule {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate!: Date | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'campaign_id' })
  campaignId!: number;

  @Column({ name: 'schedule_type_id' })
  scheduleTypeId!: number;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @ManyToOne(() => Campaign)
  @JoinColumn({ name: 'campaign_id' })
  campaign!: Campaign;

  @ManyToOne(() => ScheduleType)
  @JoinColumn({ name: 'schedule_type_id' })
  scheduleType!: ScheduleType;

  public static create(props: {
    campaignId: number;
    scheduleTypeId: number;
    startDate?: Date | null;
    endDate?: Date | null;
  }): CampaignSchedule {
    const schedule = new CampaignSchedule();
    schedule.campaignId = props.campaignId;
    schedule.scheduleTypeId = props.scheduleTypeId;
    schedule.startDate = props.startDate || null;
    schedule.endDate = props.endDate || null;
    return schedule;
  }
}
