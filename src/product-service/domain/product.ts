import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductType } from '@/src/product-service/domain/product.type';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'brand_name', length: 200 })
  brandName!: string;

  @Column({ name: 'product_name', length: 200 })
  productName!: string;

  @Column({ name: 'brief_description', length: 500 })
  briefDescription!: string;

  @Column({ name: 'guide', length: 500 })
  guide!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @ManyToOne(() => ProductType, { eager: true })
  @JoinColumn({ name: 'product_type_id' })
  productType!: ProductType;
}
