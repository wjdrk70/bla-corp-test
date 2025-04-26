import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductType } from '@/src/product-service/domain/product.type';
import { ProductProps } from '@/src/product-service/domain/interface/product.props';

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

  @ManyToOne(() => ProductType)
  @JoinColumn({ name: 'product_type_id' })
  productType!: ProductType;

  public static create(props: ProductProps): Product {
    const product = new Product();
    product.brandName = props.brandName;
    product.productName = props.productName;
    product.briefDescription = props.briefDescription;
    product.guide = props.guide;
    product.productType = props.productType;
    return product;
  }
  public isVisitType(): boolean {
    return this.productType.isVisitType();
  }

  public isServiceType(): boolean {
    return this.productType.isServiceType();
  }


}
