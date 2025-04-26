import { Address } from '../address';
import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class AddressRepository extends Repository<Address> {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    @Optional()
    queryRunner?: QueryRunner,
  ) {
    super(Address, manager, queryRunner);
  }
}
