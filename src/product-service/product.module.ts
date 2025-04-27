import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/src/product-service/domain/product';
import { ProductType } from '@/src/product-service/domain/product.type';
import { ProductTypeRepository } from '@/src/product-service/domain/repository/product-type.repository';
import { Address } from '@/src/product-service/domain/address';
import { Gender } from '@/src/product-service/domain/gender';
import { AddressRepository } from '@/src/product-service/domain/repository/address.repository';
import { ProductRepository } from '@/src/product-service/domain/repository/product.repository';
import { GenderRepository } from '@/src/product-service/domain/repository/gender.repository';
import { ProductDomainService } from '@/src/product-service/domain/service/product.domain.service';
import { ProductService } from '@/src/product-service/application/service/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductType, Address, Gender])],
  providers: [
    ProductRepository,
    ProductTypeRepository,
    AddressRepository,
    GenderRepository,
    ProductDomainService,
    ProductService,
  ],
  exports: [
    ProductService,
    ProductRepository,
    ProductTypeRepository,
    AddressRepository,
    GenderRepository,
  ],
})
export class ProductModule {}
