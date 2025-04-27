import { ProductDomainService } from '@/src/product-service/domain/service/product.domain.service';
import { BadRequestException } from '@nestjs/common';
import { ProductType } from '@/src/product-service/domain/product.type';
import { ProductProps } from '@/src/product-service/domain/interface/product.props';
import { Product } from '@/src/product-service/domain/product';
import { Address } from '@/src/product-service/domain/address';
import { VisitProduct } from '@/src/product-service/domain/visit.product';
import { ServiceProduct } from '@/src/product-service/domain/service.product';

describe('ProductDomainService', () => {
  let svc: ProductDomainService;

  beforeEach(() => {
    svc = new ProductDomainService();
  });

  describe('validateVisitProductFields()', () => {
    it('우편번호와 도로명이 모두 주어지면 에러가 발생하지 않는다', () => {
      expect(() =>
        svc.validateVisitProductFields('12345', '도산대로'),
      ).not.toThrow();
    });

    it('postalCode가 없으면 BadRequestException을 던진다', () => {
      expect(() => svc.validateVisitProductFields('', '도산대로')).toThrowError(
        new BadRequestException('방문형 상품은 우편번호와 주소가 필요합니다'),
      );
    });

    it('roadName이 없으면 BadRequestException을 던진다', () => {
      expect(() => svc.validateVisitProductFields('12345', '')).toThrowError(
        new BadRequestException('방문형 상품은 우편번호와 주소가 필요합니다'),
      );
    });
  });

  describe('validateServiceProductFields()', () => {
    it('genderCode가 주어지면 에러가 발생하지 않는다', () => {
      expect(() => svc.validateServiceProductFields('M')).not.toThrow();
    });

    it('genderCode가 없으면 BadRequestException을 던진다', () => {
      expect(() => svc.validateServiceProductFields(undefined)).toThrowError(
        new BadRequestException('서비스형 상품은 성별 정보가 필요합니다'),
      );
    });
  });

  describe('createProduct()', () => {
    it('주어진 props로 Product 인스턴스를 생성한다', () => {
      // Given
      const type = Object.assign(new ProductType(), { code: 'VISIT' });
      const props: ProductProps = {
        brandName: '브랜드',
        productName: '상품명',
        briefDescription: '간단설명',
        guide: '사용안내',
        productType: type,
      };

      // When
      const product = svc.createProduct(props);

      // Then
      expect(product).toBeInstanceOf(Product);
      expect(product.brandName).toBe(props.brandName);
      expect(product.productName).toBe(props.productName);
      expect(product.briefDescription).toBe(props.briefDescription);
      expect(product.guide).toBe(props.guide);
      expect(product.productType).toBe(type);
    });
  });

  describe('createAddress()', () => {
    it('유효한 주소 정보로 Address 인스턴스를 생성한다', () => {
      // Given
      const postalCode = '46979';
      const roadName = '서울시 강남구 도산대로';

      // When
      const addr = svc.createAddress(postalCode, roadName);

      // Then
      expect(addr).toBeInstanceOf(Address);
      expect(addr.postalCode).toBe(postalCode);
      expect(addr.roadName).toBe(roadName);
    });

    it('주소 정보가 부족하면 BadRequestException을 던진다', () => {
      expect(() => svc.createAddress('', '도로명')).toThrowError(
        new BadRequestException('방문형 상품은 우편번호와 주소가 필요합니다'),
      );
    });
  });

  describe('createVisitProduct()', () => {
    it('productId와 addressId로 VisitProduct를 생성한다', () => {
      // Given
      const productId = 100;
      const addressId = 200;

      // When
      const vp = svc.createVisitProduct(productId, addressId);

      // Then
      expect(vp).toBeInstanceOf(VisitProduct);
      expect(vp.productId).toBe(productId);
      expect(vp.addressId).toBe(addressId);
    });
  });

  describe('createServiceProduct()', () => {
    it('productId, genderId, isSponsored로 ServiceProduct를 생성한다', () => {
      // Given
      const productId = 300;
      const genderId = 400;
      const isSponsored = true;

      // When
      const sp = svc.createServiceProduct(productId, genderId, isSponsored);

      // Then
      expect(sp).toBeInstanceOf(ServiceProduct);
      expect(sp.productId).toBe(productId);
      expect(sp.genderId).toBe(genderId);
      expect(sp.isSponsored).toBe(isSponsored);
    });
  });
});
