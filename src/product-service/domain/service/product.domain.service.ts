import { Injectable } from '@nestjs/common';
import { ProductProps } from '@/src/product-service/domain/interface/product.props';
import { Product } from '@/src/product-service/domain/product';
import { Address } from '@/src/product-service/domain/address';
import { VisitProduct } from '@/src/product-service/domain/visit.product';
import { ServiceProduct } from '@/src/product-service/domain/service.product';


@Injectable()
export class ProductDomainService {
  validateVisitProductFields(postalCode?: string, roadName?: string): void {
    if (!postalCode || !roadName) {
      throw new Error('방문형 상품은 우편번호와 주소가 필요합니다');
    }
  }

  validateServiceProductFields(genderCode?: string): void {
    if (!genderCode) {
      throw new Error('서비스형 상품은 성별 정보가 필요합니다');
    }
  }


  createProduct(props: ProductProps): Product {
    return Product.create(props);
  }

  createAddress(postalCode: string, roadName: string): Address {
    this.validateVisitProductFields(postalCode, roadName);
    return Address.create(postalCode, roadName);
  }

  createVisitProduct(productId: number, addressId: number): VisitProduct {
    return VisitProduct.create(productId, addressId);
  }


  createServiceProduct(
    productId: number,
    genderId: number,
    isSponsored: boolean,
  ): ServiceProduct {
    return ServiceProduct.create(productId, genderId, isSponsored);
  }
}
