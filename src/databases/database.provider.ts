// src/databases/database.providers.ts
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (dataSource: DataSource) => {
      return dataSource;
    },
    inject: [DataSource],
  },
];