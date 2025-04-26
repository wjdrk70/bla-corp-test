import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductTypeCode {
  VISIT = 'VISIT',
  SERVICE = 'SERVICE',
}

@Entity('product_type')
export class ProductType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  code!: string;

  @Column({ length: 100 })
  label!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  public isVisitType(): boolean {
    return this.code === ProductTypeCode.VISIT;
  }

  public isServiceType(): boolean {
    return this.code === ProductTypeCode.SERVICE;
  }
}
