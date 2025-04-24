import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
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
  id: number;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @ManyToOne(() => Campaign, { eager: true })
  @JoinColumn({ name: 'campaign_id' })
  campaign!: Campaign;

  @ManyToOne(() => ScheduleType, { eager: true })
  @JoinColumn({ name: 'schedule_type_id' })
  scheduleType!: ScheduleType;
}
