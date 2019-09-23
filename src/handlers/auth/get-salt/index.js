import getSalt from '../../../engines/auth/get-salt';

function get(req, res) {
  return getSalt(req)
    .then((result) => {
      res.status(200);
      res.set('Content-Type', 'text/plain');
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      res.set('Content-Type', 'application/json');
      res.json({ message: 'Internal Server Error' });
      return err;
    });
}

export default get;
