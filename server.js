const { Server } = require('http');
const app = require('./lib/handler');

const port = process.env.PORT || 4000;

const main = function() {
  const server = new Server(app.serve.bind(app));
  server.listen(port);
};

main();
