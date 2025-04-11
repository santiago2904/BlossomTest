import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { Character } from '../modules/characters/entities/character.entity';
import configuration from '../config/configuration';
import { join } from 'path';

// Load environment variables
config();

// Obtener la configuración completa
const appConfig = configuration();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: appConfig.database.host,
  port: appConfig.database.port,
  username: appConfig.database.username,
  password: appConfig.database.password,
  database: appConfig.database.database,
  entities: [Character],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  migrationsRun: false,
  synchronize: false,
  logging: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
