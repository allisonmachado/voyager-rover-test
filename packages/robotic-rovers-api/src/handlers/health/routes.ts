import { Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import { logger } from '../../util/logger';

/**
 * @listens GET /health
 */
export const getHealthHandler: RouteOptions = {
  id: 'getHealthHandler',
  description: 'Get general health status of the service',
  handler: async (_r: Request, h: ResponseToolkit) => {
    try {
      const debugInfo = {
        status: 'ok',
      };

      logger.debug({ action: 'getHealthHandler', ...debugInfo });

      return h.response(debugInfo).code(200);
    } catch (err) {
      logger.error({ action: 'getHealthHandler', err });

      return h.response().code(500);
    }
  },
};
