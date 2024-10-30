import { Request, ResponseToolkit, RouteOptions } from '@hapi/hapi';
import * as plateauService from '../../services/plateau';
import * as roboticRoverService from '../../services/robotic-rover';
import Joi from 'joi';

import {
  CreatePlateauRequest,
  DeployRoverRequest,
  GetPlateauRequest,
  GetRoversRequest,
  RemovePlateauRequest,
} from './types';

/**
 * @listens POST /plateaus
 */
export const createPlateau: RouteOptions = {
  description: 'Creates and returns new plateau',
  tags: ['api'],
  validate: {
    payload: Joi.object({
      width: Joi.number().required().min(5).max(20),
      height: Joi.number().required().min(2).max(10),
    }),
    failAction: (_request, _h, error) => {
      throw error;
    },
  },
  handler: async (request: CreatePlateauRequest, h: ResponseToolkit) => {
    try {
      const { width, height } = request.payload;
      const result = await plateauService.create(width, height);

      return h.response(result).code(200);
    } catch (error) {
      return h.response({ message: error.message }).code(400);
    }
  },
};

/**
 * @listens GET /plateaus
 */
export const getPlateaus: RouteOptions = {
  description: 'Returns active plateaus saved in storage',
  tags: ['api'],
  handler: async (_r: Request, h: ResponseToolkit) => {
    const plateauList = await plateauService.listAll();

    return h.response(plateauList).code(200);
  },
};

/**
 * @listens GET /plateaus/{plateauId}
 */
export const getPlateau: RouteOptions = {
  description: 'Returns plateau by id',
  tags: ['api'],
  validate: {
    params: Joi.object({
      plateauId: Joi.number().required().min(1).integer(),
    }),
    failAction: (_request, _h, error) => {
      throw error;
    },
  },
  handler: async (request: GetPlateauRequest, h: ResponseToolkit) => {
    const { plateauId } = request.params;

    const plateau = await plateauService.find(plateauId);

    if (!plateau) {
      return h.response().code(404);
    }

    return h.response(plateau).code(200);
  },
};

/**
 * @listens DELETE /plateaus/{plateauId}
 */
export const removePlateau: RouteOptions = {
  description: 'Removes plateau by id',
  tags: ['api'],
  validate: {
    params: Joi.object({
      plateauId: Joi.number().required().min(1).integer(),
    }),
    failAction: (_request, _h, error) => {
      throw error;
    },
  },
  handler: async (request: RemovePlateauRequest, h: ResponseToolkit) => {
    const { plateauId } = request.params;

    await plateauService.remove(plateauId);

    return h.response().code(204);
  },
};

/**
 * @listens POST /plateaus/{plateauId}/robotic-rovers
 */
export const deployRover: RouteOptions = {
  description: 'Deploys new robotic rover on plateau',
  tags: ['api'],
  validate: {
    payload: Joi.object({
      initialPosition: Joi.object({
        x: Joi.number().required().min(0).max(19),
        y: Joi.number().required().min(0).max(19),
      }),
      orientation: Joi.string().required().valid('N', 'E', 'S', 'W'),
    }),
    failAction: (_request, _h, error) => {
      throw error;
    },
  },
  handler: async (request: DeployRoverRequest, h: ResponseToolkit) => {
    try {
      const { payload, params } = request;

      const result = await roboticRoverService.create({
        ...params,
        ...payload,
      });

      return h.response(result).code(200);
    } catch (error) {
      return h.response({ message: error.message }).code(400);
    }
  },
};

/**
 * @listens GET /plateau/{plateauId}/robotic-rovers
 */
export const getRoboticRovers: RouteOptions = {
  description: 'Returns robotic rovers deployed on plateau',
  tags: ['api'],
  validate: {
    params: Joi.object({
      plateauId: Joi.number().required().min(1).integer(),
    }),
    failAction: (_request, _h, error) => {
      throw error;
    },
  },
  handler: async (request: GetRoversRequest, h: ResponseToolkit) => {
    const { plateauId } = request.params;
    const roboticRovers = await roboticRoverService.listAllFromPlateau(plateauId);

    return h.response(roboticRovers).code(200);
  },
};
