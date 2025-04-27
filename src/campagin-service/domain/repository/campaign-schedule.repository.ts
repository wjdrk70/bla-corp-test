import { Injectable, Optional } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { TransactionalReaderWriter } from '@/src/databases/transactional-reader-writer.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CampaignSchedule } from '@/src/campagin-service/domain/campaign.schedule';
import { CampaignScheduleWriter } from '@/src/campagin-service/domain/port/campaign-schedule.writer';

@Injectable()
export class CampaignScheduleRepository
  extends Repository<CampaignSchedule>
  implements
    CampaignScheduleWriter,
    TransactionalReaderWriter<CampaignScheduleWriter>
{
  constructor(
    @InjectEntityManager() manager: EntityManager,
    @Optional() queryRunner?: QueryRunner,
  ) {
    super(CampaignSchedule, manager, queryRunner);
  }

  async saveMany(
    campaignSchedules: CampaignSchedule[],
  ): Promise<CampaignSchedule[]> {
    return this.manager.save(campaignSchedules);
  }

  withTransaction(entityManager: EntityManager): CampaignScheduleWriter {
    const repository = entityManager.getRepository(CampaignSchedule);
    return {
      save: (campaignSchedule: CampaignSchedule) =>
        repository.save(campaignSchedule),
      saveMany: (campaignSchedules: CampaignSchedule[]) =>
        repository.save(campaignSchedules),
    };
  }
}
