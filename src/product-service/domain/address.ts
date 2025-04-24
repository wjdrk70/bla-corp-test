import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ name: 'postal_code', length: 20 })
  postalCode!: string;

  @Column({ name: 'road_name', length: 200 })
  roadName!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  // 팩토리 메서드
  public static create(postalCode: string, roadName: string): Address {
    const address = new Address();
    address.postalCode = postalCode;
    address.roadName = roadName;
    return address;
  }
}