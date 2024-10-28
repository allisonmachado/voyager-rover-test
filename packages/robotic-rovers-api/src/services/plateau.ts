import { faker } from '@faker-js/faker';
import { Plateau } from '../entities/Plateau';
import { mainDataSource } from '../data-source';
import { RoboticRover } from '../entities/RoboticRover';

function generateName() {
  const planetPrefix = faker.science.chemicalElement().symbol;
  const adjective = faker.word.adjective();
  const geographicalFeature = faker.location.cardinalDirection();

  return `${planetPrefix}-${adjective.charAt(0).toUpperCase() + adjective.slice(1)} ${geographicalFeature} Plateau`;
}

export const create = async (xWidth: number, yHeight: number): Promise<Plateau> => {
  const plateauRepository = mainDataSource.getRepository(Plateau);

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
    const plateauRepository = entityManager.getRepository(Plateau);
    const roverRepository = entityManager.getRepository(RoboticRover);

    const parentPlateau = await entityManager.withRepository(plateauRepository).findOneBy({
      id: plateauId,
    });

    if (!parentPlateau) {
      return null;
    }

    const childRovers = await entityManager.withRepository(roverRepository).findBy({
      plateau: parentPlateau,
    });

    if (childRovers.length > 0) {
      await entityManager.withRepository(roverRepository).softRemove(childRovers);
    }

    return entityManager.withRepository(plateauRepository).softRemove(parentPlateau);
  });
};

export const listAll = async () => {
  return mainDataSource.getRepository(Plateau).find();
};
