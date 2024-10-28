import { mainDataSource } from '../data-source';
import { Plateau } from '../entities/Plateau';
import { RoboticRover } from '../entities/RoboticRover';
import { BusinessValidationError } from '../util/validation-error';

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
