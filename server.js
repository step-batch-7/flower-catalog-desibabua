const { Server } = require('net');
const { readFileSync, existsSync, statSync } = require('fs');
const lookUp = require('./lib/lookUp');
const Request = require('./lib/request')
const Response = require('./lib/response')

const getContentType = function(url) {
  const [, urlType] = url.match(/.*\.(.*)$/) || [, '/'];
  const contentType = lookUp[urlType].type;
  return { contentType };
};

const servePage = function(req) {
  const res = new Response();
  res.statusCode = 200;
  const { contentType } = getContentType(req.url);
  const content = readFileSync(req.url);
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', content.length);
  res.body = content;
  return res;
};

const isFilePresent = function(path) {
  const stat = existsSync(path) && statSync(path).isFile();
  return stat;
};

const findHandler = req => {
  if (req.method === 'GET' && isFilePresent(req.url)) return servePage;
  return () => new Response();
};

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
