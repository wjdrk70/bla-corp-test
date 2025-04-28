import { Address } from '@/src/product-service/domain/address';

describe('Adress Entity', () => {
  describe('create', () => {
    it('우편번호와 도로명 주소로 Address 인스턴스를 생성해야 한다', () => {
      // given
      const postalCode = '46896';
      const roadName = '서울시 강남구대로';

      // when
      const address = Address.create(postalCode, roadName);

      // then
      expect(address).toBeInstanceOf(Address);
      expect(address.postalCode).toBe(postalCode);
      expect(address.roadName).toBe(roadName);
    });
  });
});
