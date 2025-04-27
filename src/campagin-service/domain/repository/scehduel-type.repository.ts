import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { ScheduleType } from '@/src/campagin-service/domain/schedule.type';
import { ScheduleTypeReader } from '@/src/campagin-service/domain/port/scehedule-type.reader';
import { TransactionalReaderWriter } from '@/src/databases/transactional-reader-writer.repository';
import { InjectEntityManager } from '@nestjs/typeorm';



@Injectable()
export class ScheduleTypeRepository
  extends Repository<ScheduleType>
  implements ScheduleTypeReader, TransactionalReaderWriter<ScheduleTypeReader>
{
  constructor(
    @InjectEntityManager() manager: EntityManager,
    @Optional() queryRunner?: QueryRunner,
  ) {
    super(ScheduleType, manager, queryRunner);
  }

  async findByIdOrThrow(id: number): Promise<ScheduleType> {
    const scheduleTypeId = await this.findOne({ where: { id } });
    if (!scheduleTypeId) {
      throw new NotFoundException(`스케줄 타입 ID 를 찾을 수 없습니다.`);
    }
    return scheduleTypeId;
  }

  async findByCodeOrThrow(code: string): Promise<ScheduleType> {
    const scheduleType = await this.findOne({ where: { code } });
    if (!scheduleType) {
      throw new NotFoundException(`스케줄 타입(${code})을 찾을 수 없습니다.`);
    }
    return scheduleType;
  }

  async findByCampaignTypeAndPlatform(
    campaignTypeId: number,
    influencerPlatformId: number,
  ): Promise<ScheduleType[]> {
    return this.find({
      where: {
        campaignType: { id: campaignTypeId },
        influencerPlatform: { id: influencerPlatformId },
      },
    });
  }

  withTransaction(entityManager: EntityManager): ScheduleTypeReader {
    const repository = entityManager.getRepository(ScheduleType);
    return {
      findByIdOrThrow: async (id: number) => {
        const scheduleTypeId = await this.findOne({ where: { id } });
        if (!scheduleTypeId) {
          throw new NotFoundException(`스케줄 타입 ID 를 찾을 수 없습니다.`);
        }
        return scheduleTypeId;
      },

      findByCodeOrThrow: async (code: string) => {
        const scheduleType = await repository.findOne({ where: { code } });

        if (!scheduleType) {
          throw new NotFoundException(
            `스케줄 타입(${code})을 찾을 수 없습니다.`,
          );
        }
        return scheduleType;
      },
      findByCampaignTypeAndPlatform: async (
        campaignTypeId: number,
        influencerPlatformId: number,
      ) => {
        return repository.find({
          where: {
            campaignType: { id: campaignTypeId },
            influencerPlatform: { id: influencerPlatformId },
          },
        });
      },
    };
  }
}
