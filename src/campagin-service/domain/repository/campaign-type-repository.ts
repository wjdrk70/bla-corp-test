import { CampaignType } from '@/src/campagin-service/domain/campaign.type';
import { TransactionalReaderWriter } from '@/src/databases/transactional-reader-writer.repository';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { CampaignTypeReader } from '@/src/campagin-service/domain/port/campaign-type.reader';

@Injectable()
export class CampaignTypeRepository
  extends Repository<CampaignType>
  implements CampaignTypeReader, TransactionalReaderWriter<CampaignTypeReader>
{
  constructor(
    @InjectEntityManager() manager: EntityManager,
    @Optional() queryRunner?: QueryRunner,
  ) {
    super(CampaignType, manager, queryRunner);
  }

  async findByCodeOrThrow(code: string): Promise<CampaignType> {
    const campaignType = await this.findOne({ where: { code } });
    if (!campaignType) {
      throw new NotFoundException(`캠페인 타입(${code})을 찾을 수 없습니다.`);
    }
    return campaignType;
  }

  async findByIdOrThrow(id: number): Promise<CampaignType> {
    const campaignType = await this.findOneBy({ id });
    if (!campaignType) {
      throw new NotFoundException(`캠페인 타입(ID: ${id})을 찾을 수 없습니다.`);
    }
    return campaignType;
  }

  withTransaction(entityManager: EntityManager): CampaignTypeReader {
    const repository = entityManager.getRepository(CampaignType);
    return {
      findByCodeOrThrow: async (code: string) => {
        const campaignType = await repository.findOne({ where: { code } });
        if (!campaignType) {
          throw new NotFoundException(
            `캠페인 타입(${code})을 찾을 수 없습니다.`,
          );
        }
        return campaignType;
      },
      findByIdOrThrow: async (id: number) => {
        const campaignType = await repository.findOneBy({ id });
        if (!campaignType) {
          throw new NotFoundException(
            `캠페인 타입(ID: ${id})을 찾을 수 없습니다.`,
          );
        }
        return campaignType;
      },
    };
  }
}
