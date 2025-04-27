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
import { Gender } from '@/src/product-service/domain/gender';
import { Address } from '@/src/product-service/domain/address';

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

  @Column({ name: 'product_type_id' })
  productTypeId!: number;

  @Column({ name: 'address_id', type: 'bigint', nullable: true })
  addressId?: number | null;

  @Column({ name: 'gender_id', type: 'bigint', nullable: true })
  genderId?: number | null;

  @Column({
    name: 'is_sponsored',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isSponsored?: boolean | null;

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

  @ManyToOne(() => Gender, { nullable: true })
  @JoinColumn({ name: 'gender_id' })
  gender?: Gender | null;

  @ManyToOne(() => Address, { nullable: true })
  @JoinColumn({ name: 'address_id' })
  address?: Address | null;

  public static create(props: ProductProps): Product {
    const product = new Product();
    product.brandName = props.brandName;
    product.productName = props.productName;
    product.briefDescription = props.briefDescription;
    product.guide = props.guide;
    product.productTypeId = props.productType.id;

    product.addressId = props.addressId;
    product.genderId = props.genderId;
    product.isSponsored = props.isSponsored ?? false;

    return product;
  }

  public isVisitType(): boolean {
    return this.productType.isVisitType();
  }

  public isServiceType(): boolean {
    return this.productType.isServiceType();
  }
}
