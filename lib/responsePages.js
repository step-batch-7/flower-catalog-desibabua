const { writeFileSync, readFileSync } = require('fs');
const querystring = require('querystring');
const getMimeType = require('./mimeTypes');
const { absUrl, tempFolderUrl, isFilePresent } = require('./utils');
const { Comment, Comments } = require('./comment');

const comments = Comments.load(require('../dataBase/commentHistory.json'));
const COMMENT_STORE = `${__dirname}/../dataBase/commentHistory.json`;

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
  const comment = new Comment(req.body.name, req.body.comment, new Date());
  comments.add(comment);
  writeFileSync(COMMENT_STORE, JSON.stringify(comments.comments, null, 2));
  res.statusCode = 303;
  res.setHeader('location', 'GuestBook.html');
  res.end();
};

const readBody = function(req, res, next) {
  let comment = '';
  req.on('data', chunk => {
    comment += chunk;
  });
  req.on('end', () => {
    req.body = comment;
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      req.body = querystring.parse(req.body);
    }
    next();
  });
};

const serveGuestPage = function(req, res) {
  const mimeType = getMimeType(req.url);
  let content = readFileSync(tempFolderUrl(req.url), 'utf8');
  content = content.replace(/__comments__/, comments.toHTML());
  res.setHeader('Content-Type', mimeType);
  res.write(content);
  res.end();
};

const serverDefaultPage = function(req, res) {
  res.writeHead(404, 'file Not found');
  res.end();
};

const methodNotFound = function(req, res) {
  res.writeHead(404, 'method is not legal');
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
