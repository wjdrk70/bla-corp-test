import { ProductType, ProductTypeCode } from '@/src/product-service/domain/product.type';

describe('ProductType 도메인 엔티티', () => {
  it('isVisitType은 코드가 VISIT일 때 true를 반환해야 한다', () => {
    // given
    const productType = new ProductType();
    productType.code = ProductTypeCode.VISIT; // 'VISIT'

    // when
    const result = productType.isVisitType();

    // then
    expect(result).toBe(true);
  });

  it('isServiceType은 코드가 SERVICE일 때 true를 반환해야 한다', () => {
    // given
    const productType = new ProductType();
    productType.code = ProductTypeCode.SERVICE; // 'SERVICE'

    // when
    const result = productType.isServiceType();

    // then
    expect(result).toBe(true);
  });

  it('isVisitType은 코드가 SERVICE일 때 false를 반환해야 한다', () => {
    // given
    const productType = new ProductType();
    productType.code = ProductTypeCode.SERVICE;

    // when
    const result = productType.isVisitType();

    // then
    expect(result).toBe(false);
  });

  it('isServiceType은 코드가 VISIT일 때 false를 반환해야 한다', () => {
    // given
    const productType = new ProductType();
    productType.code = ProductTypeCode.VISIT;

    // when
    const result = productType.isServiceType();

    // then
    expect(result).toBe(false);
  });
});