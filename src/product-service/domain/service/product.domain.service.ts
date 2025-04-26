import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductDomainService {
  validateVisitProductFields(postalCode?: string, roadName?: string): void {
    if (!postalCode || !roadName) {
      throw new Error('방문형 상품은 우편번호와 주소가 필요합니다');
    }
  }

  validateServiceProductFields(genderCode?: string): void {
    if (!genderCode) {
      throw new Error('서비스형 상품은 성별 정보가 필요합니다');
    }
  }
}
