import { ProductDomainService } from '@/src/product-service/domain/service/product.domain.service';
import { BadRequestException } from '@nestjs/common';
import {
  ProductType,
  ProductTypeCode,
} from '@/src/product-service/domain/product.type';
import { Product } from '@/src/product-service/domain/product';
import { Address } from '@/src/product-service/domain/address';
import { Gender } from '@/src/product-service/domain/gender';

describe('ProductDomainService', () => {
  let productDomainService: ProductDomainService;
  const visitType: ProductType = {
    id: 401,
    code: ProductTypeCode.VISIT,
    label: '방문형',

    isVisitType: jest.fn().mockReturnValue(true),
    isServiceType: jest.fn().mockReturnValue(false),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const serviceType: ProductType = {
    id: 402,
    code: ProductTypeCode.SERVICE,
    label: '서비스형',
    isVisitType: jest.fn().mockReturnValue(false),
    isServiceType: jest.fn().mockReturnValue(true),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockGender: Gender = {
    id: 1,
    code: 'M',
    label: '남성',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAddress: Address = {
    id: 101,
    postalCode: '12345',
    roadName: '테스트로 123길',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const baseDto = {
    brandName: '테스트 브랜드',
    productName: '테스트 상품명',
    briefDescription: '테스트 한줄소개',
    guide: '테스트 가이드라인',
  };

  beforeEach(() => {
    productDomainService = new ProductDomainService();
    jest.clearAllMocks();
  });

  describe('validateVisitProductInput()', () => {
    // 메서드 이름 일치
    it('우편번호와 도로명이 모두 유효하면 에러가 발생하지 않는다', () => {
      // given
      const postalCode = '12345';
      const roadName = '유효한 도로명';
      // when & then
      expect(() =>
        productDomainService.validateVisitProductInput(postalCode, roadName),
      ).not.toThrow();
    });

    it('postalCode가 없거나(null, undefined, 빈 문자열) 하면 BadRequestException을 던진다', () => {
      // given
      const roadName = '유효한 도로명';
      // 에러 메시지 일치 확인
      const expectedError = new BadRequestException(
        '방문형 상품은 우편번호와 주소가 필요합니다.',
      );
      // when & then
      expect(() =>
        productDomainService.validateVisitProductInput(undefined, roadName),
      ).toThrowError(expectedError);
      expect(() =>
        productDomainService.validateVisitProductInput(null, roadName),
      ).toThrowError(expectedError);
      expect(() =>
        productDomainService.validateVisitProductInput('', roadName),
      ).toThrowError(expectedError);
    });

    it('roadName이 없거나(null, undefined, 빈 문자열) 하면 BadRequestException을 던진다', () => {
      // given
      const postalCode = '12345';
      const expectedError = new BadRequestException(
        '방문형 상품은 우편번호와 주소가 필요합니다.',
      );
      // when & then
      expect(() =>
        productDomainService.validateVisitProductInput(postalCode, undefined),
      ).toThrowError(expectedError);
      expect(() =>
        productDomainService.validateVisitProductInput(postalCode, null),
      ).toThrowError(expectedError);
      expect(() =>
        productDomainService.validateVisitProductInput(postalCode, ''),
      ).toThrowError(expectedError);
    });
  });

  describe('validateServiceProductInput()', () => {
    // 메서드 이름 일치
    it('genderCode가 유효하면 에러가 발생하지 않는다', () => {
      // given
      const genderCode = 'M';
      // when & then
      expect(() =>
        productDomainService.validateServiceProductInput(genderCode),
      ).not.toThrow();
    });

    it('genderCode가 없거나(null, undefined) 하면 BadRequestException을 던진다', () => {
      // given

      const expectedError = new BadRequestException(
        '서비스형 상품은 성별 정보가 필요합니다.',
      );
      // when & then
      expect(() =>
        productDomainService.validateServiceProductInput(undefined),
      ).toThrowError(expectedError);
      expect(() =>
        productDomainService.validateServiceProductInput(null),
      ).toThrowError(expectedError);
    });
  });

  // --- 엔티티 생성 메서드 테스트 ---
  describe('createAddress()', () => {
    it('유효한 주소 정보로 Address 인스턴스를 생성하고 반환한다', () => {
      // given
      const postalCode = '46979';
      const roadName = '서울시 강남구 도산대로';
      const addressCreateSpy = jest.spyOn(Address, 'create');

      // when
      const addr = productDomainService.createAddress(postalCode, roadName); //

      // then
      expect(addr).toBeInstanceOf(Address);
      expect(addr.postalCode).toBe(postalCode);
      expect(addr.roadName).toBe(roadName);
      expect(addressCreateSpy).toHaveBeenCalledWith(postalCode, roadName);

      addressCreateSpy.mockRestore();
    });
  });

  describe('createVisitProduct()', () => {
    it('방문형 상품 정보와 주소 엔티티로 Product 인스턴스를 생성하여 반환해야 한다', () => {
      // given - 필요한 Mock 객체 준비
      const productCreateSpy = jest.spyOn(Product, 'create');

      // when
      const product = productDomainService.createVisitProduct(
        baseDto,
        visitType,
        mockAddress,
      ); //

      // then
      expect(product).toBeInstanceOf(Product);
      // Product.create가 올바른 인자(ProductProps)로 호출되었는지 확인
      expect(productCreateSpy).toHaveBeenCalledWith({
        brandName: baseDto.brandName,
        productName: baseDto.productName,
        briefDescription: baseDto.briefDescription,
        guide: baseDto.guide,
        productTypeId: visitType.id,
        productType: visitType,
        addressId: mockAddress.id,
        genderId: null,
        isSponsored: null,
      });

      productCreateSpy.mockRestore();
    });
  });

  describe('createServiceProduct()', () => {
    it('서비스형 상품 정보, 성별 엔티티, 협찬 여부(true)로 Product 인스턴스를 생성하여 반환해야 한다', () => {
      // given
      const isSponsored = true;
      const productCreateSpy = jest.spyOn(Product, 'create');

      // when
      const product = productDomainService.createServiceProduct(
        baseDto,
        serviceType,
        mockGender,
        isSponsored,
      ); //

      // then
      expect(product).toBeInstanceOf(Product);

      expect(productCreateSpy).toHaveBeenCalledWith({
        brandName: baseDto.brandName,
        productName: baseDto.productName,
        briefDescription: baseDto.briefDescription,
        guide: baseDto.guide,
        productTypeId: serviceType.id,
        productType: serviceType,
        addressId: null,
        genderId: mockGender.id,
        isSponsored: isSponsored,
      });

      productCreateSpy.mockRestore();
    });

    it('isSponsored가 제공되지 않으면(undefined) false로 처리하여 Product 인스턴스를 생성해야 한다', () => {
      // given
      const isSponsored = undefined;
      const productCreateSpy = jest.spyOn(Product, 'create');

      // when
      const product = productDomainService.createServiceProduct(
        baseDto,
        serviceType,
        mockGender,
        isSponsored,
      );

      // then
      expect(product).toBeInstanceOf(Product);
      expect(productCreateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          isSponsored: false,
        }),
      );

      productCreateSpy.mockRestore();
    });
  });
});
