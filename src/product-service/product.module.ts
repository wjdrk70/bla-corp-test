import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/src/product-service/domain/product';
import { ProductType } from '@/src/product-service/domain/product.type';
import { ProductTypeRepository } from '@/src/product-service/domain/repository/product-type.repository';


@Module({
  imports:[TypeOrmModule.forFeature([Product,ProductType])],
  providers: [ProductTypeRepository],
  exports: [ProductTypeRepository]
})
export class ProductModule {}