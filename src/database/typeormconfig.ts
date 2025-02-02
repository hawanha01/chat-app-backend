import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

export const dbConfig = (): DataSourceOptions => {
  return {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [`${__dirname}/migrations/*.ts`],
    migrationsTableName: 'migrations',
    synchronize: false,
    logging: false,
    ssl: {
      rejectUnauthorized: false,
    },
  };
};
export const AppDataSource = new DataSource(dbConfig());
