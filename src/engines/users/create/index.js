import elasticsearch from 'elasticsearch';

import ValidationError from '../../../validators/errors/validation-error';
import validate from '../../../validators/users/create';

const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

function create(req) {
  const validationResults = validate(req);
  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }
  return client
    .index({
      index: process.env.ELASTICSEARCH_INDEX,
      type: 'user',
      body: req.body,
    })
    .then((res) => res._id)
    .catch(() => Promise.reject(new Error('Internal Server Error')));
}

export default create;
