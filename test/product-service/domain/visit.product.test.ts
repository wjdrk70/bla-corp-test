import { VisitProduct } from '@/src/product-service/domain/visit.product';

describe('Visit Product Entity', () => {
  it('정상적으로 VisitProduct 생성 ', () => {
    const visitProduct = VisitProduct.create(1, 1);

    expect(visitProduct).toBeDefined();
    expect(visitProduct).toBeInstanceOf(VisitProduct);
  });
});
