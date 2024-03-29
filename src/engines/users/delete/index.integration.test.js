import assert from 'assert';
import elasticsearch from 'elasticsearch';
import del from '.';

process.env.ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX_TEST;

const USER_ID = 'TEST_USER_ID';
const USER_OBJ = {
  email: 'e@ma.il',
  digest: '$2y$10$6.5uPfJUCQlcuLO/SNVX3u1yU6LZv.39qOzshHXJVpaq3tJkTwiAy',
};

describe('Engine - User - Retrieve', () => {
  beforeEach(function () {
    const req = {
      params: {
        userId: USER_ID,
      },
    };
    return del(req)
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
      body: USER_OBJ,
    }));
    describe('When the Elasticsearch operation is successful', () => {
      it('should return with a promise that resolves to undefined', function () {
        assert.deepEqual(this.result, undefined);
        assert.equal(this.error, undefined);
      });
      it('should have delete the user', () => client
        .get({
          index: process.env.ELASTICSEARCH_INDEX,
          type: 'user',
          id: USER_ID,
        })
        .then((res) => {
          assert.equal(res, undefined);
        })
        .catch((err) => {
          assert.equal(err.status, 404);
        }));
    });
  });
});
