import { ServiceProduct } from '@/src/product-service/domain/service.product';

export interface ServiceProductWriter {
  save(serviceProduct: ServiceProduct): Promise<ServiceProduct>;
}
