const { readFileSync, existsSync, statSync } = require('fs');
const mimeType = require('./lib/lookUp');
const { saveComment, loadComments } = require('./public/js/comment');

const SERVING_DIR = `${__dirname}/public`;
const absUrl = url => getReqFileName(url);

const getContentType = function(url) {
  const extension = url.split('.').pop();
  const contentType = mimeType[extension];
  return { contentType };
};

const getReqFileName = function(url) {
  const absUrl = `${SERVING_DIR}/${url}`;
  return absUrl;
};

const serveHomePage = function(req, res) {
  const url = '/index.html';
  const { contentType } = getContentType(url);
  const content = readFileSync(absUrl(url));
  res.setHeader('Content-Type', contentType);
  res.write(content);
};

const servePage = function(req, res) {
  if (!isFilePresent(absUrl(req.url))) return serverDefaultPage(req, res);
  const { contentType } = getContentType(req.url);
  const content = readFileSync(absUrl(req.url));
  res.setHeader('Content-Type', contentType);
  res.write(content);
};

const serveGuestPagePost = function(req, res) {
  let comment = '';
  req.on('data', chunk => (comment += chunk));
  req.on('end', () => {
    saveComment(comment);
  });
  res.statusCode = 303;
  res.setHeader('location', '/GuestBook.html');
};

const serveGuestPage = function(req, res) {
  const { contentType } = getContentType(req.url);
  let content = readFileSync(absUrl(req.url), 'utf8');
  content = content.replace(/__comments__/g, loadComments());
  res.setHeader('Content-Type', contentType);
  res.write(content);
};

const serverDefaultPage = function(req, res) {
  res.write('<h1>file Not found</h1>');
};

const isFilePresent = function(path) {
  const stat = existsSync(path) && statSync(path).isFile();
  return stat;
};

const methodNotFound = function(req, res) {
  res.write('<h1>method is not legal</h1>');
};

const getHandler = {
  '/': serveHomePage,
  '/GuestBook.html': serveGuestPage,
  default: servePage
};

const postHandler = {
  '/GuestBook.html': serveGuestPagePost
};

const methods = {
  GET: getHandler,
  POST: postHandler,
  default: { default: methodNotFound }
};

const findHandler = req => {
  const method = methods[req.method] || methods.default;
  const handler = method[req.url] || method.default;
  return handler;
};

const handleConnection = function(req, res) {
  console.log('Request: ', req.url, req.method);
  const handler = findHandler(req);
  handler(req, res);
  res.end();
};

module.exports = handleConnection;
