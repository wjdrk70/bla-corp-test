import { Product } from '@/src/product-service/domain/product';
import { Injectable, Optional } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { ProductWriter } from '@/src/product-service/domain/port/product.writer';
import { TransactionalReaderWriter } from '@/src/databases/transactional-reader-writer.repository';

@Injectable()
@Injectable()
export class ProductRepository
  extends Repository<Product>
  implements ProductWriter, TransactionalReaderWriter<ProductWriter>
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    @Optional()
    queryRunner?: QueryRunner,
  ) {
    super(Product, manager, queryRunner);
  }

  withTransaction(entityManager: EntityManager): ProductWriter {
    const repository = entityManager.getRepository(Product);
    return {
      save: (product: Product) => repository.save(product),
    };
  }
}
