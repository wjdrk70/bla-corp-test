import { ProductType, ProductTypeCode } from '@/src/product-service/domain/product.type';
import { Product } from '@/src/product-service/domain/product';
import { Gender } from '@/src/product-service/domain/gender';
import { Address } from '@/src/product-service/domain/address';
import { ProductProps } from '@/src/product-service/domain/interface/product.props';

describe('Product 도메인 엔티티', () => {
  const visitType = {
    id: 401,
    code: ProductTypeCode.VISIT,
    label:'방문형',
    isVisitType: jest.fn().mockReturnValue(true),
    isServiceType: jest.fn().mockReturnValue(false),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as ProductType;

  const serviceType = {
    id: 402,
    code: ProductTypeCode.SERVICE,
    label:'서비스형',
    isVisitType: jest.fn().mockReturnValue(false),
    isServiceType: jest.fn().mockReturnValue(true),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as ProductType;

  // Gender, Address Mock (ID만 필요할 수 있음)
  const mockGender = { id: 1, code: 'M' } as Gender;
  const mockAddress = { id: 101, postalCode: '12345', roadName: '테스트로' } as Address;

  describe('create', () => {
    it('방문형(VISIT) 상품 속성으로 Product 인스턴스를 올바르게 생성해야 한다', () => {
      // given
      const props: ProductProps = {
        brandName: '방문 브랜드',
        productName: '방문 상품',
        briefDescription: '방문해보세요',
        guide: '이 주소로 오세요',
        productType: visitType,       // ProductType 객체 전달
        productTypeId: visitType.id, // productTypeId도 명시적으로 전달 (create 내부 로직 확인 필요)
        addressId: mockAddress.id,     // 방문형이므로 addressId 필요
        genderId: null,               // 방문형은 genderId 불필요
        isSponsored: false,           // isSponsored는 false 또는 null 가능
      };

      // when
      const product = Product.create(props);

      // then
      expect(product).toBeInstanceOf(Product);
      expect(product.brandName).toBe(props.brandName);
      expect(product.productName).toBe(props.productName);
      expect(product.briefDescription).toBe(props.briefDescription);
      expect(product.guide).toBe(props.guide);
      expect(product.productTypeId).toBe(visitType.id); // ID가 올바르게 설정되었는지 확인
      expect(product.addressId).toBe(mockAddress.id);
      expect(product.genderId).toBeNull();
      expect(product.isSponsored).toBe(false); // nullish coalescing 확인
    });

    it('서비스형(SERVICE) 상품 속성으로 Product 인스턴스를 올바르게 생성해야 한다', () => {
      // given
      const props: ProductProps = {
        brandName: '서비스 브랜드',
        productName: '서비스 상품',
        briefDescription: '서비스 받으세요',
        guide: '이렇게 이용하세요',
        productType: serviceType,      // ProductType 객체 전달
        productTypeId: serviceType.id,
        addressId: null,              // 서비스형은 addressId 불필요
        genderId: mockGender.id,      // 서비스형이므로 genderId 필요
        isSponsored: true,            // isSponsored 설정
      };

      // when
      const product = Product.create(props);

      // then
      expect(product).toBeInstanceOf(Product);
      expect(product.brandName).toBe(props.brandName);
      expect(product.productName).toBe(props.productName);
      expect(product.briefDescription).toBe(props.briefDescription);
      expect(product.guide).toBe(props.guide);
      expect(product.productTypeId).toBe(serviceType.id);
      expect(product.addressId).toBeNull();
      expect(product.genderId).toBe(mockGender.id);
      expect(product.isSponsored).toBe(true);
    });

    it('isSponsored가 null 또는 undefined로 제공되면 false로 설정되어야 한다', () => {
      // given
      const props: ProductProps = {
        brandName: '서비스 브랜드',
        productName: '서비스 상품',
        briefDescription: '서비스 받으세요',
        guide: '이렇게 이용하세요',
        productType: serviceType,
        productTypeId: serviceType.id,
        addressId: null,
        genderId: mockGender.id,
        isSponsored: undefined, // undefined 또는 null
      };
      // when
      const product = Product.create(props);
      // then
      expect(product.isSponsored).toBe(false);
    });
  });

  describe('isVisitType / isServiceType', () => {
    it('방문형 ProductType을 가진 Product는 isVisitType이 true, isServiceType이 false여야 한다', () => {
      // given
      // Product.create를 사용하여 Product 인스턴스 생성
      const product = Product.create({
        brandName: '방문 브랜드',
        productName: '방문 상품',
        briefDescription: '방문',
        guide: '방문 가이드',
        productType: visitType, // Mocked visitType 사용
        productTypeId: visitType.id,
        addressId: mockAddress.id,
      });

      // when
      const isVisit = product.isVisitType();
      const isService = product.isServiceType();

      // then
      // productType의 Mocking된 메서드가 호출되는지 확인 (Optional)
      expect(visitType.isVisitType).toHaveBeenCalled();
      expect(visitType.isServiceType).toHaveBeenCalled();
      // 실제 반환값 확인
      expect(isVisit).toBe(true);
      expect(isService).toBe(false);
    });

    it('서비스형 ProductType을 가진 Product는 isVisitType이 false, isServiceType이 true여야 한다', () => {
      // given
      const product = Product.create({
        brandName: '서비스 브랜드',
        productName: '서비스 상품',
        briefDescription: '서비스',
        guide: '서비스 가이드',
        productType: serviceType, // Mocked serviceType 사용
        productTypeId: serviceType.id,
        genderId: mockGender.id,
      });

      // when
      const isVisit = product.isVisitType();
      const isService = product.isServiceType();

      // then
      expect(serviceType.isVisitType).toHaveBeenCalled();
      expect(serviceType.isServiceType).toHaveBeenCalled();
      expect(isVisit).toBe(false);
      expect(isService).toBe(true);
    });
  });
});