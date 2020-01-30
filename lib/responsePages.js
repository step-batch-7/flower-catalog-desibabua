const { readFileSync } = require('fs');
const { saveComment, loadComments } = require('../public/js/comment');
const getMimeType = require('./mimeTypes');
const { absUrl, isFilePresent } = require('./utils');

const servePage = function(req, res, next) {
  if (req.url === '/') {
    req.url = '/index.html';
  }
  if (!isFilePresent(absUrl(req.url))) {
    return next();
  }
  const mimeType = getMimeType(req.url);
  const content = readFileSync(absUrl(req.url));
  res.setHeader('Content-Type', mimeType);
  res.write(content);
  res.end();
};

const serveGuestPagePost = function(req, res) {
  saveComment(req.body);
  res.statusCode = 303;
  res.setHeader('location', '/GuestBook.html');
  res.end();
};

const readBody = function(req, res, next) {
  let comment = '';
  req.on('data', chunk => {
    comment += chunk;
  });
  req.on('end', () => {
    req.body = comment;
    next();
  });
};

const serveGuestPage = function(req, res) {
  const mimeType = getMimeType(req.url);
  let content = readFileSync(absUrl(req.url), 'utf8');
  content = content.replace(/__comments__/g, loadComments());
  res.setHeader('Content-Type', mimeType);
  res.write(content);
  res.end();
};

const serverDefaultPage = function(req, res) {
  res.write('<h1>file Not found</h1>');
  res.end();
};

const methodNotFound = function(req, res) {
  res.write('<h1>method is not legal</h1>');
  res.end();
};

module.exports = {
  serveGuestPagePost,
  serveGuestPage,
  readBody,
  servePage,
  serverDefaultPage,
  methodNotFound
};
