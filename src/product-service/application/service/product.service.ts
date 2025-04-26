import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '@/src/product-service/domain/repository/product.repository';
import { ProductTypeRepository } from '@/src/product-service/domain/repository/product-type.repository';
import { GenderRepository } from '@/src/product-service/domain/repository/gender.repository';
import { AddressRepository } from '@/src/product-service/domain/repository/address.repository';
import { VisitProductRepository } from '@/src/product-service/domain/repository/visit-product.repository';
import { ServiceProductRepository } from '@/src/product-service/domain/repository/service-product.repository';
import { CreateProductDto } from '@/src/product-service/ui/create-product.dto';
import { EntityManager } from 'typeorm';
import { Product } from '@/src/product-service/domain/product';
import { ProductProps } from '@/src/product-service/domain/interface/product.props';
import { Address } from '@/src/product-service/domain/address';
import { VisitProduct } from '@/src/product-service/domain/visit.product';
import { ServiceProduct } from '@/src/product-service/domain/service.product';
import { ProductDomainService } from '@/src/product-service/domain/service/product.domain.service';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private productTypeRepository: ProductTypeRepository,
    private genderRepository: GenderRepository,
    private addressRepository: AddressRepository,
    private visitProductRepository: VisitProductRepository,
    private serviceProductRepository: ServiceProductRepository,
    private productDomainService: ProductDomainService,
  ) {}

  async createProduct(
    dto: CreateProductDto,
    manager: EntityManager,
  ): Promise<Product> {
    const productTypeRepositoryTx = manager.withRepository(
      this.productTypeRepository,
    );
    const productRepositoryTx = manager.withRepository(this.productRepository);
    const genderRepositoryTx = manager.withRepository(this.genderRepository);
    const addressRepositoryTx = manager.withRepository(this.addressRepository);
    const visitProductRepositoryTx = manager.withRepository(
      this.visitProductRepository,
    );
    const serviceProductRepositoryTx = manager.withRepository(
      this.serviceProductRepository,
    );

    const productType = await productTypeRepositoryTx.findProductTypeByCode(
      dto.productTypeCode,
    );
    if (!productType) {
      throw new NotFoundException(
        `상품 타입 코드 ${dto.productTypeCode}를 찾을 수 없습니다.`,
      );
    }

    const productProps: ProductProps = {
      brandName: dto.brandName,
      productName: dto.productName,
      briefDescription: dto.briefDescription,
      guide: dto.guide,
      productType: productType,
    };

    // product entity 생성
    const product = Product.create(productProps);
    const savedProduct = await productRepositoryTx.saveProduct(product);

    // 상품 타입에 따른 추가 정보 저장
    if (product.isVisitType()) {
      this.productDomainService.validateVisitProductFields(
        dto.postalCode,
        dto.roadName,
      );

      const address = Address.create(dto.postalCode, dto.roadName);
      const savedAddress = await addressRepositoryTx.save(address);

      const visitProduct = VisitProduct.create(
        savedProduct.id,
        savedAddress.id,
      );

      await visitProductRepositoryTx.save(visitProduct);
    } else if (product.isServiceType()) {
      this.productDomainService.validateServiceProductFields(dto.genderCode);

      const gender = await genderRepositoryTx.findByCode(dto.genderCode);
      if (!gender) {
        throw new NotFoundException(
          `성별 코드 ${dto.genderCode}를 찾을 수 없습니다.`,
        );
      }

      const serviceProduct = ServiceProduct.create(
        savedProduct.id,
        gender.id,
        dto.isSponsored,
      );

      await serviceProductRepositoryTx.save(serviceProduct);
    }

    return savedProduct;
  }
}
