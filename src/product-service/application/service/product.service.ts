import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@/src/product-service/domain/repository/product.repository';
import { ProductTypeRepository } from '@/src/product-service/domain/repository/product-type.repository';
import { GenderRepository } from '@/src/product-service/domain/repository/gender.repository';
import { AddressRepository } from '@/src/product-service/domain/repository/address.repository';
import { CreateProductDto } from '@/src/product-service/ui/create-product.dto';
import { EntityManager } from 'typeorm';
import { Product } from '@/src/product-service/domain/product';
import { ProductDomainService } from '@/src/product-service/domain/service/product.domain.service';


@Injectable()
export class ProductService {
  constructor(
    private readonly productDomainService: ProductDomainService,
    private readonly productTypeRepository: ProductTypeRepository,
    private readonly genderRepository: GenderRepository,
    private readonly productRepository: ProductRepository,
    private readonly addressRepository: AddressRepository,

  ) {
  }

  async createProduct(dto: CreateProductDto, manager: EntityManager): Promise<Product> {
    // transaction script 로 하나의 atomic 으로 동작
    const productTypeReader = this.productTypeRepository.withTransaction(manager);
    const genderReader = this.genderRepository.withTransaction(manager);
    const productWriter = this.productRepository.withTransaction(manager);
    const addressWriter = this.addressRepository.withTransaction(manager);


    // product 타입 조회 Reader 에서 예외 처리 캠슐화 (도구레이어 활용)
    const productType = await productTypeReader.findByCodeOrThrow(
      dto.productTypeCode,
    );


    let product: Product; // 최종 생성될 Product 변수

    // 2. Product Type에 따른 분기 처리
    if (productType.isVisitType()) {

      this.productDomainService.validateVisitProductInput(dto.postalCode, dto.roadName);

      const newAddress = this.productDomainService.createAddress(dto.postalCode!, dto.roadName!);
      const savedAddress = await addressWriter.save(newAddress);

      product = this.productDomainService.createVisitProduct(dto, productType, savedAddress);

    } else if (productType.isServiceType()) {

      this.productDomainService.validateServiceProductInput(dto.genderCode);

      const gender = await genderReader.findByCodeOrThrow(dto.genderCode!);

      product = this.productDomainService.createServiceProduct(dto, productType, gender, dto.isSponsored);

    } else {
      // 혹시 모를 예외 처리
      throw new Error(`지원하지 않는 상품 타입입니다: ${dto.productTypeCode}`);
    }


    // 3. 통합된 Product 엔티티 저장
    const savedProduct = await productWriter.save(product);


    return savedProduct;
  }

}
