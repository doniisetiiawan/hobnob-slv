import assert from 'assert';
import elasticsearch from 'elasticsearch';
import {
  VALIDATION_ERROR,
  VALIDATION_ERROR_MESSAGE,
} from '../../../tests/stubs/validate';
import ValidationError from '../../../validators/errors/validation-error';
import replace from '.';

process.env.ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX_TEST;

const USER_ID = 'vv78YU6';

describe('Engine - Profile - Replace', () => {
  describe('When the request is not valid', () => {
    before(function () {
      const req = {};
      return replace(req).catch((err) => {
        this.error = err;
      });
    });
    it('should return with a promise that rejects with the ValidationError', function () {
      assert(this.error instanceof ValidationError, true);
      assert(this.error, VALIDATION_ERROR);
      assert(this.error.message, VALIDATION_ERROR_MESSAGE);
    });
  });
  describe('When the request is valid', () => {
    beforeEach(function () {
      const req = {
        body: {
          summary: 'summary',
        },
        params: {
          userId: USER_ID,
        },
      };
      return replace(req)
        .then((res) => {
          this.result = res;
          this.error = undefined;
        })
        .catch((err) => {
          this.error = err;
          this.result = undefined;
        });
    });
    describe('When the user does not exists', () => {
      it("should return with a promise that rejects with an Error object that has the mesage 'Not Found'", function () {
        assert.equal(this.result, undefined);
        assert.equal(this.error.message, 'Not Found');
      });
    });
    describe('When the user exists', () => {
      const client = new elasticsearch.Client({
        host: `${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
      });
      // Creates a user with _id set to USER_ID
      before(() => client.index({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
        body: {
          profile: {
            summary: 'test',
            bio: 'test',
          },
        },
      }));
      after(() => client.delete({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
      }));
      describe('When the Elasticsearch operation is successful', () => {
        it('should return with a promise that resolves to undefined', function () {
          assert.equal(this.result, undefined);
          assert.equal(this.error, undefined);
        });
        it('should have updated the user profile object', () => client
          .get({
            index: process.env.ELASTICSEARCH_INDEX,
            type: 'user',
            id: USER_ID,
          })
          .then((user) => user._source)
          .then((user) => assert.deepEqual(user, {
            profile: {
              summary: 'summary',
            },
          })));
      });
    });
  });
});
