import { Address } from '@/src/product-service/domain/address';

describe('Adress Entity', () => {
  it('정상적으로 주소가 생성된다', () => {
    const address = Address.create('46979', '서울시 강남구 도산대로');

    expect(address).toBeDefined();

    expect(address.postalCode).toBe('46979');
    expect(address.roadName).toBe('서울시 강남구 도산대로');
  });
});
