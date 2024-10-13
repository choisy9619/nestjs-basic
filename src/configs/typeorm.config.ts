import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

export const typeormConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  // Entities to be loaded for this connection
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // Indicates if database schema should be auto created on every application launch
  // Be careful with this option and don't use this in production - otherwise you can lose production data
  // This option is useful during debug and development
  synchronize: dbConfig.synchronize,
};
