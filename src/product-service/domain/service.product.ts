import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product';
import { Gender } from './gender';

@Entity('service_product')
export class ServiceProduct {
  @PrimaryColumn({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'gender_id' })
  genderId!: number;

  @Column({ name: 'is_sponsored', type: 'boolean', default: false })
  isSponsored: boolean = false;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @OneToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product!: Promise<Product>;

  @ManyToOne(() => Gender)
  @JoinColumn({ name: 'gender_id' })
  gender!: Gender;

  public static create(
    productId: number,
    genderId: number,
    isSponsored: boolean,
  ): ServiceProduct {
    const serviceProduct = new ServiceProduct();
    serviceProduct.productId = productId;
    serviceProduct.genderId = genderId;
    serviceProduct.isSponsored = isSponsored;
    return serviceProduct;
  }
}
