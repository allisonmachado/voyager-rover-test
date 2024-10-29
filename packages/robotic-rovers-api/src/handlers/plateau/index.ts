import { Server } from '@hapi/hapi';
import { getPlateaus, createPlateau, removePlateau, deployRover, getRoboticRovers, getPlateau } from './routes';

const register = (server: Server): void => {
  server.route([
    {
      method: 'GET',
      path: '/plateaus',
      options: getPlateaus,
    },
    {
      method: 'GET',
      path: '/plateaus/{plateauId}',
      options: getPlateau,
    },
    {
      method: 'POST',
      path: '/plateaus',
      options: createPlateau,
    },
    {
      method: 'DELETE',
      path: '/plateaus/{plateauId}',
      options: removePlateau,
    },
    {
      method: 'POST',
      path: '/plateaus/{plateauId}/robotic-rovers',
      options: deployRover,
    },
    {
      method: 'GET',
      path: '/plateaus/{plateauId}/robotic-rovers',
      options: getRoboticRovers,
    },
  ]);
};

export default {
  register,
  name: 'plateaus-plugin',
};
