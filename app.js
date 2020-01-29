const { readFileSync, existsSync, statSync } = require('fs');
const lookUp = require('./lib/lookUp');
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
    '/': '/index.html'
  };
  const fileName = lookUpForFile[url] ? lookUpForFile[url] : url;
  const { urlDir } = getContentType(url);
  const absUrl = `${SERVING_DIR}/${urlDir}${fileName}`;
  return absUrl;
};

const servePage = function(req, res) {
  if (!isFilePresent(absUrl(req.url))) return serverDefaultPage(req, res);
  const { contentType } = getContentType(req.url);
  const content = readFileSync(absUrl(req.url));
  res.setHeader('Content-Type', contentType);
  res.write(content);
  res.end();
};

const serveGuestPagePost = function(req, res) {
  let comment = '';
  req.on('data', chunk => (comment += chunk));
  req.on('end', () => {
    saveComment(comment);
  });
  res.statusCode = 303;
  res.setHeader('location', '/GuestBook.html');
  res.end();
};

const serveGuestPage = function(req, res) {
  const { contentType } = getContentType(req.url);
  let content = readFileSync(absUrl(req.url), 'utf8');
  content = content.replace(/__comments__/g, loadComments());
  res.setHeader('Content-Type', contentType);
  res.write(content);
  res.end();
};

const serverDefaultPage = function(req, res) {
  res.write('<h1>file Not found</h1>');
  res.end();
};

const isFilePresent = function(path) {
  const stat = existsSync(path) && statSync(path).isFile();
  return stat;
};

const methodNotFound = function(req, res) {
  res.write('<h1>method is not legal</h1>');
  res.end();
};

const getHandler = {
  '/GuestBook.html': serveGuestPage,
  default: servePage
};

const postHandler = {
  '/GuestBook.html': serveGuestPagePost
};

const methods = {
  GET: getHandler,
  Post: postHandler,
  default: { default: methodNotFound }
};

const findHandler = req => {
  const method = methods[req.method] || methods.default;
  const handler = method[req.url] || method.default;
  return handler;
};

module.exports = findHandler;
