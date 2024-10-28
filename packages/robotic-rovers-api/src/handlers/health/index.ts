import { Server } from '@hapi/hapi';
import { getHealthHandler } from './routes';

const register = (server: Server): void => {
  server.route([
    {
      method: 'GET',
      path: '/health',
      options: getHealthHandler,
    },
  ]);
};

export default {
  register,
  name: 'health-plugin',
};
