import { ServiceProduct } from '@/src/product-service/domain/service.product';
import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class ServiceProductRepository extends Repository<ServiceProduct> {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    @Optional()
    queryRunner?: QueryRunner,
  ) {
    super(ServiceProduct, manager, queryRunner);
  }
}
