import { faker } from '@faker-js/faker';
import { Plateau } from '../entities/Plateau';
import { mainDataSource } from '../data-source';
import { RoboticRover } from '../entities/RoboticRover';

const generateName = () => {
  const planetPrefix = faker.science.chemicalElement().symbol;
  const adjective = faker.word.adjective();
  const geographicalFeature = faker.location.cardinalDirection();

  return `${planetPrefix}-${adjective.charAt(0).toUpperCase() + adjective.slice(1)} ${geographicalFeature} Plateau`;
};

const assertMinPlateauAspectRatio = (xWidth: number, yHeight: number) => {
  const ratio = Math.floor(xWidth / yHeight);

  if (ratio < 2) {
    throw new Error('Plateau aspect ratio must be at least 2:1 (width:height)');
  }
};

export const create = async (xWidth: number, yHeight: number): Promise<Plateau> => {
  const plateauRepository = mainDataSource.getRepository(Plateau);

  assertMinPlateauAspectRatio(xWidth, yHeight);

  const newPlateau = plateauRepository.create({
    name: generateName(),
    xWidth,
    yHeight,
  });

  await plateauRepository.save(newPlateau);

  return newPlateau;
};

export const remove = async (plateauId: number) => {
  return mainDataSource.transaction(async (entityManager) => {
    const plateauRepository = entityManager.withRepository(entityManager.getRepository(Plateau));
    const roverRepository = entityManager.withRepository(entityManager.getRepository(RoboticRover));

    const parentPlateau = await plateauRepository.findOneBy({
      id: plateauId,
    });

    if (!parentPlateau) {
      return null;
    }

    const childRovers = await roverRepository.findBy({
      plateau: parentPlateau,
    });

    if (childRovers.length > 0) {
      await roverRepository.softRemove(childRovers);
    }

    return plateauRepository.softRemove(parentPlateau);
  });
};

export const listAll = async () => {
  return mainDataSource.getRepository(Plateau).find();
};

export const find = async (plateauId: number) => {
  return mainDataSource.getRepository(Plateau).findOneBy({ id: plateauId });
};
