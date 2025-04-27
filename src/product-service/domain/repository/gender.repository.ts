import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { Gender } from '@/src/product-service/domain/gender';
import { InjectEntityManager } from '@nestjs/typeorm';
import { GenderReader } from '@/src/product-service/domain/port/gender.reader';
import { TransactionalReaderWriter } from '@/src/databases/transactional-reader-writer.repository';

@Injectable()
export class GenderRepository
  extends Repository<Gender>
  implements GenderReader, TransactionalReaderWriter<GenderReader>
{
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

  async findByCodeOrThrow(code: string): Promise<Gender> {
    const gender = await this.findByCode(code);
    if (!gender) {
      throw new NotFoundException(`성별 코드 ${code}를 찾을 수 없습니다.`);
    }
    return gender;
  }

  withTransaction(entityManager: EntityManager): GenderReader {
    const repository = entityManager.getRepository(Gender);
    return {
      findByCode: (code: string) => repository.findOneBy({ code }),
      findByCodeOrThrow: async (code: string) => {
        const gender = await repository.findOneBy({ code });
        if (!gender) {
          throw new NotFoundException(`성별 코드 ${code}를 찾을 수 없습니다.`);
        }
        return gender;
      },
    };
  }
}
