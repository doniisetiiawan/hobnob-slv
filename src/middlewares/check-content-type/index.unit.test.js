import assert from 'assert';
import deepClone from 'lodash.clonedeep';
import deepEqual from 'lodash.isequal';
import { spy } from 'sinon';
import checkContentType from './index';

describe('checkContentType', () => {
  describe('When req.method is not one of POST, PATCH or PUT', () => {
    const req = { method: 'GET' };
    const res = {};
    const next = spy();
    const clonedRes = deepClone(res);
    checkContentType(req, res, next);

    it('should not modify res', () => {
      assert(deepEqual(res, clonedRes));
    });

    it('should call next()', () => {
      assert(next.calledOnce);
    });
  });

  ['POST', 'PATCH', 'PUT'].forEach((method) => {
    describe(`When req.method is ${method} but the content-length header is 0`, () => {
      const req = {
        method,
        headers: {
          'content-length': '0',
        },
      };
      const res = {};
      const next = spy();
      const clonedRes = deepClone(res);
      checkContentType(req, res, next);

      it('should not modify res', () => {
        assert(deepEqual(res, clonedRes));
      });

      it('should call next()', () => {
        assert(next.calledOnce);
      });
    });
  });

  ['POST', 'PATCH', 'PUT'].forEach((method) => {
    describe(`When req.method is ${method} but request has no content-type header set`, () => {
      const req = {
        method,
        headers: {
          'content-length': '1',
        },
      };
      const res = {
        status: spy(),
        set: spy(),
        json: spy(),
      };
      const next = spy();
      checkContentType(req, res, next);

      it('should set res with a 400 status code', () => {
        assert(res.status.calledOnce);
        assert(res.status.calledWithExactly(400));
      });

      it('should set res with an application/json content-type header', () => {
        assert(res.set.calledOnce);
        assert(
          res.set.calledWithExactly('Content-Type', 'application/json'),
        );
      });

      it('should set res.json with error code', () => {
        assert(res.json.calledOnce);
        assert(
          res.json.calledWithExactly({
            message:
              'The "Content-Type" header must be set for POST, PATCH, and PUT requests with a non-empty payload.',
          }),
        );
      });
    });
  });
  ['POST', 'PATCH', 'PUT'].forEach((method) => {
    describe(`When req.method is ${method} but the content-type header is not application/json`, () => {
      const req = {
        method,
        headers: {
          'content-length': '1',
          'content-type': 'application/xml',
        },
      };
      const res = {
        status: spy(),
        set: spy(),
        json: spy(),
      };
      const next = spy();
      checkContentType(req, res, next);

      it('should set res with a 415 status code', () => {
        assert(res.status.calledOnce);
        assert(res.status.calledWithExactly(415));
      });

      it('should set res with an application/json content-type header', () => {
        assert(res.set.calledOnce);
        assert(
          res.set.calledWithExactly('Content-Type', 'application/json'),
        );
      });

      it('should set res.json with error code', () => {
        assert(res.json.calledOnce);
        assert(
          res.json.calledWithExactly({
            message:
              'The "Content-Type" header must always be "application/json"',
          }),
        );
      });
    });
  });
  ['POST', 'PATCH', 'PUT'].forEach((method) => {
    describe(`When req.method is ${method} and the content-type header is application/json`, () => {
      const req = {
        method,
        headers: {
          'content-length': '1',
          'content-type': 'application/json',
        },
      };
      const res = {
        status: spy(),
        set: spy(),
        json: spy(),
      };
      const next = spy();
      const clonedRes = deepClone(res);
      checkContentType(req, res, next);

      it('should not modify res', () => {
        assert(deepEqual(res, clonedRes));
      });

      it('should call next()', () => {
        assert(next.calledOnce);
      });
    });
  });
});
