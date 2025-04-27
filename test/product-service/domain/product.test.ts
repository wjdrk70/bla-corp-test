import { ProductType } from '@/src/product-service/domain/product.type';
import { Product } from '@/src/product-service/domain/product';

describe('Product Entity', () => {
  let visitType: ProductType;
  let serviceType: ProductType;

  beforeAll(() => {
    visitType = Object.assign(new ProductType(), { code: 'VISIT' });
    serviceType = Object.assign(new ProductType(), { code: 'SERVICE' });
  });

  it('정상적으로 VISIT 타입 Product 생성', () => {
    const product = Product.create({
      brandName: '쿠팡',
      productName: '곰곰 부대찌개',
      briefDescription: '끼리 무그면 맛있어요',
      guide: '해동후 끼리묵으세요',
      productType: visitType,
    });


    expect(product).toBeDefined();


    expect(product.brandName).toBe('쿠팡');
    expect(product.productName).toBe('곰곰 부대찌개');
    expect(product.productType).toBe(visitType);


    expect(product.isVisitType()).toBe(true);
    expect(product.isServiceType()).toBe(false);
  });

  it('정상적으로 SERVICE 타입 Product 생성', () => {
    const product = Product.create({
      brandName: '네이버',
      productName: 'AI 서비스',
      briefDescription: 'AI 기반 서비스',
      guide: '가입 후 이용하세요',
      productType: serviceType,
    });

    expect(product.isServiceType()).toBe(true);
    expect(product.isVisitType()).toBe(false);
  });

});
