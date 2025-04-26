import { ProductType } from '@/src/product-service/domain/product.type';

export interface ProductTypeReader {
  findByCode(code: string): Promise<ProductType | null>;

  findByCodeOrThrow(code: string): Promise<ProductType>;
}
