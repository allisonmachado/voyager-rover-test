import { Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import { checkDatabaseHealth } from '../../services/health';

/**
 * @listens GET /health
 */
export const getHealthHandler: RouteOptions = {
  id: 'getHealthHandler',
  tags: ['api'],
  description: 'Get general health status of the service',
  handler: async (_r: Request, h: ResponseToolkit) => {
    const isDatabaseHealthy = await checkDatabaseHealth();

    if (isDatabaseHealthy) {
      return h.response().code(200);
    }

    return h.response().code(500);
  },
};
