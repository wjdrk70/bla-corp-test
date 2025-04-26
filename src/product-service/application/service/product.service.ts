import { Injectable } from '@nestjs/common';
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
import { ProductDomainService } from '@/src/product-service/domain/service/product.domain.service';


@Injectable()
export class ProductService {
  constructor(
    private readonly productDomainService: ProductDomainService,
    private readonly productTypeRepository: ProductTypeRepository,
    private readonly genderRepository: GenderRepository,
    private readonly productRepository: ProductRepository,
    private readonly addressRepository: AddressRepository,
    private readonly visitProductRepository: VisitProductRepository,
    private readonly serviceProductRepository: ServiceProductRepository,
  ) {}

  async createProduct(dto: CreateProductDto, manager: EntityManager): Promise<Product> {
    const productTypeReader = this.productTypeRepository.withTransaction(manager);
    const productWriter = this.productRepository.withTransaction(manager);

    // product 타입 조회 Reader 에서 예외 처리 캠슐화
    const productType = await productTypeReader.findByCodeOrThrow(
      dto.productTypeCode,
    );

    const productProps: ProductProps = {
      brandName: dto.brandName,
      productName: dto.productName,
      briefDescription: dto.briefDescription,
      guide: dto.guide,
      productType: productType,
    };

    // product entity 생성
    const product = this.productDomainService.createProduct(productProps);
    const savedProduct = await productWriter.save(product);

    // 상품 타입에 따른 타입별 상품 저장
    await this.createProductTypeData(savedProduct, dto, manager);

    return savedProduct;
  }

  private async createProductTypeData(
    product: Product,
    dto: CreateProductDto,
    manager: EntityManager,
  ): Promise<void> {
    const code = product.productType.code;

    if (product.isVisitType()) {
      await this.createVisitProductData(product, dto, manager);
    } else if (product.isServiceType()) {
      await this.createServiceProductData(product, dto, manager);
    } else {
      throw new Error(`지원하지 않는 상품 타입입니다: ${code}`);
    }
  }

  // 방문형 상품 데이터 생성
  private async createVisitProductData(
    product: Product,
    dto: CreateProductDto,
    manager: EntityManager,
  ): Promise<void> {
    this.productDomainService.validateVisitProductFields(
      dto.postalCode,
      dto.roadName,
    );

    const addressWriter = this.addressRepository.withTransaction(manager);
    const visitProductWriter = this.visitProductRepository.withTransaction(manager);

    const address = this.productDomainService.createAddress(
      dto.postalCode!,
      dto.roadName!,
    );

    const savedAddress = await addressWriter.save(address);

    const visitProduct = this.productDomainService.createVisitProduct(
      product.id,
      savedAddress.id,
    );

    await visitProductWriter.save(visitProduct);
  }

  // 서비스형 상품 데이터 생성
  private async createServiceProductData(product: Product, dto: CreateProductDto, manager: EntityManager,): Promise<void> {
    this.productDomainService.validateServiceProductFields(dto.genderCode);

    const genderReader = this.genderRepository.withTransaction(manager);
    const serviceProductWriter = this.serviceProductRepository.withTransaction(manager);

    // 성별 정보 조회
    const gender = await genderReader.findByCodeOrThrow(dto.genderCode!);

    const serviceProduct = this.productDomainService.createServiceProduct(
      product.id,
      gender.id,
      dto.isSponsored || false,
    );

    await serviceProductWriter.save(serviceProduct);
  }
}
