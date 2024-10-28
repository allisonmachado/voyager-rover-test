import { mainDataSource } from '../data-source';
import { Plateau } from '../entities/Plateau';
import { RoboticRover } from '../entities/RoboticRover';
import { BusinessValidationError } from '../util/validation-error';
import { logger } from '../util/logger';
import { MoveInstruction } from '../entities/MoveInstruction';

export const create = async (args: {
  plateauId: number;
  initialPosition: {
    x: number;
    y: number;
  };
  orientation: 'N' | 'E' | 'S' | 'W';
}): Promise<RoboticRover> => {
  return mainDataSource.transaction(async (entityManager) => {
    const roverRepository = entityManager.getRepository(RoboticRover);
    const plateauRepository = entityManager.getRepository(Plateau);

    const parentPlateau = await entityManager.withRepository(plateauRepository).findOneByOrFail({
      id: args.plateauId,
    });

    if (
      parentPlateau.xWidth < args.initialPosition.x ||
      parentPlateau.yHeight < args.initialPosition.y ||
      args.initialPosition.x < 0 ||
      args.initialPosition.y < 0
    ) {
      throw new BusinessValidationError('Initial position is out of bounds');
    }

    const rovers = await entityManager.withRepository(roverRepository).find({
      where: {
        plateau: parentPlateau,
        xCurrentPosition: args.initialPosition.x,
        yCurrentPosition: args.initialPosition.y,
      },
      lock: { mode: 'pessimistic_write' },
    });

    if (rovers.length > 0) {
      throw new BusinessValidationError('Initial position is already occupied');
    }

    const newRover = entityManager.withRepository(roverRepository).create({
      xInitialPosition: args.initialPosition.x,
      yInitialPosition: args.initialPosition.y,
      xCurrentPosition: args.initialPosition.x,
      yCurrentPosition: args.initialPosition.y,
      orientation: args.orientation,
      plateau: parentPlateau,
    });

    await entityManager.withRepository(roverRepository).save(newRover);

    return newRover;
  });
};

const rotate = (orientation: 'N' | 'E' | 'S' | 'W', direction: 'L' | 'R'): 'N' | 'E' | 'S' | 'W' => {
  const orientations = ['N', 'E', 'S', 'W'];

  const currentIndex = orientations.indexOf(orientation);

  if (direction === 'L') {
    return orientations[(currentIndex + 3) % 4] as 'N' | 'E' | 'S' | 'W';
  } else {
    return orientations[(currentIndex + 1) % 4] as 'N' | 'E' | 'S' | 'W';
  }
};

export const move = async (args: {
  roverId: number;
  instructions: ('L' | 'R' | 'M')[];
}): Promise<{
  appliedMoves: {
    instruction: 'L' | 'R' | 'M';
    position: {
      x: number;
      y: number;
    };
    orientation: 'N' | 'E' | 'S' | 'W';
  }[];
  updatedRover: RoboticRover;
}> => {
  return mainDataSource.transaction(async (entityManager) => {
    const roverRepository = entityManager.getRepository(RoboticRover);
    const moveInstructionRepository = entityManager.getRepository(MoveInstruction);

    const targetRover = await entityManager.withRepository(roverRepository).findOneOrFail({
      where: {
        id: args.roverId,
      },
      relations: {
        plateau: true,
      },
    });

    let currentPosition = {
      x: targetRover.xCurrentPosition,
      y: targetRover.yCurrentPosition,
    };
    let orientation = targetRover.orientation;

    const appliedMoves = [];

    for (const instruction of args.instructions) {
      switch (instruction) {
        case 'L':
          orientation = rotate(orientation, 'L');
          targetRover.orientation = orientation;
          await entityManager.withRepository(roverRepository).save(targetRover);
          await entityManager.withRepository(moveInstructionRepository).insert({
            code: 'L',
            xNextPosition: currentPosition.x,
            yNextPosition: currentPosition.y,
            nextOrientation: orientation,
            roboticRover: targetRover,
          });
          appliedMoves.push({
            instruction: 'L',
            position: {
              x: currentPosition.x,
              y: currentPosition.y,
            },
            orientation,
          });
          break;
        case 'R':
          orientation = rotate(orientation, 'R');
          targetRover.orientation = orientation;
          await entityManager.withRepository(roverRepository).save(targetRover);
          await entityManager.withRepository(moveInstructionRepository).insert({
            code: 'R',
            xNextPosition: currentPosition.x,
            yNextPosition: currentPosition.y,
            nextOrientation: orientation,
            roboticRover: targetRover,
          });
          appliedMoves.push({
            instruction: 'R',
            position: {
              x: currentPosition.x,
              y: currentPosition.y,
            },
            orientation,
          });
          break;
        case 'M':
          switch (orientation) {
            case 'N':
              currentPosition.y += 1;
              break;
            case 'E':
              currentPosition.x += 1;
              break;
            case 'S':
              currentPosition.y -= 1;
              break;
            case 'W':
              currentPosition.x -= 1;
              break;
          }

          if (
            currentPosition.x < 0 ||
            currentPosition.y < 0 ||
            currentPosition.x > targetRover.plateau.xWidth ||
            currentPosition.y > targetRover.plateau.yHeight
          ) {
            logger.debug({
              action: 'move',
              message: 'Rover is out of bounds',
              currentPosition,
              plateau: targetRover.plateau,
            });

            return {
              appliedMoves,
              updatedRover: targetRover,
            };
          }

          const rovers = await entityManager.withRepository(roverRepository).find({
            where: {
              plateau: targetRover.plateau,
              xCurrentPosition: currentPosition.x,
              yCurrentPosition: currentPosition.y,
            },
            lock: { mode: 'pessimistic_write' },
          });

          if (rovers.length > 0) {
            logger.debug({
              action: 'move',
              message: 'Rover is colliding with another rover',
              currentPosition,
              plateau: targetRover.plateau,
            });

            return {
              appliedMoves,
              updatedRover: targetRover,
            };
          }

          targetRover.xCurrentPosition = currentPosition.x;
          targetRover.yCurrentPosition = currentPosition.y;
          await entityManager.withRepository(roverRepository).save(targetRover);
          await entityManager.withRepository(moveInstructionRepository).insert({
            code: 'M',
            xNextPosition: currentPosition.x,
            yNextPosition: currentPosition.y,
            nextOrientation: orientation,
            roboticRover: targetRover,
          });
          appliedMoves.push({
            instruction: 'M',
            position: {
              x: currentPosition.x,
              y: currentPosition.y,
            },
            orientation,
          });
          break;
      }
    }

    return {
      appliedMoves,
      updatedRover: targetRover,
    };
  });
};

export const listAllFromPlateau = async (plateauId: number) => {
  return mainDataSource.getRepository(RoboticRover).find({
    where: {
      plateau: {
        id: plateauId,
      },
    },
  });
};

export const remove = async (roverId: number) => {
  return mainDataSource.getRepository(RoboticRover).softDelete({
    id: roverId,
  });
};
