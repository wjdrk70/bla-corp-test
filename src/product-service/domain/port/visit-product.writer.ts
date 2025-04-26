import { VisitProduct } from '@/src/product-service/domain/visit.product';

export interface VisitProductWriter {
  save(visitProduct: VisitProduct): Promise<VisitProduct>;
}
