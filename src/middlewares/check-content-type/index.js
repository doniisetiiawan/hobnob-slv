function checkContentType(req, res, next) {
  if (
    ['POST', 'PATCH', 'PUT'].includes(req.method)
    && req.headers['content-length'] !== '0'
  ) {
    if (!req.headers['content-type']) {
      res.status(400);
      res.set('Content-Type', 'application/json');
      res.json({
        message:
          'The "Content-Type" header must be set for POST, PATCH, and PUT requests with a non-empty payload.',
      });
      return;
    }
    if (req.headers['content-type'] !== 'application/json') {
      res.status(415);
      res.set('Content-Type', 'application/json');
      res.json({
        message:
          'The "Content-Type" header must always be "application/json"',
      });
      return;
    }
  }
  next();
}

export default checkContentType;
