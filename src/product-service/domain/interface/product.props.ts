// src/product-service/domain/interface/product.props.ts
import { ProductType } from '../product.type';

export interface ProductProps {
  brandName: string;
  productName: string;
  briefDescription: string;
  guide: string;
  productType: ProductType;
}