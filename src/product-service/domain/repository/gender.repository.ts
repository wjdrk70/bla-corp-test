import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { Gender } from '@/src/product-service/domain/gender';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class GenderRepository extends Repository<Gender> {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    @Optional()
    queryRunner?: QueryRunner,
  ) {
    super(Gender, manager, queryRunner);
  }

  findByCode(code: string): Promise<Gender | null> {
    return this.findOneBy({ code });
  }
}
