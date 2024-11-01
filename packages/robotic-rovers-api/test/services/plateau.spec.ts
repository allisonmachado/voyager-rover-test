import * as plateauService from '../../src/services/plateau';
import { mainDataSource } from '../../src/data-source';
import { Repository } from 'typeorm';

import { expect } from '@hapi/code';
import sinon from 'sinon';

describe('Plateau Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('create()', () => {
    it('should create a plateau with a valid name, xWidth, and yHeight', async () => {
      const xWidth = 10;
      const yHeight = 5;
      const plateau = { id: 1, name: 'H-Sunny South Plateau', xWidth, yHeight };

      const plateauRepositoryStub = sinon.createStubInstance(Repository);
      sinon.stub(mainDataSource, 'getRepository').returns(plateauRepositoryStub);
      plateauRepositoryStub.create.returns(plateau);

      const result = await plateauService.create(xWidth, yHeight);

      expect(result).to.equal(plateau);
      expect(
        plateauRepositoryStub.create.calledWithMatch({
          xWidth,
          yHeight,
        }),
      ).to.be.true();
      expect(plateauRepositoryStub.save.calledOnceWith(plateau)).to.be.true();
    });

    it('should throw an error if the plateau aspect ratio is less than 2:1', async () => {
      const xWidth = 5;
      const yHeight = 5;

      expect(plateauService.create(xWidth, yHeight)).to.reject(
        Error,
        'Plateau aspect ratio must be at least 2:1 (width:height)',
      );
    });
  });

  describe('remove()', () => {
    it('should remove a plateau and its child rovers', async () => {
      const plateauId = 1;
      const parentPlateau = { id: plateauId };
      const childRovers = [{ id: 1 }, { id: 2 }];

      // stub the repositories
      const plateauRepositoryStub = sinon.createStubInstance(Repository);
      const roverRepositoryStub = sinon.createStubInstance(Repository);
      plateauRepositoryStub.findOneBy.resolves(parentPlateau);
      roverRepositoryStub.findBy.resolves(childRovers);

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
      await plateauService.remove(plateauId);

      expect(roverRepositoryStub.softRemove.calledOnceWith(childRovers)).to.be.true();
      expect(plateauRepositoryStub.softRemove.calledOnceWith(parentPlateau)).to.be.true();
    });

    it('should return null if the plateau does not exist', async () => {
      const plateauId = 1;

      const entityManager = {
        getRepository: sinon.stub(),
        withRepository: sinon.stub(),
      };

      const plateauRepositoryStub = sinon.createStubInstance(Repository);
      plateauRepositoryStub.findOneBy.resolves(null);

      entityManager.getRepository.returns(null);
      entityManager.withRepository.returns(plateauRepositoryStub);

      sinon.stub(mainDataSource, 'transaction').yields(entityManager);

      const result = await plateauService.remove(plateauId);

      expect(result).to.be.null();
    });
  });

  describe('listAll()', () => {
    it('should return all plateaus', async () => {
      const plateaus = [{ id: 1 }, { id: 2 }];

      const plateauRepositoryStub = sinon.createStubInstance(Repository);
      plateauRepositoryStub.find.resolves(plateaus);

      sinon.stub(mainDataSource, 'getRepository').returns(plateauRepositoryStub);

      const result = await plateauService.listAll();

      expect(result).to.equal(plateaus);
    });
  });

  describe('find()', () => {
    it('should return a plateau by ID', async () => {
      const plateauId = 1;
      const plateau = { id: plateauId };

      const plateauRepositoryStub = sinon.createStubInstance(Repository);
      plateauRepositoryStub.findOneBy.resolves(plateau);

      sinon.stub(mainDataSource, 'getRepository').returns(plateauRepositoryStub);

      const result = await plateauService.find(plateauId);

      expect(result).to.equal(plateau);
      expect(plateauRepositoryStub.findOneBy.calledOnceWith({ id: plateauId })).to.be.true();
    });
  });
});
