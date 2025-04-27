import { ProductService } from '@/src/product-service/application/service/product.service';
import { ProductDomainService } from '@/src/product-service/domain/service/product.domain.service';
import { EntityManager } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductTypeRepository } from '@/src/product-service/domain/repository/product-type.repository';
import { GenderRepository } from '@/src/product-service/domain/repository/gender.repository';
import { ProductRepository } from '@/src/product-service/domain/repository/product.repository';
import { AddressRepository } from '@/src/product-service/domain/repository/address.repository';
import { VisitProductRepository } from '@/src/product-service/domain/repository/visit-product.repository';
import { ServiceProductRepository } from '@/src/product-service/domain/repository/service-product.repository';

describe('ProductService (Application Service)', () => {
  let service: ProductService;
  let mockDomainService: Partial<ProductDomainService>;
  let mockProductTypeRepository: Partial<ProductTypeRepository>;
  let mockGenderRepository: Partial<GenderRepository>;
  let mockProductRepository: Partial<ProductRepository>;
  let mockAddressRepository: Partial<AddressRepository>;
  let mockVisitRepository: Partial<VisitProductRepository>;
  let mockServiceRepository: Partial<ServiceProductRepository>;
  const EM = {} as EntityManager;

  beforeEach(async () => {
    mockDomainService = {
      createProduct: jest.fn(),
      validateVisitProductFields: jest.fn(),
      createAddress: jest.fn(),
      createVisitProduct: jest.fn(),
      validateServiceProductFields: jest.fn(),
      createServiceProduct: jest.fn(),
    };
    mockProductTypeRepository = { withTransaction: jest.fn() };
    mockGenderRepository = { withTransaction: jest.fn() };
    mockProductRepository = { withTransaction: jest.fn() };
    mockAddressRepository = { withTransaction: jest.fn() };
    mockVisitRepository = { withTransaction: jest.fn() };
    mockServiceRepository = { withTransaction: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductDomainService, useValue: mockDomainService },
        { provide: ProductTypeRepository, useValue: mockProductTypeRepository },
        { provide: GenderRepository, useValue: mockGenderRepository },
        { provide: ProductRepository, useValue: mockProductRepository },
        { provide: AddressRepository, useValue: mockAddressRepository },
        { provide: VisitProductRepository, useValue: mockVisitRepository },
        { provide: ServiceProductRepository, useValue: mockServiceRepository },
      ],
    }).compile();

    service = module.get(ProductService);
  });

  describe('방문형 상품 생성', () => {
    it('createProduct 호출하면 Product→Address→VisitProduct가 순차 저장된다', async () => {
      // Given
      const dto = {
        productTypeCode: 'VISIT',
        brandName: '쿠팡',
        productName: '부대찌개',
        briefDescription: '맛있음',
        guide: '가열 후 드세요',
        postalCode: '12345',
        roadName: '서울로',
      };
      const fakeType = { code: 'VISIT', isVisitType: () => true };
      const fakeProductType = {
        id: 1,
        productType: fakeType,
        isVisitType: () => true,
        isServiceType: () => false, } ;
      const fakeAddress = { id: 10 } ;
      const fakeVisit = { id: 20 } ;

      const typeReader = {
        findByCodeOrThrow: jest.fn().mockResolvedValue(fakeType),
      };
      const prodWriter = { save: jest.fn().mockResolvedValue(fakeProductType) };
      const addrWriter = { save: jest.fn().mockResolvedValue(fakeAddress) };
      const visitWriter = { save: jest.fn().mockResolvedValue(fakeVisit) };



      (mockProductTypeRepository.withTransaction as jest.Mock).mockReturnValue(typeReader);
      (mockProductRepository.withTransaction as jest.Mock).mockReturnValue(prodWriter);
      (mockAddressRepository.withTransaction as jest.Mock).mockReturnValue(addrWriter);
      (mockVisitRepository.withTransaction as jest.Mock).mockReturnValue(visitWriter);

      (mockDomainService.createProduct! as jest.Mock).mockReturnValue(fakeProductType);
      (mockDomainService.createAddress! as jest.Mock).mockReturnValue(fakeAddress);
      (mockDomainService.createVisitProduct! as jest.Mock).mockReturnValue(fakeVisit);

      // When
      const result = await service.createProduct(dto, EM);

      // Then
      // 1) 타입 조회
      expect(mockProductTypeRepository.withTransaction).toHaveBeenCalledWith(EM);
      expect(typeReader.findByCodeOrThrow).toHaveBeenCalledWith('VISIT');

      // 2) Product 생성 및 저장
      expect(mockDomainService.createProduct).toHaveBeenCalledWith({
        brandName: '쿠팡',
        productName: '부대찌개',
        briefDescription: '맛있음',
        guide: '가열 후 드세요',
        productType: fakeType,
      });
      expect(prodWriter.save).toHaveBeenCalledWith(fakeProductType);

      // 3) 주소 검증·생성·저장
      expect(mockDomainService.validateVisitProductFields).toHaveBeenCalledWith(
        '12345',
        '서울로',
      );
      expect(mockDomainService.createAddress).toHaveBeenCalledWith('12345', '서울로');
      expect(addrWriter.save).toHaveBeenCalledWith(fakeAddress);

      // 4) VisitProduct 생성·저장
      expect(mockDomainService.createVisitProduct).toHaveBeenCalledWith(1, 10);
      expect(visitWriter.save).toHaveBeenCalledWith(fakeVisit);

      // 최종 반환값
      expect(result).toBe(fakeProductType);
    });
  });

  describe('서비스형 상품 생성', () => {
    it('createProduct 호출, Gender 조회→ServiceProduct 저장 순으로 진행된다', async () => {
      // Given
      const dto = {
        productTypeCode: 'SERVICE',
        brandName: '네이버',
        productName: 'AI서비스',
        briefDescription: 'AI 는 엄청납니다!',
        guide: '이용안내',
        genderCode: 'M',
        isSponsored: true,
      };
      const fakeType = { code: 'SERVICE', isServiceType: () => true } ;
      const fakeProd = { id: 2, productType: fakeType, isVisitType: () => false,
        isServiceType: () => true };

      const fakeGender = { id: 99 };
      const fakeService = { id: 200 };

      const typeReader = {
        findByCodeOrThrow: jest.fn().mockResolvedValue(fakeType),
      };
      const prodWriter = { save: jest.fn().mockResolvedValue(fakeProd) };
      const genderReader = {
        findByCodeOrThrow: jest.fn().mockResolvedValue(fakeGender),
      };
      const servWriter = { save: jest.fn().mockResolvedValue(fakeService) };

      (mockProductTypeRepository.withTransaction as jest.Mock).mockReturnValue(typeReader);
      (mockProductRepository.withTransaction as jest.Mock).mockReturnValue(prodWriter);
      (mockGenderRepository.withTransaction as jest.Mock).mockReturnValue(genderReader);
      (mockServiceRepository.withTransaction as jest.Mock).mockReturnValue(servWriter);

      (mockDomainService.createProduct! as jest.Mock).mockReturnValue(fakeProd);
      (mockDomainService.createServiceProduct! as jest.Mock).mockReturnValue(fakeService);

      // When
      const result = await service.createProduct(dto, EM);

      // Then
      expect(typeReader.findByCodeOrThrow).toHaveBeenCalledWith('SERVICE');
      expect(prodWriter.save).toHaveBeenCalledWith(fakeProd);

      expect(mockDomainService.validateServiceProductFields).toHaveBeenCalledWith('M');
      expect(genderReader.findByCodeOrThrow).toHaveBeenCalledWith('M');

      expect(mockDomainService.createServiceProduct).toHaveBeenCalledWith(2, 99, true);
      expect(servWriter.save).toHaveBeenCalledWith(fakeService);

      expect(result).toBe(fakeProd);
    });
  });

  describe('지원하지 않는 타입 예외', () => {
    it('알 수 없는 타입, 호출하면 예외가 발생한다', async () => {
      // Given
      const dto = { productTypeCode: 'Delivery',
        brandName: '네이버',
        productName: '배송',
        briefDescription: '배송이 빨라요!',
        guide: '이용안내',
        isSponsored: false,};
      const fakeType = {
        code: 'X',
        isVisitType: () => false,
        isServiceType: () => false,
      };
      const typeReader = {
        findByCodeOrThrow: jest.fn().mockResolvedValue(fakeType),
      };
      (mockProductTypeRepository.withTransaction as jest.Mock).mockReturnValue(typeReader);

      const fakeProduct = {
        productType: fakeType,
        isVisitType: () => false,
        isServiceType: () => false,
      };
      (mockDomainService.createProduct as jest.Mock)
        .mockReturnValue(fakeProduct);

      const fakeWriter = { save: jest.fn().mockResolvedValue(fakeProduct) };
      (mockProductRepository.withTransaction as jest.Mock)
        .mockReturnValue(fakeWriter);

      // When / Then
      await expect(service.createProduct(dto, EM)).rejects.toThrowError(
        '지원하지 않는 상품 타입입니다: X',
      );
    });
  });
});
