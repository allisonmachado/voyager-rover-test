import { mainDataSource } from '../data-source';
import { Plateau } from '../entities/Plateau';
import { RoboticRover } from '../entities/RoboticRover';
import { BusinessValidationError } from '../util/validation-error';
import { logger } from '../util/logger';
import { MoveInstruction } from '../entities/MoveInstruction';
import { Repository } from 'typeorm';

const rotate = (orientation: 'N' | 'E' | 'S' | 'W', direction: 'L' | 'R'): 'N' | 'E' | 'S' | 'W' => {
  const orientations = ['N', 'E', 'S', 'W'];

  const currentIndex = orientations.indexOf(orientation);

  if (direction === 'L') {
    return orientations[(currentIndex + 3) % 4] as 'N' | 'E' | 'S' | 'W';
  } else {
    return orientations[(currentIndex + 1) % 4] as 'N' | 'E' | 'S' | 'W';
  }
};

const saveRotation = async ({
  targetRover,
  direction,
  roverRepository,
  moveInstructionRepository,
}: {
  targetRover: RoboticRover;
  direction: 'L' | 'R';
  roverRepository: Repository<RoboticRover>;
  moveInstructionRepository: Repository<MoveInstruction>;
}) => {
  targetRover.orientation = rotate(targetRover.orientation, direction);

  await roverRepository.save(targetRover);
  await moveInstructionRepository.insert({
    code: direction,
    xNextPosition: targetRover.xCurrentPosition,
    yNextPosition: targetRover.yCurrentPosition,
    nextOrientation: targetRover.orientation,
    roboticRover: targetRover,
  });

  return {
    instruction: direction,
    position: {
      x: targetRover.xCurrentPosition,
      y: targetRover.yCurrentPosition,
    },
    orientation: targetRover.orientation,
  };
};

const saveMove = async ({
  targetRover,
  roverRepository,
  moveInstructionRepository,
}: {
  targetRover: RoboticRover;
  roverRepository: Repository<RoboticRover>;
  moveInstructionRepository: Repository<MoveInstruction>;
}) => {
  const nextPosition = {
    x: targetRover.xCurrentPosition,
    y: targetRover.yCurrentPosition,
  };

  switch (targetRover.orientation) {
    case 'N':
      nextPosition.y += 1;
      break;
    case 'E':
      nextPosition.x += 1;
      break;
    case 'S':
      nextPosition.y -= 1;
      break;
    case 'W':
      nextPosition.x -= 1;
      break;
  }

  if (
    nextPosition.x < 0 ||
    nextPosition.y < 0 ||
    nextPosition.x >= targetRover.plateau.xWidth ||
    nextPosition.y >= targetRover.plateau.yHeight
  ) {
    logger.debug({
      action: 'move',
      message: 'Rover on next position would be out of bounds',
      nextPosition,
      plateau: targetRover.plateau,
    });

    return null;
  }

  const rovers = await roverRepository.find({
    where: {
      plateau: targetRover.plateau,
      xCurrentPosition: nextPosition.x,
      yCurrentPosition: nextPosition.y,
    },
    lock: { mode: 'pessimistic_write' },
  });

  if (rovers.length > 0) {
    logger.debug({
      action: 'move',
      message: 'Rover on next position would collide with another rover',
      nextPosition,
      conflictingRovers: rovers,
      plateau: targetRover.plateau,
    });

    return null;
  }

  targetRover.xCurrentPosition = nextPosition.x;
  targetRover.yCurrentPosition = nextPosition.y;

  await roverRepository.save(targetRover);
  await moveInstructionRepository.insert({
    code: 'M',
    xNextPosition: nextPosition.x,
    yNextPosition: nextPosition.y,
    nextOrientation: targetRover.orientation,
    roboticRover: targetRover,
  });

  return {
    instruction: 'M',
    position: {
      x: targetRover.xCurrentPosition,
      y: targetRover.yCurrentPosition,
    },
    orientation: targetRover.orientation,
  };
};

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
      parentPlateau.xWidth <= args.initialPosition.x ||
      parentPlateau.yHeight <= args.initialPosition.y ||
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

    const appliedMoves = [];

    for (const instruction of args.instructions) {
      switch (instruction) {
        case 'L': {
          const move = await saveRotation({
            targetRover,
            direction: 'L',
            roverRepository: entityManager.withRepository(roverRepository),
            moveInstructionRepository: entityManager.withRepository(moveInstructionRepository),
          });

          appliedMoves.push(move);
          break;
        }
        case 'R': {
          const move = await saveRotation({
            targetRover,
            direction: 'R',
            roverRepository: entityManager.withRepository(roverRepository),
            moveInstructionRepository: entityManager.withRepository(moveInstructionRepository),
          });

          appliedMoves.push(move);
          break;
        }
        case 'M': {
          const move = await saveMove({
            targetRover,
            roverRepository: entityManager.withRepository(roverRepository),
            moveInstructionRepository: entityManager.withRepository(moveInstructionRepository),
          });

          if (!move) {
            // cannot keep processing moves
            return {
              appliedMoves,
              updatedRover: targetRover,
            };
          }

          appliedMoves.push(move);
        }
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
