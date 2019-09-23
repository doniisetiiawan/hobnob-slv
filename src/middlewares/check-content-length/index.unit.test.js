import assert from 'assert';
import deepClone from 'lodash.clonedeep';
import deepEqual from 'lodash.isequal';
import { spy } from 'sinon';
import checkContentLength from './index';

describe('checkContentLength', () => {
  describe('When req.method is not one of POST, PATCH or PUT', () => {
    const req = { method: 'GET' };
    const res = {};
    const next = spy();
    const clonedRes = deepClone(res);
    checkContentLength(req, res, next);

    it('should not modify res', () => {
      assert(deepEqual(res, clonedRes));
    });

    it('should call next()', () => {
      assert(next.calledOnce);
    });
  });

  ['POST', 'PATCH', 'PUT'].forEach((method) => {
    describe(`When req.method is ${method} and the content-length header is 0`, () => {
      const req = {
        method,
        headers: {
          'content-length': '0',
        },
      };
      const res = {
        status: spy(),
        set: spy(),
        json: spy(),
      };
      const next = spy();
      checkContentLength(req, res, next);

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
            message: 'Payload should not be empty',
          }),
        );
      });
    });
  });
});
