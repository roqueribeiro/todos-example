import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? undefined : join(process.cwd(), '.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Task],
  synchronize: false,
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
});

export default AppDataSource;
