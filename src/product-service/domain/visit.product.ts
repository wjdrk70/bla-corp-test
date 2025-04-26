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
import { Address } from './address';

@Entity('visit_product')
export class VisitProduct {
  @PrimaryColumn({ name: 'product_id' })
  productId!: number;

  @Column({ name: 'address_id' })
  addressId!: number;

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

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address!: Address;

  public static create(productId: number, addressId: number): VisitProduct {
    const visitProduct = new VisitProduct();
    visitProduct.productId = productId;
    visitProduct.addressId = addressId;
    return visitProduct;
  }
}
