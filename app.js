const { readFileSync, existsSync, statSync } = require('fs');
const lookUp = require('./lib/lookUp');
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
    '/': '/index.html'
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

const serveGuestPagePost = function(req) {
  saveComment(req.body);
  return serveGuestPage;
};

const serveGuestPage = function(req) {
  const res = new Response();
  res.statusCode = 200;
  const { contentType } = getContentType(req.url);
  const content = readFileSync(absUrl(req.url), 'utf8');
  res.setHeader('Content-Type', contentType);
  res.body = content.replace(/__comments__/g, loadComments());
  res.setHeader('Content-Length', res.body.length);
  return res;
};

const isFilePresent = function(path) {
  const stat = existsSync(path) && statSync(path).isFile();
  return stat;
};

const findHandler = req => {
  if (req.method === 'GET' && req.url == '/GuestBook.html')
    return serveGuestPage;
  if (req.method === 'POST' && req.url == '/GuestBook.html')
    return serveGuestPagePost(req);
  if (req.method === 'GET' && isFilePresent(absUrl(req.url))) return servePage;
  return () => new Response();
};

module.exports = findHandler;
