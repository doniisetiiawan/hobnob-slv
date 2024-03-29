import assert from 'assert';
import generateValidateStubs, {
  VALIDATION_ERROR,
} from '../../../tests/stubs/validate';
import generateESClientUpdateStub from '../../../tests/stubs/elasticsearch/client/update';
import update from '.';

const USER_ID = 'USER_ID';
const req = {
  body: {},
  params: {
    userId: USER_ID,
  },
};

describe('Engine - Profile - Update', () => {
  describe('When invoked', () => {
    before(function () {
      this.validateStubs = generateValidateStubs();
      this.revert = update.__set__('validate', this.validateStubs.invalid);
      return update(req).catch(() => undefined);
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
      this.revert = update.__set__('validate', validateStubs.invalid);
      return update(req).catch((err) => (this.error = err));
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
      this.revertValidate = update.__set__(
        'validate',
        validateStubs.valid,
      );
    });
    afterEach(function () {
      this.revertValidate();
    });
    describe('Continues execution', () => {
      beforeEach(function () {
        this.ESClientUpdateStub = generateESClientUpdateStub.success();
        this.revertESClient = update.__set__('client', {
          update: this.ESClientUpdateStub,
        });
        return update(req)
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
      it('should call client.update with the correct argument', function () {
        const expectedArgument = {
          index: process.env.ELASTICSEARCH_INDEX,
          type: 'user',
          id: USER_ID,
          body: {
            doc: {
              profile: {},
            },
          },
        };
        assert.equal(this.ESClientUpdateStub.calledOnce, true);
        assert.deepEqual(
          this.ESClientUpdateStub.getCall(0).args[0],
          expectedArgument,
        );
      });
    });
    describe('When the client.update operation is successful', () => {
      beforeEach(function () {
        this.ESClientUpdateStub = generateESClientUpdateStub.success();
        this.revertESClient = update.__set__('client', {
          update: this.ESClientUpdateStub,
        });
        return update(req)
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
      it('should return with a promise that resolves to undefined', function () {
        assert.equal(this.result, undefined);
        assert.equal(this.error, undefined);
      });
    });
    describe('When the user does not exists', () => {
      beforeEach(function () {
        this.ESClientUpdateStub = generateESClientUpdateStub.notFound();
        this.revertESClient = update.__set__('client', {
          update: this.ESClientUpdateStub,
        });
        return update(req)
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
      it("should return with a promise that rejects with an Error object that has the mesage 'Not Found'", function () {
        assert.equal(this.result, undefined);
        assert.equal(this.error instanceof Error, true);
        assert.equal(this.error.message, 'Not Found');
      });
    });
    describe('When the client.update operation is otherwise unsuccessful', () => {
      beforeEach(function () {
        this.ESClientUpdateStub = generateESClientUpdateStub.failure();
        this.revertESClient = update.__set__('client', {
          update: this.ESClientUpdateStub,
        });
        return update(req)
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
