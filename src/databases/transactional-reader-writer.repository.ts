import { EntityManager } from 'typeorm';

export interface TransactionalReaderWriter<T> {
  withTransaction(entityManager: EntityManager): T;
}
