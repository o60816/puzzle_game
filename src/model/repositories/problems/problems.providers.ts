import { DataSource } from 'typeorm';
import { ProblemsEntity } from './problems.entity';

export const problemProviders = [
  {
    provide: 'PROBLEM_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProblemsEntity),
    inject: ['DATA_SOURCE'],
  },
];
