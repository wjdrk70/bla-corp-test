import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CampaignType } from '@/src/campagin-service/domain/campaign.type';
import { InfluencerPlatform } from '@/src/campagin-service/domain/influencer.platform';
import { CampaignProps } from '@/src/campagin-service/domain/interface/campaign.props';
import { CampaignSchedule } from '@/src/campagin-service/domain/campaign.schedule';

@Entity('campaign')
export class Campaign {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ length: 200 })
  name!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  budget!: number;

  @Column({ name: 'people_count', type: 'int' })
  peopleCount!: number;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean = false;

  @Column({ name: 'product_id' })
  productId!: number; // 상품 ID만 참조

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

  @OneToMany(() => CampaignSchedule, (schedule) => schedule.campaign)
  schedules!: Promise<CampaignSchedule[]>;

  public static create(props: CampaignProps): Campaign {
    const campaign = new Campaign();
    campaign.name = props.name;
    campaign.budget = props.budget;
    campaign.peopleCount = props.peopleCount;
    campaign.productId = props.productId;
    campaign.campaignType = props.campaignType;
    campaign.influencerPlatform = props.influencerPlatform;
    return campaign;
  }

}
