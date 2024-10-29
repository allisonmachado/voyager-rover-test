import { mainDataSource } from '../data-source';
import { logger } from '../util/logger';

export async function checkDatabaseHealth() {
  try {
    const [{ result }] = await mainDataSource.query('SELECT 1 as result');

    return result === '1';
  } catch (error) {
    logger.error({ action: 'checkDatabaseHealth', error });
    return false;
  }
}
