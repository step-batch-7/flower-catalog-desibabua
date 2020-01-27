const { Server } = require('net');
const { readFileSync, existsSync, statSync } = require('fs');
const lookUp = require('./lib/lookUp');
const Request = require('./lib/request');
const Response = require('./lib/response');
const { saveComment, loadComments } = require('./public/js/comment');

const SERVING_DIR = `${__dirname}/public`;
const absUrl = url => getReqFileName(url);

const getContentType = function(url) {
  const [, urlType] = url.match(/.*\.(.*)$/) || [, '/'];
  const contentType = lookUp[urlType].type;
  const urlDir = lookUp[urlType].dir;
  return { contentType, urlDir };
};

const getReqFileName = function(url) {
  const lookUpForFile = {
    '/': '/index.html',
  };
  const fileName = lookUpForFile[url] ? lookUpForFile[url] : url;
  const { urlDir } = getContentType(url);
  const absUrl = `${SERVING_DIR}/${urlDir}${fileName}`;
  return absUrl;
};

const servePage = function(req) {
  const res = new Response();
  res.statusCode = 200;
  const { contentType } = getContentType(req.url);
  const content = readFileSync(absUrl(req.url));
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', content.length);
  res.body = content;
  return res;
};

const serveGuestPage = function(req) {
  saveComment(req.query);
  loadComments();
  const res = new Response();
  res.statusCode = 200;
  const { contentType } = getContentType(req.url);
  const content = readFileSync(absUrl(req.url), 'utf8');
  res.setHeader('Content-Type', contentType);
  res.body = content.replace(/__comments__/g, loadComments());
  res.setHeader('Content-Length', res.body.length);
  // console.log(res.body);
  return res;
};

const isFilePresent = function(path) {
  const stat = existsSync(path) && statSync(path).isFile();
  return stat;
};

const findHandler = req => {
  if (req.method === 'GET' && req.url == '/GuestBook.html') return serveGuestPage;
  if (req.method === 'GET' && isFilePresent(absUrl(req.url))) return servePage;
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
