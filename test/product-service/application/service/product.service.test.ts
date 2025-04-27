import { ProductService } from '@/src/product-service/application/service/product.service';
import { ProductDomainService } from '@/src/product-service/domain/service/product.domain.service';
import { EntityManager } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductTypeRepository } from '@/src/product-service/domain/repository/product-type.repository';
import { GenderRepository } from '@/src/product-service/domain/repository/gender.repository';
import { ProductRepository } from '@/src/product-service/domain/repository/product.repository';
import { AddressRepository } from '@/src/product-service/domain/repository/address.repository';
import { Product } from '@/src/product-service/domain/product';
import { ProductType } from '@/src/product-service/domain/product.type';
import { Gender } from '@/src/product-service/domain/gender';
import { Address } from '@/src/product-service/domain/address';
import { CreateProductDto } from '@/src/product-service/ui/create-product.dto';

describe('ProductService (Application Service)', () => {
  let service: ProductService;
  let mockDomainService: Partial<ProductDomainService>;
  let mockProductTypeRepository: Partial<ProductTypeRepository>;
  let mockGenderRepository: Partial<GenderRepository>;
  let mockProductRepository: Partial<ProductRepository>;
  let mockAddressRepository: Partial<AddressRepository>;

  const EM = {} as EntityManager;

  beforeEach(async () => {
    mockDomainService = {
      validateVisitProductInput: jest.fn(),
      validateServiceProductInput: jest.fn(),
      createAddress: jest.fn(),
      createVisitProduct: jest.fn(),
      createServiceProduct: jest.fn(),
    };
    mockProductTypeRepository = { withTransaction: jest.fn() };
    mockGenderRepository = { withTransaction: jest.fn() };
    mockProductRepository = { withTransaction: jest.fn() };
    mockAddressRepository = { withTransaction: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductDomainService, useValue: mockDomainService },
        { provide: ProductTypeRepository, useValue: mockProductTypeRepository },
        { provide: GenderRepository, useValue: mockGenderRepository },
        { provide: ProductRepository, useValue: mockProductRepository },
        { provide: AddressRepository, useValue: mockAddressRepository },
      ],
    }).compile();

    service = module.get(ProductService);
  });

  describe('방문형 상품 생성', () => {
    it('createProduct 호출하면 ProductType조회→주소검증/생성/저장→Product생성→Product저장 순으로 진행된다', async () => {
      // Given
      const dto: CreateProductDto = {
        productTypeCode: 'VISIT',
        brandName: '쿠팡',
        productName: '부대찌개',
        briefDescription: '맛있음',
        guide: '가열 후 드세요',
        postalCode: '12345',
        roadName: '서울로',
      };
      const fakeType: ProductType = {
        id: 1,
        code: 'VISIT',
        label: '방문형',
        isVisitType: () => true,
        isServiceType: () => false,
      } as ProductType;
      const fakeAddress: Address = {
        id: 10,
        postalCode: '12345',
        roadName: '서울로',
      } as Address;
      const fakeProductToCreate: Product = {
        /* ... */
      } as Product; // 상세 속성 생략 가능
      const fakeSavedProduct: Product = {
        ...fakeProductToCreate,
        id: 1,
        createdAt: new Date(),
      } as Product;

      const typeReader = {
        findByCodeOrThrow: jest.fn().mockResolvedValue(fakeType),
      };
      const prodWriter = {
        save: jest.fn().mockResolvedValue(fakeSavedProduct),
      };
      const addrWriter = { save: jest.fn().mockResolvedValue(fakeAddress) };

      // Repository Mock 설정
      (mockProductTypeRepository.withTransaction as jest.Mock).mockReturnValue(
        typeReader,
      );
      (mockProductRepository.withTransaction as jest.Mock).mockReturnValue(
        prodWriter,
      );
      (mockAddressRepository.withTransaction as jest.Mock).mockReturnValue(
        addrWriter,
      );

      // DomainService Mock 설정
      (mockDomainService.createAddress! as jest.Mock).mockReturnValue(
        fakeAddress,
      );
      (mockDomainService.createVisitProduct! as jest.Mock).mockReturnValue(
        fakeProductToCreate,
      );

      // When
      const result = await service.createProduct(dto, EM);

      // Then

      expect(mockProductTypeRepository.withTransaction).toHaveBeenCalledWith(EM,);
      expect(typeReader.findByCodeOrThrow).toHaveBeenCalledWith('VISIT');

      expect(addrWriter.save).toHaveBeenCalledWith(fakeAddress);

      expect(mockDomainService.createVisitProduct).toHaveBeenCalledWith(
        expect.objectContaining({ brandName: dto.brandName /* ... */ }),
        fakeType,
        fakeAddress,
      );


      expect(prodWriter.save).toHaveBeenCalledWith(fakeProductToCreate);


      expect(result).toBe(fakeSavedProduct);
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
      const fakeType: ProductType = {
        id: 2,
        code: 'SERVICE',
        label: '서비스형',
        isVisitType: () => false,
        isServiceType: () => true,
      } as ProductType;
      const fakeGender: Gender = { id: 99, code: 'M', label: '남성' } as Gender;
      const fakeProductToCreate: Product = {
        /* 기본 Product 속성 */ id: undefined,
        productTypeId: fakeType.id,
        productType: fakeType,
        /* 방문형 속성 */ addressId: null,
        address: null,
        /* 서비스형 속성 */ genderId: fakeGender.id,
        gender: fakeGender,
        isSponsored: true,
      } as Product;
      const fakeSavedProduct: Product = {
        ...fakeProductToCreate,
        id: 2,
        createdAt: new Date(),
      } as Product;

      const typeReader = {
        findByCodeOrThrow: jest.fn().mockResolvedValue(fakeType),
      };
      const prodWriter = {
        save: jest.fn().mockResolvedValue(fakeSavedProduct),
      };
      const genderReader = {
        findByCodeOrThrow: jest.fn().mockResolvedValue(fakeGender),
      };

      (mockProductTypeRepository.withTransaction as jest.Mock).mockReturnValue(
        typeReader,
      );
      (mockProductRepository.withTransaction as jest.Mock).mockReturnValue(
        prodWriter,
      );
      (mockGenderRepository.withTransaction as jest.Mock).mockReturnValue(
        genderReader,
      );

      (mockDomainService.createServiceProduct! as jest.Mock).mockReturnValue(
        fakeProductToCreate,
      );

      // When
      const result = await service.createProduct(dto, EM);

      // Then
      expect(typeReader.findByCodeOrThrow).toHaveBeenCalledWith('SERVICE');
      expect(
        mockDomainService.validateServiceProductInput,
      ).toHaveBeenCalledWith(dto.genderCode); // 검증 메소드 호출 확인
      expect(mockGenderRepository.withTransaction).toHaveBeenCalledWith(EM);
      expect(genderReader.findByCodeOrThrow).toHaveBeenCalledWith(
        dto.genderCode!,
      );
      // 3) Product 생성 확인 (변경된 메소드 이름 사용)
      expect(mockDomainService.createServiceProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          // DTO 기본 정보 확인
          brandName: dto.brandName,
          productName: dto.productName,
          briefDescription: dto.briefDescription,
          guide: dto.guide,
        }),
        fakeType, // ProductType 객체
        fakeGender, // 조회된 Gender 객체
        dto.isSponsored, // isSponsored 값
      );

      // 4) 최종 Product 저장 확인
      expect(mockProductRepository.withTransaction).toHaveBeenCalledWith(EM);
      expect(prodWriter.save).toHaveBeenCalledWith(fakeProductToCreate); // 생성된 Product 저장 확인

      // !!! ServiceProduct 생성/저장 검증 제거 !!!

      // 5) 최종 반환값 확인
      expect(result).toBe(fakeSavedProduct);
    });
  });

  describe('지원하지 않는 타입 예외', () => {
    it('알 수 없는 타입, 호출하면 예외가 발생한다', async () => {
      // Given
      const dto:CreateProductDto = {
        productTypeCode: 'Delivery',
        brandName: '네이버',
        productName: '배송',
        briefDescription: '배송이 빨라요!',
        guide: '이용안내',
        isSponsored: false,
      } as CreateProductDto;

      const fakeType: ProductType = {
        id: 99, code: 'Delivery', label: '알수없음',
        isVisitType: () => false, isServiceType: () => false
      } as ProductType;

      const typeReader = { findByCodeOrThrow: jest.fn().mockResolvedValue(fakeType) };
      (mockProductTypeRepository.withTransaction as jest.Mock).mockReturnValue(typeReader);


      await expect(service.createProduct(dto, EM))
        .rejects .toThrow(`지원하지 않는 상품 타입입니다: ${fakeType.code}`);

    });
  });
});
