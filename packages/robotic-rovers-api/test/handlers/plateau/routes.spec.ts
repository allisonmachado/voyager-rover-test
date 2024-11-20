import sinon from 'sinon';
import * as plateauService from '../../../src/services/plateau';
import { expect } from '@hapi/code';
import { Plateau } from '../../../src/entities/Plateau';
import * as Hapi from '@hapi/hapi';
import plateau from '../../../src/handlers/plateau';

describe('Plateau Request Handler', () => {
  const fakePlateau = new Plateau();
  fakePlateau.id = 1;
  fakePlateau.name = 'Foo';
  fakePlateau.xWidth = 12;
  fakePlateau.yHeight = 6;
  fakePlateau.roboticRovers = null;
  fakePlateau.deletedAt = null;

  const server = Hapi.server();
  server.register(plateau);

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /plateaus', () => {
    describe('handler execution', () => {
      let plateauServiceStub: sinon.SinonStub;

      beforeEach(() => {
        plateauServiceStub = sinon.stub(plateauService, 'create');
      });

      it('should call plateauService.create with correct arguments and return 200', async () => {
        const payload = { width: 10, height: 5 };

        plateauServiceStub.resolves(fakePlateau);

        const response = await server.inject({
          method: 'POST',
          url: '/plateaus',
          payload,
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.equal(fakePlateau);
        sinon.assert.calledOnceWithExactly(plateauServiceStub, 10, 5);
      });

      it('should return 400 if plateauService.create throws a validation error', async () => {
        const payload = { width: 10, height: 5 };
        const validationError = new Error('Plateau aspect ratio must be at least 2:1 (width:height)');

        plateauServiceStub.rejects(validationError);

        const response = await server.inject({
          method: 'POST',
          url: '/plateaus',
          payload,
        });

        expect(response.statusCode).to.equal(400);
        expect(response.result).to.equal({ message: 'Plateau aspect ratio must be at least 2:1 (width:height)' });
        sinon.assert.calledOnceWithExactly(plateauServiceStub, 10, 5);
      });

      const testValidationError = async (payload: any, expectedErrorMessage: string) => {
        const response = await server.inject({
          method: 'POST',
          url: '/plateaus',
          payload,
        });

        expect(response.statusCode).to.equal(400);
        expect(response.result).to.be.an.object().and.contains({
          message: expectedErrorMessage,
        });
        sinon.assert.notCalled(plateauServiceStub);
      };

      it('should return 400 if width is missing', async () => {
        await testValidationError({ height: 5 }, '"width" is required');
      });

      it('should return 400 if height is missing', async () => {
        await testValidationError({ width: 10 }, '"height" is required');
      });

      it('should return 400 if width is less than the minimum', async () => {
        await testValidationError({ width: 4, height: 5 }, '"width" must be greater than or equal to 5');
      });

      it('should return 400 if width is greater than the maximum', async () => {
        await testValidationError({ width: 21, height: 5 }, '"width" must be less than or equal to 20');
      });

      it('should return 400 if height is less than the minimum', async () => {
        await testValidationError({ width: 10, height: 1 }, '"height" must be greater than or equal to 2');
      });

      it('should return 400 if height is greater than the minimum', async () => {
        await testValidationError({ width: 10, height: 111 }, '"height" must be less than or equal to 10');
      });
    });
  });
});
