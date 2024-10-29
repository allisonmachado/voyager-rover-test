import { Server } from '@hapi/hapi';
import { moveRoboticRover, removeRoboticRover } from './routes';

const register = (server: Server): void => {
  server.route([
    {
      method: 'DELETE',
      path: '/robotic-rovers/{roboticRoverId}',
      options: removeRoboticRover,
    },
    {
      method: 'POST',
      path: '/robotic-rovers/{roboticRoverId}/move-instructions',
      options: moveRoboticRover,
    },
  ]);
};

export default {
  register,
  name: 'robotic-rovers-plugin',
};
