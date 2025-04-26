import { ProductType } from '@/src/product-service/domain/product.type';
import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ProductTypeReader } from '@/src/product-service/domain/port/product-type.reader';
import { TransactionalReaderWriter } from '@/src/databases/transactional-reader-writer.repository';

@Injectable()
export class ProductTypeRepository
  extends Repository<ProductType>
  implements ProductTypeReader, TransactionalReaderWriter<ProductTypeReader>
{
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    @Optional()
    queryRunner?: QueryRunner,
  ) {
    super(ProductType, manager, queryRunner);
  }

  findByCode(code: string): Promise<ProductType | null> {
    return this.findOneBy({ code });
  }

  async findByCodeOrThrow(code: string): Promise<ProductType> {
    const productType = await this.findByCode(code);
    if (!productType) {
      throw new NotFoundException(`상품 타입 코드 ${code}를 찾을 수 없습니다.`);
    }
    return productType;
  }

  withTransaction(entityManager: EntityManager): ProductTypeReader {
    const repository = entityManager.getRepository(ProductType);
    return {
      findByCode: (code: string) => repository.findOneBy({ code }),
      findByCodeOrThrow: async (code: string) => {
        const productType = await repository.findOneBy({ code });
        if (!productType) {
          throw new NotFoundException(
            `상품 타입 코드 ${code}를 찾을 수 없습니다.`,
          );
        }
        return productType;
      },
    };
  }
}
