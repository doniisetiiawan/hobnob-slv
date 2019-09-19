import "@babel/polyfill";
const http = require('http');
const requestHandler = function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello, World!');
};
const server = http.createServer(requestHandler);
server.listen(8080);
