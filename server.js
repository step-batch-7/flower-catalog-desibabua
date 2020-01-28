const { Server } = require('http');
const findHandler = require('./app');

const handleConnection = function(req, res) {
  console.log('Request: ', req.url, req.method);
  const handler = findHandler(req);
  handler(req, res);
  res.end();
};

const main = function() {
  const server = new Server(handleConnection);
  server.on('close', () => console.error('server closed'));
  server.on('clientError', (e, socket) => socket.end('bad request'));
  server.listen(4000);
};

main();
