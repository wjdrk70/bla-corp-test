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

  @ManyToOne(() => CampaignType, { eager: true })
  @JoinColumn({ name: 'campaign_type_id' })
  campaignType!: CampaignType;

  @ManyToOne(() => InfluencerPlatform, { eager: true })
  @JoinColumn({ name: 'influencer_platform_id' })
  influencerPlatform!: InfluencerPlatform;

  @OneToMany(() => CampaignSchedule, (schedule) => schedule.campaign, {
    cascade: true,
    eager: true,
  }) // cascade:true -> 캠페인 저장시 스케줄도 함께 저장
  schedules!: CampaignSchedule[];

  public static create(props: CampaignProps): Campaign {
    const campaign = new Campaign();

    // 기본 속성 할당
    campaign.name = props.name;
    campaign.budget = props.budget;
    campaign.peopleCount = props.peopleCount;
    campaign.productId = props.productId;
    campaign.isDeleted = false; // 기본값 설정

    // --- 연관 객체 할당 ---
    // 서비스 레이어에서 조회/생성된 완전한 객체를 직접 할당
    campaign.campaignType = props.campaignType;
    campaign.influencerPlatform = props.influencerPlatform;

    // --- 스케줄 처리 및 연관관계 설정 ---
    // props.schedules 배열의 각 CampaignSchedule 객체에
    // 현재 생성 중인 Campaign 객체를 연결해줍니다. (양방향 관계 설정)
    campaign.schedules = props.schedules.map((schedule) => {
      schedule.campaign = campaign; // CampaignSchedule의 campaign 속성에 현재 캠페인 할당
      return schedule;
    });

    // --- 도메인 유효성 검증 (예시) ---
    // campaign.validateRequiredSchedules(); // 필요한 경우 여기서 호출

    return campaign;
  }
}
