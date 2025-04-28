import { EntityManager, ObjectType, Repository } from 'typeorm';

export abstract class TransactionalRepository<
  T,
  TargetRepository,
> extends Repository<T> {
  protected constructor(
    protected readonly entityClass: ObjectType<T>,
    protected readonly repository: Repository<T>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  abstract transactional(entityManager: EntityManager): TargetRepository;

  protected fromEntityManager(
    entityManager: EntityManager,
    constr: (repository: Repository<T>) => TargetRepository,
  ): TargetRepository {
    return constr(entityManager.getRepository(this.entityClass));
  }
}
