import { Campaign } from '@/src/campagin-service/domain/campaign';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { Injectable, Optional } from '@nestjs/common';
import { CampaignWriter } from '@/src/campagin-service/domain/port/campaign.writer';
import { TransactionalReaderWriter } from '@/src/databases/transactional-reader-writer.repository';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class CampaignRepository
  extends Repository<Campaign>
  implements CampaignWriter, TransactionalReaderWriter<CampaignWriter>
{
  constructor(
    @InjectEntityManager() manager: EntityManager,
    @Optional() queryRunner?: QueryRunner,
  ) {
    super(Campaign, manager, queryRunner);
  }


  withTransaction(entityManager: EntityManager): CampaignWriter {
    const repository = entityManager.getRepository(Campaign);
    return {
      save: (campaign: Campaign) => repository.save(campaign),
    };
  }
}
