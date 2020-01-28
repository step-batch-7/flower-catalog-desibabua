const { Server } = require('net');
const Request = require('./lib/request');
const findHandler = require('./app');

const handleConnection = function(socket) {
  socket.setEncoding('utf8');
  const remote = `${socket.remoteAddress} : ${socket.remotePort}`;
  console.error(`connection established with ${remote}`);
  socket.on('data', data => {
    const req = Request.parse(data);
    const handler = findHandler(req);
    const res = handler(req);
    res.writeTo(socket);
  });
  socket.on('error', e => console.error(`error happened in socket ${e}`));
  socket.on('end', () => console.error(`socket ended ${remote}`));
  socket.on('close', () => console.error(`socket closed ${remote}`));
};

const main = function() {
  const server = new Server();

  server.on('listening', () =>
    console.error(`started listening`, server.address())
  );

  server.on('close', () => console.error('server closed'));
  server.on('error', e => console.error(`error happened in server`, e));

  server.on('connection', handleConnection);
  server.listen(4000);
};

main();
