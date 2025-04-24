import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CampaignType, CampaignTypeCode } from '@/src/campagin-service/domain/campaign.type';
import { InfluencerPlatform } from '@/src/campagin-service/domain/influencer.platform';

export enum ScheduleTypeCode {
  'CONTENT_UPLOAD' = 'CONTENT_UPLOAD',
  'CASTING' = 'CASTING',
}

@Entity('schedule_type')
export class ScheduleType {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ length: 50, unique: true })
  code!: string;

  @Column({ length: 100 })
  label!: string;

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

  @ManyToOne(() => CampaignType, { eager: true })
  @JoinColumn({ name: 'campaign_type_id' })
  campaignType!: CampaignType;

  @ManyToOne(() => InfluencerPlatform, { eager: true })
  @JoinColumn({ name: 'influencer_platform_id' })
  influencerPlatform!: InfluencerPlatform;
}
