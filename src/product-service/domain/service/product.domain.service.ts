import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductProps } from '@/src/product-service/domain/interface/product.props';
import { Product } from '@/src/product-service/domain/product';
import { Address } from '@/src/product-service/domain/address';
import { ProductType } from '@/src/product-service/domain/product.type';
import { Gender } from '@/src/product-service/domain/gender';

@Injectable()
export class ProductDomainService {
  public validateVisitProductInput(
    postalCode?: string,
    roadName?: string,
  ): void {
    if (!postalCode || !roadName) {
      throw new BadRequestException(
        '방문형 상품은 우편번호와 주소가 필요합니다.',
      );
    }
  }

  public validateServiceProductInput(genderCode?: string): void {
    if (!genderCode) {
      throw new BadRequestException('서비스형 상품은 성별 정보가 필요합니다.');
    }
  }

  public createProduct(props: ProductProps): Product {
    return Product.create(props);
  }

  public createAddress(postalCode: string, roadName: string): Address {
    return Address.create(postalCode, roadName);
  }

  private prepareBaseProductProps(
    dto: {
      brandName: string;
      productName: string;
      briefDescription: string;
      guide: string;
    },
    productType: ProductType,
  ): Omit<
    ProductProps,
    'addressId' | 'genderId' | 'isSponsored' | 'productType'
  > {
    return {
      brandName: dto.brandName,
      productName: dto.productName,
      briefDescription: dto.briefDescription,
      guide: dto.guide,
      productTypeId: productType.id,
    };
  }

  public createVisitProduct(
    baseDto: {
      brandName: string;
      productName: string;
      briefDescription: string;
      guide: string;
    },
    productType: ProductType,
    address: Address,
  ): Product {
    const baseProps = this.prepareBaseProductProps(baseDto, productType);
    const creationProps: ProductProps = {
      ...baseProps,
      productType: productType,
      addressId: address.id,
      genderId: null,
      isSponsored: null,
    };

    return Product.create(creationProps);
  }

  public createServiceProduct(
    baseDto: {
      brandName: string;
      productName: string;
      briefDescription: string;
      guide: string;
    },
    productType: ProductType,
    gender: Gender,
    isSponsored?: boolean | null,
  ): Product {
    const baseProps = this.prepareBaseProductProps(baseDto, productType);
    const creationProps: ProductProps = {
      ...baseProps,
      productType: productType,
      addressId: null,
      genderId: gender.id,
      isSponsored: isSponsored ?? false,
    };

    return Product.create(creationProps);
  }
}
