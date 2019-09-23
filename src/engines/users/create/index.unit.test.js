import assert from 'assert';
import generateValidateStubs, {
  VALIDATION_ERROR,
} from '../../../tests/stubs/validate';
import generateESClientIndexStub from '../../../tests/stubs/elasticsearch/client/index';
import create from '.';

const req = {
  body: {
    email: 'e@ma.il',
    digest: '$2y$10$6.5uPfJUCQlcuLO/SNVX3u1yU6LZv.39qOzshHXJVpaq3tJkTwiAy',
  },
};

describe('Engine - Users - Create', () => {
  describe('When invoked', () => {
    before(function () {
      this.validateStubs = generateValidateStubs();
      this.revert = create.__set__('validate', this.validateStubs.invalid);
      return create(req).catch(() => undefined);
    });
    after(function () {
      this.revert();
    });
    it('should call the validate function once with the request object', function () {
      assert(this.validateStubs.invalid.calledOnce, true);
      assert(this.validateStubs.invalid.calledWithExactly(req), true);
    });
  });
  describe('When the validate function returns false', () => {
    before(function () {
      const validateStubs = generateValidateStubs();
      this.revert = create.__set__('validate', validateStubs.invalid);
      return create(req).catch((err) => (this.error = err));
    });
    after(function () {
      this.revert();
    });
    it('should return with a promise that rejects with a ValidationError', function () {
      assert(this.error, VALIDATION_ERROR);
    });
  });
  describe('When the validate function returns true', () => {
    beforeEach(function () {
      const validateStubs = generateValidateStubs();
      this.revertValidate = create.__set__(
        'validate',
        validateStubs.valid,
      );
    });
    afterEach(function () {
      this.revertValidate();
    });
    describe('Continues execution', () => {
      beforeEach(function () {
        this.ESClientIndexStub = generateESClientIndexStub.success();
        this.revertESClient = create.__set__('client', {
          index: this.ESClientIndexStub,
        });
        return create(req)
          .then((res) => {
            this.result = res;
            this.error = undefined;
          })
          .catch((err) => {
            this.error = err;
            this.result = undefined;
          });
      });
      afterEach(function () {
        this.revertESClient();
      });
      it('should call client.index with the correct argument', function () {
        const expectedArgument = {
          index: process.env.ELASTICSEARCH_INDEX,
          type: 'user',
          body: {
            email: 'e@ma.il',
            digest:
              '$2y$10$6.5uPfJUCQlcuLO/SNVX3u1yU6LZv.39qOzshHXJVpaq3tJkTwiAy',
          },
        };
        assert.equal(this.ESClientIndexStub.calledOnce, true);
        assert.deepEqual(
          this.ESClientIndexStub.getCall(0).args[0],
          expectedArgument,
        );
      });
    });
    describe('When the client.index operation is successful', () => {
      beforeEach(function () {
        this.ESClientIndexStub = generateESClientIndexStub.success();
        this.revertESClient = create.__set__('client', {
          index: this.ESClientIndexStub,
        });
        return create(req)
          .then((res) => {
            this.result = res;
            this.error = undefined;
          })
          .catch((err) => {
            this.error = err;
            this.result = undefined;
          });
      });
      afterEach(function () {
        this.revertESClient();
      });
      it('should return with a promise that resolves to a string representing the ID of the newly-created user', function () {
        assert.equal(typeof this.result, 'string');
        assert.equal(this.error, undefined);
      });
    });
    describe('When the client.index operation is unsuccessful', () => {
      beforeEach(function () {
        this.ESClientIndexStub = generateESClientIndexStub.failure();
        this.revertESClient = create.__set__('client', {
          index: this.ESClientIndexStub,
        });
        return create(req)
          .then((res) => {
            this.result = res;
            this.error = undefined;
          })
          .catch((err) => {
            this.error = err;
            this.result = undefined;
          });
      });
      afterEach(function () {
        this.revertESClient();
      });
      it("should return with a promise that rejects with an Error object that has the mesage 'Internal Server Error'", function () {
        assert.equal(this.result, undefined);
        assert.equal(this.error instanceof Error, true);
        assert.equal(this.error.message, 'Internal Server Error');
      });
    });
  });
});
