import { DataSource } from 'typeorm';
import { config } from './config';
import { Plateau } from './entities/Plateau';
import { RoboticRover } from './entities/RoboticRover';
import { MoveInstruction } from './entities/MoveInstruction';
import { logger } from './util/logger';

const { main } = config.get('database');

export const mainDataSource = new DataSource({
  type: 'mysql',
  connectorPackage: 'mysql2',
  host: main.host,
  port: main.port,
  username: main.user,
  password: main.password,
  database: main.database,
  synchronize: true,
  logging: ['error', 'migration', 'warn', 'log'],
  entities: [Plateau, RoboticRover, MoveInstruction],
});

export async function initializeDatabase() {
  const MAX_RETRIES = 5;
  let retryCount = 0;

  try {
    if (!mainDataSource.isInitialized) {
      await mainDataSource.initialize();

      logger.debug({
        action: 'initializeDatabase',
        message: 'Database successfully initialized',
      });
    }
  } catch (error) {
    retryCount++;

    if (retryCount >= MAX_RETRIES) {
      logger.error({
        action: 'initializeDatabase',
        message: `Failed after ${MAX_RETRIES} retries.`,
      });
      throw error;
    }

    const exponentialBackoff = 2 ** retryCount;

    logger.debug({
      action: `initializeDatabase: retrying in ${exponentialBackoff} seconds`,
      error,
    });

    await new Promise((resolve) => setTimeout(resolve, exponentialBackoff * 1000));
    await initializeDatabase();
  }
}
