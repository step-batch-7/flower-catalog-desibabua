const { readFileSync } = require('fs');
const { saveComment, loadComments } = require('../public/js/comment');
const getMimeType = require('./mimeTypes');
const { absUrl, isFilePresent } = require('./utils');

const serveHomePage = function(req, res) {
  const url = '/index.html';
  const mimeType = getMimeType(url);
  const content = readFileSync(absUrl(url));
  res.setHeader('Content-Type', mimeType);
  res.write(content);
};

const servePage = function(req, res, next) {
  if (!isFilePresent(absUrl(req.url))) {
    return next();
  }
  const mimeType = getMimeType(req.url);
  const content = readFileSync(absUrl(req.url));
  res.setHeader('Content-Type', mimeType);
  res.write(content);
};

const serveGuestPagePost = function(req, res) {
  let comment = '';
  req.on('data', chunk => {
    comment += chunk;
  });
  req.on('end', () => {
    saveComment(comment);
  });
  res.statusCode = 303;
  res.setHeader('location', '/GuestBook.html');
};

const serveGuestPage = function(req, res) {
  const mimeType = getMimeType(req.url);
  let content = readFileSync(absUrl(req.url), 'utf8');
  content = content.replace(/__comments__/g, loadComments());
  res.setHeader('Content-Type', mimeType);
  res.write(content);
};

const serverDefaultPage = function(req, res) {
  res.write('<h1>file Not found</h1>');
};

const methodNotFound = function(req, res) {
  res.write('<h1>method is not legal</h1>');
};

module.exports = {
  serveHomePage,
  serveGuestPage,
  serveGuestPagePost,
  servePage,
  serverDefaultPage,
  methodNotFound
};
