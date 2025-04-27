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
      // 필요한 DTO 속성 타입 정의
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
    // productType 객체 제외 가능
    return {
      brandName: dto.brandName,
      productName: dto.productName,
      briefDescription: dto.briefDescription,
      guide: dto.guide,
      productTypeId: productType.id,
      // productType: productType, // 필요시 포함
    };
  }

  // 방문형 Product 엔티티 생성 준비 및 호출
  public createVisitProduct(
    baseDto: {
      /* DTO 타입 */ brandName: string;
      productName: string;
      briefDescription: string;
      guide: string;
    },
    productType: ProductType, // productType 객체를 받음
    address: Address,
  ): Product {
    const baseProps = this.prepareBaseProductProps(baseDto, productType);
    const creationProps: ProductProps = {
      ...baseProps,
      productType: productType, // <<<--- 여기: productType 객체 추가!
      addressId: address.id,
      genderId: null,
      isSponsored: null,
    };
    // 단순화된 Product.create 호출
    return Product.create(creationProps); // 이제 ProductCreationProps 타입과 일치함
  }

  // 서비스형 Product 엔티티 생성 준비 및 호출
  public createServiceProduct(
    baseDto: {
      /* DTO 타입 */ brandName: string;
      productName: string;
      briefDescription: string;
      guide: string;
    },
    productType: ProductType,
    gender: Gender, // Gender 엔티티를 직접 받음
    isSponsored?: boolean | null,
  ): Product {
    const baseProps = this.prepareBaseProductProps(baseDto, productType);
    const creationProps: ProductProps = {
      ...baseProps,
      productType: productType,
      addressId: null, // 해당 없음
      genderId: gender.id, // Gender ID 설정
      isSponsored: isSponsored ?? false,
    };
    // 단순화된 Product.create 호출
    return Product.create(creationProps);
  }
}
