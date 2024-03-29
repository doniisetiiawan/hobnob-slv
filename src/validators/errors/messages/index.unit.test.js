import assert from 'assert';
import generateHumanFriendlyErrorMessage from './index';

describe('generateHumanFriendlyErrorMessage', () => {
  it('should return the correct string when error.keyword is "required"', () => {
    const errors = [
      {
        keyword: 'required',
        dataPath: '.test.path',
        params: {
          missingProperty: 'property',
        },
      },
    ];
    const actualErrorMessage = generateHumanFriendlyErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path.property' field is missing";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
  it('should return the correct string when error.keyword is "type"', () => {
    const errors = [
      {
        keyword: 'type',
        dataPath: '.test.path',
        params: {
          type: 'string',
        },
      },
    ];
    const actualErrorMessage = generateHumanFriendlyErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path' field must be of type string";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
  it('should return the correct string when error.keyword is "format"', () => {
    const errors = [
      {
        keyword: 'format',
        dataPath: '.test.path',
        params: {
          format: 'email',
        },
      },
    ];
    const actualErrorMessage = generateHumanFriendlyErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path' field must be a valid email";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
  it('should return the correct string when error.keyword is "additionalProperties"', () => {
    const errors = [
      {
        keyword: 'additionalProperties',
        dataPath: '.test.path',
        params: {
          additionalProperty: 'email',
        },
      },
    ];
    const actualErrorMessage = generateHumanFriendlyErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path' object does not support the field 'email'";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
  it('should return the correct string when error.keyword is "pattern"', () => {
    const errors = [
      {
        keyword: 'pattern',
        dataPath: '.test.path',
      },
    ];
    const actualErrorMessage = generateHumanFriendlyErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path' field should be a valid bcrypt digest";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
  it('should prepend a prefix to the beginning of the data path if given', () => {
    // Using the additionalProperties test above as a template
    const errors = [
      {
        keyword: 'additionalProperties',
        dataPath: '.test.path',
        params: {
          additionalProperty: 'email',
        },
      },
    ];
    const TEST_PREFIX = '.test.prefix';
    const actualErrorMessage = generateHumanFriendlyErrorMessage(
      errors,
      TEST_PREFIX,
    );
    const expectedErrorMessage = "The '.test.prefix.test.path' object does not support the field 'email'";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
});
