import { Request } from '@hapi/hapi';

export interface RemoveRoboticRoverRequest extends Request {
  params: {
    roboticRoverId: number;
  };
}

export interface MoveRoboticRoverRequest extends Request {
  params: {
    roboticRoverId: number;
  };
  payload: {
    instructions: string;
  };
}
