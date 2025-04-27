import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { InfluencerPlatform } from '@/src/campagin-service/domain/influencer.platform';
import { InfluencePlatformReader } from '@/src/campagin-service/domain/port/influence-platform.reader';
import { TransactionalReaderWriter } from '@/src/databases/transactional-reader-writer.repository';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class InfluencePlatformRepository
  extends Repository<InfluencerPlatform>
  implements
    InfluencePlatformReader,
    TransactionalReaderWriter<InfluencePlatformReader>
{
  constructor(
    @InjectEntityManager() manager: EntityManager,
    @Optional() queryRunner?: QueryRunner,
  ) {
    super(InfluencerPlatform, manager, queryRunner);
  }

  async findByCodeOrThrow(code: string): Promise<InfluencerPlatform> {
    const platFormType = await this.findOne({ where: { code } });
    if (!platFormType) {
      throw new NotFoundException(`플랫폼 타입(${code})을 찾을 수 없습니다.`);
    }
    return platFormType;
  }

  async findByIdOrThrow(id: number): Promise<InfluencerPlatform> {
    const influencerPlatform = await this.findOneBy({ id });
    if (!influencerPlatform) {
      throw new NotFoundException(
        `인플루언서 플랫폼(ID: ${id})을 찾을 수 없습니다.`,
      );
    }
    return influencerPlatform;
  }

  withTransaction(entityManager: EntityManager): InfluencePlatformReader {
    const repository = entityManager.getRepository(InfluencerPlatform);
    return {
      findByCodeOrThrow: async (code: string) => {
        const platFormType = await repository.findOne({ where: { code } });
        if (!platFormType) {
          throw new NotFoundException(
            `플랫폼 타입(${code})을 찾을 수 없습니다.`,
          );
        }
        return platFormType;
      },
      findByIdOrThrow: async (id: number) => {
        const influencerPlatform = await repository.findOneBy({ id });
        if (!influencerPlatform) {
          throw new NotFoundException(
            `인플루언서 플랫폼(ID: ${id})을 찾을 수 없습니다.`,
          );
        }
        return influencerPlatform;
      },
    };
  }
}
