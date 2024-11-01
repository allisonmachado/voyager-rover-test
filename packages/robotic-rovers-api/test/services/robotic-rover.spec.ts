import * as robotService from '../../src/services/robotic-rover';
import { mainDataSource } from '../../src/data-source';
import { Repository } from 'typeorm';

import { expect } from '@hapi/code';
import sinon from 'sinon';

describe('Robotic Rover Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('create()', () => {
    it('should create a robotic rover with a valid name, xCurrentPosition, yCurrentPosition, and orientation', async () => {
      const existingRovers = [];
      const fakeParentPlateau = {
        id: 1,
        xWidth: 10,
        yHeight: 5,
      };
      // stub the repositories
      const plateauRepositoryStub = sinon.createStubInstance(Repository);
      const roverRepositoryStub = sinon.createStubInstance(Repository);
      plateauRepositoryStub.findOneByOrFail.resolves(fakeParentPlateau);
      roverRepositoryStub.find.resolves(existingRovers);
      roverRepositoryStub.create.returns({ id: 1 });
      roverRepositoryStub.save.resolves({ id: 1 });

      // prepare transaction environment
      const entityManager = {
        getRepository: sinon.stub(),
        withRepository: sinon.stub(),
      };
      entityManager.getRepository.returns(null);
      entityManager.withRepository.onFirstCall().returns(plateauRepositoryStub);
      entityManager.withRepository.onSecondCall().returns(roverRepositoryStub);
      sinon.stub(mainDataSource, 'transaction').yields(entityManager);

      // prepare test data and execute the test
      const result = await robotService.create({
        plateauId: 1,
        initialPosition: {
          x: 5,
          y: 3,
        },
        orientation: 'S',
      });

      expect(result).to.equal({ id: 1 });
      expect(
        roverRepositoryStub.create.calledWithMatch({
          xCurrentPosition: 5,
          yCurrentPosition: 3,
          orientation: 'S',
        }),
      ).to.be.true();
    });

    it('should throw an error if the initial position is out of bounds', async () => {
      const fakeParentPlateau = {
        id: 1,
        xWidth: 10,
        yHeight: 5,
      };
      // stub the repositories
      const plateauRepositoryStub = sinon.createStubInstance(Repository);
      plateauRepositoryStub.findOneByOrFail.resolves(fakeParentPlateau);

      // prepare transaction environment
      const entityManager = {
        getRepository: sinon.stub(),
        withRepository: sinon.stub(),
      };
      entityManager.getRepository.returns(null);
      entityManager.withRepository.onFirstCall().returns(plateauRepositoryStub);
      sinon.stub(mainDataSource, 'transaction').yields(entityManager);

      // prepare test data and execute the test
      expect(
        robotService.create({
          plateauId: 1,
          initialPosition: {
            x: 10,
            y: 5,
          },
          orientation: 'S',
        }),
      ).to.reject(Error, 'Initial position is out of bounds');
    });

    it('should throw an error if the initial position is occupied by another rover', async () => {
      const existingRovers = [
        {
          xCurrentPosition: 5,
          yCurrentPosition: 3,
        },
      ];
      const fakeParentPlateau = {
        id: 1,
        xWidth: 10,
        yHeight: 5,
      };
      // stub the repositories
      const plateauRepositoryStub = sinon.createStubInstance(Repository);
      const roverRepositoryStub = sinon.createStubInstance(Repository);
      plateauRepositoryStub.findOneByOrFail.resolves(fakeParentPlateau);
      roverRepositoryStub.find.resolves(existingRovers);

      // prepare transaction environment
      const entityManager = {
        getRepository: sinon.stub(),
        withRepository: sinon.stub(),
      };
      entityManager.getRepository.returns(null);
      entityManager.withRepository.onFirstCall().returns(plateauRepositoryStub);
      entityManager.withRepository.onSecondCall().returns(roverRepositoryStub);
      sinon.stub(mainDataSource, 'transaction').yields(entityManager);

      // prepare test data and execute the test
      expect(
        robotService.create({
          plateauId: 1,
          initialPosition: {
            x: 5,
            y: 3,
          },
          orientation: 'S',
        }),
      ).to.reject(Error, 'Initial position is occupied by another rover');
    });
  });

  describe('remove()', () => {
    it('should remove a rover by id', async () => {
      // stub the repositories
      const roverRepositoryStub = sinon.createStubInstance(Repository);
      roverRepositoryStub.softDelete.resolves();
      sinon.stub(mainDataSource, 'getRepository').returns(roverRepositoryStub);

      // prepare test data and execute the test
      const roverId = 1;
      await robotService.remove(roverId);

      expect(
        roverRepositoryStub.softDelete.calledOnceWith({
          id: roverId,
        }),
      ).to.be.true();
    });
  });

  describe('listAllFromPlateau()', () => {
    it('should list all rovers from a plateau', async () => {
      const fakeRovers = [{ id: 1 }, { id: 2 }];
      // stub the repositories
      const roverRepositoryStub = sinon.createStubInstance(Repository);
      roverRepositoryStub.find.resolves(fakeRovers);
      sinon.stub(mainDataSource, 'getRepository').returns(roverRepositoryStub);

      // prepare test data and execute the test
      const plateauId = 1;
      const result = await robotService.listAllFromPlateau(plateauId);

      expect(result).to.equal(fakeRovers);
      expect(
        roverRepositoryStub.find.calledOnceWith({
          where: {
            plateau: {
              id: plateauId,
            },
          },
        }),
      ).to.be.true();
    });
  });

  describe('move()', () => {
    it('should move a rover with M move instruction', async () => {
      const fakeRover = {
        id: 1,
        xCurrentPosition: 5,
        yCurrentPosition: 3,
        orientation: 'S',
        plateau: {
          xWidth: 20,
          yHeight: 10,
        },
      };
      // stub the repositories
      const roverRepositoryStub = sinon.createStubInstance(Repository);
      const moveInstructionRepositoryStub = sinon.createStubInstance(Repository);
      roverRepositoryStub.findOneOrFail.resolves(fakeRover);
      roverRepositoryStub.find.resolves([]);
      roverRepositoryStub.save.resolves();
      moveInstructionRepositoryStub.save.resolves();

      // prepare transaction environment
      const entityManager = {
        getRepository: sinon.stub(),
        withRepository: sinon.stub(),
      };
      entityManager.getRepository.returns(null);
      entityManager.withRepository.onFirstCall().returns(roverRepositoryStub);
      entityManager.withRepository.onSecondCall().returns(moveInstructionRepositoryStub);
      sinon.stub(mainDataSource, 'transaction').yields(entityManager);

      // prepare test data and execute the test
      const result = await robotService.move({
        roverId: 1,
        instructions: ['M'],
      });

      const expectedResult = {
        appliedMoves: [
          {
            instruction: 'M',
            position: {
              x: 5,
              y: 2,
            },
            orientation: 'S',
          },
        ],
        updatedRover: {
          id: 1,
          xCurrentPosition: 5,
          yCurrentPosition: 2,
          orientation: 'S',
          plateau: { xWidth: 20, yHeight: 10 },
        },
      };

      // @ts-ignore``
      expect(result).to.equal(expectedResult);
    });

    it('should move a rover with R move instruction', async () => {
      const fakeRover = {
        id: 1,
        xCurrentPosition: 5,
        yCurrentPosition: 3,
        orientation: 'S',
        plateau: {
          xWidth: 20,
          yHeight: 10,
        },
      };
      // stub the repositories
      const roverRepositoryStub = sinon.createStubInstance(Repository);
      const moveInstructionRepositoryStub = sinon.createStubInstance(Repository);
      roverRepositoryStub.findOneOrFail.resolves(fakeRover);
      roverRepositoryStub.find.resolves([]);
      roverRepositoryStub.save.resolves();
      moveInstructionRepositoryStub.save.resolves();

      // prepare transaction environment
      const entityManager = {
        getRepository: sinon.stub(),
        withRepository: sinon.stub(),
      };
      entityManager.getRepository.returns(null);
      entityManager.withRepository.onFirstCall().returns(roverRepositoryStub);
      entityManager.withRepository.onSecondCall().returns(moveInstructionRepositoryStub);
      sinon.stub(mainDataSource, 'transaction').yields(entityManager);

      // prepare test data and execute the test
      const result = await robotService.move({
        roverId: 1,
        instructions: ['R'],
      });

      const expectedResult = {
        appliedMoves: [
          {
            instruction: 'R',
            position: {
              x: 5,
              y: 3,
            },
            orientation: 'W',
          },
        ],
        updatedRover: {
          id: 1,
          xCurrentPosition: 5,
          yCurrentPosition: 3,
          orientation: 'W',
          plateau: { xWidth: 20, yHeight: 10 },
        },
      };

      // @ts-ignore``
      expect(result).to.equal(expectedResult);
    });

    it('should move a rover with L move instruction', async () => {
      const fakeRover = {
        id: 1,
        xCurrentPosition: 5,
        yCurrentPosition: 3,
        orientation: 'S',
        plateau: {
          xWidth: 20,
          yHeight: 10,
        },
      };
      // stub the repositories
      const roverRepositoryStub = sinon.createStubInstance(Repository);
      const moveInstructionRepositoryStub = sinon.createStubInstance(Repository);
      roverRepositoryStub.findOneOrFail.resolves(fakeRover);
      roverRepositoryStub.find.resolves([]);
      roverRepositoryStub.save.resolves();
      moveInstructionRepositoryStub.save.resolves();

      // prepare transaction environment
      const entityManager = {
        getRepository: sinon.stub(),
        withRepository: sinon.stub(),
      };
      entityManager.getRepository.returns(null);
      entityManager.withRepository.onFirstCall().returns(roverRepositoryStub);
      entityManager.withRepository.onSecondCall().returns(moveInstructionRepositoryStub);
      sinon.stub(mainDataSource, 'transaction').yields(entityManager);

      // prepare test data and execute the test
      const result = await robotService.move({
        roverId: 1,
        instructions: ['L'],
      });

      const expectedResult = {
        appliedMoves: [
          {
            instruction: 'L',
            position: {
              x: 5,
              y: 3,
            },
            orientation: 'E',
          },
        ],
        updatedRover: {
          id: 1,
          xCurrentPosition: 5,
          yCurrentPosition: 3,
          orientation: 'E',
          plateau: { xWidth: 20, yHeight: 10 },
        },
      };

      // @ts-ignore``
      expect(result).to.equal(expectedResult);
    });
  });
});
