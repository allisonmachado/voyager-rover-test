import { Request } from '@hapi/hapi';

export interface CreatePlateauRequest extends Request {
  payload: {
    width: number;
    height: number;
  };
}

export interface RemovePlateauRequest extends Request {
  params: {
    plateauId: number;
  };
}

export interface DeployRoverRequest extends Request {
  params: {
    plateauId: number;
  };
  payload: {
    initialPosition: {
      x: number;
      y: number;
    };
    orientation: 'N' | 'E' | 'S' | 'W';
  };
}

export type GetPlateauRequest = RemovePlateauRequest;
export type GetRoversRequest = RemovePlateauRequest;
