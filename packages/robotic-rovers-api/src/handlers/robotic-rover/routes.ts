import { ResponseToolkit, RouteOptions } from '@hapi/hapi';
import Joi from 'joi';
import { MoveRoboticRoverRequest, RemoveRoboticRoverRequest } from './types';

import * as roboticRoverService from '../../services/robotic-rover';

/**
 * @listens DELETE /robotic-rovers/{roboticRoverId}
 */
export const removeRoboticRover: RouteOptions = {
  description: 'Removes robotic rover by id',
  tags: ['api'],
  validate: {
    params: Joi.object({
      roboticRoverId: Joi.number().required().min(1).integer(),
    }),
    failAction: (_request, _h, error) => {
      throw error;
    },
  },
  handler: async (request: RemoveRoboticRoverRequest, h: ResponseToolkit) => {
    const { roboticRoverId } = request.params;

    await roboticRoverService.remove(roboticRoverId);

    return h.response().code(204);
  },
};

/**
 * @listens POST robotic-rovers/{roboticRoverId}/move-instructions
 */
export const moveRoboticRover: RouteOptions = {
  description: 'Moves robotic rover by id',
  tags: ['api'],
  validate: {
    params: Joi.object({
      roboticRoverId: Joi.number().required().min(1).integer(),
    }),
    payload: Joi.object({
      instructions: Joi.string()
        .required()
        .uppercase()
        .trim()
        .regex(/^[LRM]+$/),
    }),
    failAction: (_request, _h, error) => {
      throw error;
    },
  },
  handler: async (request: MoveRoboticRoverRequest, h: ResponseToolkit) => {
    try {
      const { payload, params } = request;

      const instructions = payload.instructions.split('') as ('L' | 'R' | 'M')[];
      const totalInstructions = instructions.length;

      const { appliedMoves: appliedInstructions, updatedRover } = await roboticRoverService.move({
        roverId: params.roboticRoverId,
        instructions,
      });

      return h
        .response({
          totalInstructions,
          totalAppliedInstructions: appliedInstructions.length,
          appliedInstructions,
          updatedRover,
        })
        .code(200);
    } catch (error) {
      return h.response({ message: error.message }).code(400);
    }
  },
};
