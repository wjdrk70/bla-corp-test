import { VisitProduct } from '@/src/product-service/domain/visit.product';
import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { VisitProductWriter } from '@/src/product-service/domain/port/visit-product.writer';
import { TransactionalReaderWriter } from '@/src/databases/transactional-reader-writer.repository';

@Injectable()
export class VisitProductRepository extends Repository<VisitProduct>
  implements VisitProductWriter, TransactionalReaderWriter<VisitProductWriter> {

  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    @Optional()
    queryRunner?: QueryRunner,
  ) {
    super(VisitProduct, manager, queryRunner);
  }


  withTransaction(entityManager: EntityManager): VisitProductWriter {
    const repository = entityManager.getRepository(VisitProduct);
    return {
      save: (visitProduct: VisitProduct) => repository.save(visitProduct)
    };
  }
}
