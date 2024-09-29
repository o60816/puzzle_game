import 'dotenv/config';
import logger from 'src/utils/logger';
import { AbstractLogger, DataSource } from 'typeorm';

export class TypeOrmLogger extends AbstractLogger {
  protected writeLog() {}
  logQuery(query: string, parameters?: any[]) {
    logger.debug(`executing query: ${query}, parameters: ${parameters}`);
  }
}

const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE } =
  process.env;

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: MYSQL_HOST,
        port: Number(MYSQL_PORT),
        username: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        logging: true,
        logger: new TypeOrmLogger(true),
      });

      return dataSource.initialize();
    },
  },
];
