import { Product } from '@/src/product-service/domain/product';
import { Injectable, Optional } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    @Optional()
    queryRunner?: QueryRunner,
  ) {
    super(Product, manager, queryRunner);
  }

  saveProduct(product: Product): Promise<Product> {
    return this.save(product);
  }
}
