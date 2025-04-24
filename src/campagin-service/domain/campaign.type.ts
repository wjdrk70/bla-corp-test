import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CampaignTypeCode {
  RECRUIT = 'RECRUIT',
  BID = 'BID',
}

@Entity('campaign_type')
export class CampaignType {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 100 })
  label: string;

  @CreateDateColumn({ name: 'created_at',type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  public isRecruitType(): boolean {
    return this.code === CampaignTypeCode.RECRUIT;
  }

  public isBidType(): boolean {
    return this.code === CampaignTypeCode.BID;
  }
}
