import { ServiceProduct } from '@/src/product-service/domain/service.product';
import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ServiceProductWriter } from '@/src/product-service/domain/port/service-product.writer';
import { TransactionalReaderWriter } from '@/src/databases/transactional-reader-writer.repository';

@Injectable()
export class ServiceProductRepository
  extends Repository<ServiceProduct>
  implements
    ServiceProductWriter,
    TransactionalReaderWriter<ServiceProductWriter>
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    @Optional()
    queryRunner?: QueryRunner,
  ) {
    super(ServiceProduct, manager, queryRunner);
  }

  withTransaction(entityManager: EntityManager): ServiceProductWriter {
    const repository = entityManager.getRepository(ServiceProduct);
    return {
      save: (serviceProduct: ServiceProduct) => repository.save(serviceProduct),
    };
  }
}
