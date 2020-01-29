const { Server } = require('http');
const app = require('./lib/handler');

const main = function(port = 4000) {
  const server = new Server(app.serve.bind(app));
  server.listen(port);
};

main(process.argv[2]);
