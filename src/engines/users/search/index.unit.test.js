import assert from 'assert';
import generateESClientSearchStub from '../../../tests/stubs/elasticsearch/client/search';
import search from '.';

process.env.ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX_TEST;

const SEARCH_TERM = 'SEARCH_TERM';
const requestFactory = {
  empty() {
    return {
      body: {
        query: '',
      },
    };
  },
  nonEmpty() {
    return {
      body: {
        query: SEARCH_TERM,
      },
    };
  },
};

describe('Engine - User - Search', () => {
  describe('When invoked', () => {
    beforeEach(function () {
      this.ESClientSearchStub = generateESClientSearchStub.failure();
      this.revert = search.__set__('client', {
        search: this.ESClientSearchStub,
      });
    });
    afterEach(function () {
      this.revert();
    });
    describe('And the search term is empty', () => {
      beforeEach(function () {
        const req = requestFactory.empty();
        return search(req)
          .then((res) => {
            this.result = res;
            this.error = undefined;
          })
          .catch((err) => {
            this.error = err;
            this.result = undefined;
          });
      });

      it("should call the client instance's search method with the correct params", function () {
        assert.deepEqual(this.ESClientSearchStub.getCall(0).args[0], {
          index: process.env.ELASTICSEARCH_INDEX_TEST,
          type: 'user',
          _sourceExclude: 'digest',
        });
      });
    });
    describe('And the search term is not empty', () => {
      beforeEach(function () {
        const req = requestFactory.nonEmpty();
        return search(req)
          .then((res) => {
            this.result = res;
            this.error = undefined;
          })
          .catch((err) => {
            this.error = err;
            this.result = undefined;
          });
      });
      it("should call the client instance's search method with the correct params", function () {
        assert.deepEqual(this.ESClientSearchStub.getCall(0).args[0], {
          index: process.env.ELASTICSEARCH_INDEX_TEST,
          type: 'user',
          _sourceExclude: 'digest',
          q: SEARCH_TERM,
        });
      });
    });
  });
  describe('When the client.search operation is successful', () => {
    beforeEach(function () {
      this.ESClientSearchStub = generateESClientSearchStub.success();
      this.revert = search.__set__('client', {
        search: this.ESClientSearchStub,
      });
      const req = requestFactory.nonEmpty();
      return search(req)
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
      this.revert();
    });
    it('should return with a promise that resolves to an array of objects', function () {
      assert.equal(Array.isArray(this.result), true);
      assert.equal(this.error, undefined);
    });
  });
  describe('When the client.search operation is unsuccessful', () => {
    beforeEach(function () {
      this.ESClientSearchStub = generateESClientSearchStub.failure();
      this.revert = search.__set__('client', {
        search: this.ESClientSearchStub,
      });
      const req = requestFactory.nonEmpty();
      return search(req)
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
      this.revert();
    });
    it("should return with a promise that rejects with an Error object that has the mesage 'Internal Server Error'", function () {
      assert.equal(this.result, undefined);
      assert.equal(this.error instanceof Error, true);
      assert.equal(this.error.message, 'Internal Server Error');
    });
  });
});
