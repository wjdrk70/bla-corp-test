import { Address } from '@/src/product-service/domain/address';

export interface AddressWriter {
  save(address: Address): Promise<Address>;
}
