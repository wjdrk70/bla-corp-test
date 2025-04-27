// src/product-service/domain/interface/product.props.ts
import { ProductType } from '../product.type';

export interface ProductProps {
  brandName: string;
  productName: string;
  briefDescription: string;
  guide: string;
  productTypeId: number;
  productType: ProductType;
  addressId?: number | null;
  genderId?: number | null;
  isSponsored?: boolean | null;
}