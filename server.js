const { Server } = require('http');
const handleConnection = require('./handler');

const main = function() {
  const server = new Server(handleConnection);
  server.listen(4000);
};

main();
