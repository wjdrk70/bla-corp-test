import { Product } from '@/src/product-service/domain/product';

export interface ProductWriter {
  save(product: Product): Promise<Product>;

}