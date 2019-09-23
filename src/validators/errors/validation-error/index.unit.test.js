import assert from 'assert';
import ValidationError from './index';

describe('ValidationError', () => {
  it('should be a subclass of Error', () => {
    const validationError = new ValidationError();
    assert.equal(validationError instanceof Error, true);
  });
  describe('constructor', () => {
    it('should make the constructor parameter accessible via the `message` property of the instance', () => {
      const TEST_ERROR = 'TEST_ERROR';
      const validationError = new ValidationError(TEST_ERROR);
      assert.equal(validationError.message, TEST_ERROR);
    });
  });
});
