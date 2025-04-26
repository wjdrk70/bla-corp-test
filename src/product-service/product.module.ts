import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/src/product-service/domain/product';
import { ProductType } from '@/src/product-service/domain/product.type';
import { ProductTypeRepository } from '@/src/product-service/domain/repository/product-type.repository';
import { Address } from '@/src/product-service/domain/address';
import { Gender } from '@/src/product-service/domain/gender';
import { VisitProduct } from '@/src/product-service/domain/visit.product';
import { ServiceProduct } from '@/src/product-service/domain/service.product';
import { AddressRepository } from '@/src/product-service/domain/repository/address.repository';
import { ProductRepository } from '@/src/product-service/domain/repository/product.repository';
import { GenderRepository } from '@/src/product-service/domain/repository/gender.repository';
import { VisitProductRepository } from '@/src/product-service/domain/repository/visit-product.repository';
import { ServiceProductRepository } from '@/src/product-service/domain/repository/service-product.repository';
import { ProductDomainService } from '@/src/product-service/domain/service/product.domain.service';
import { ProductService } from '@/src/product-service/application/service/product.service';


@Module({
  imports:[TypeOrmModule.forFeature([  Product,
    ProductType,
    Address,
    Gender,
    VisitProduct,
    ServiceProduct,
  ])],
  providers: [
    ProductRepository,
    ProductTypeRepository,
    AddressRepository,
    GenderRepository,
    VisitProductRepository,
    ServiceProductRepository,
    ProductDomainService,
    ProductService,


  ],
  exports: [
    ProductService,
    ProductRepository,
    ProductTypeRepository,
    AddressRepository,
    GenderRepository,
    VisitProductRepository,
    ServiceProductRepository,
  ]
})
export class ProductModule {}