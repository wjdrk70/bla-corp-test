import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum InfluencerPlatformCode {
  INSTAGRAM = 'INSTAGRAM',
  YOUTUBE = 'YOUTUBE',
}

@Entity('influencer_platform')
export class InfluencerPlatform {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 100 })
  label: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  isInstagram(): boolean {
    return this.code === InfluencerPlatformCode.INSTAGRAM;
  }

  isYoutube(): boolean {
    return this.code === InfluencerPlatformCode.YOUTUBE;
  }
}
