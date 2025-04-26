import { Address } from '../address';
import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { TransactionalReaderWriter } from '@/src/databases/transactional-reader-writer.repository';
import { AddressWriter } from '@/src/product-service/domain/port/address.writer';

@Injectable()
export class AddressRepository
  extends Repository<Address>
  implements AddressWriter, TransactionalReaderWriter<AddressWriter>
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    @Optional()
    queryRunner?: QueryRunner,
  ) {
    super(Address, manager, queryRunner);
  }

  withTransaction(entityManager: EntityManager): AddressWriter {
    const repository = entityManager.getRepository(Address);
    return {
      save: (address: Address) => repository.save(address),
    };
  }
}
