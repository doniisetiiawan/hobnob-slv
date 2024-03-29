import elasticsearch from 'elasticsearch';

import ValidationError from '../../../validators/errors/validation-error';
import validate from '../../../validators/users/search';

const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

function search(req) {
  const validationResults = validate(req);
  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }
  const query = {
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    _sourceExclude: 'digest',
  };

  if (req.query.query !== '') {
    query.q = req.query.query;
  }

  return client
    .search(query)
    .then((res) => res.hits.hits.map((hit) => hit._source))
    .catch(() => Promise.reject(new Error('Internal Server Error')));
}

export default search;
