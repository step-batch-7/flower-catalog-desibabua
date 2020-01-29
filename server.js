const { Server } = require('http');
const handleConnection = require('./handler');

const main = function(port = 4000) {
  const server = new Server(handleConnection);
  server.listen(port);
};

main(process.argv[2]);
