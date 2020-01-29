const { readFileSync, existsSync, statSync } = require('fs');
const mimeType = require('./lib/lookUp');
const App = require('./app');
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

const servePage = function(req, res, next) {
  if (!isFilePresent(absUrl(req.url))) {
    return next();
  }
  const { contentType } = getContentType(req.url);
  const content = readFileSync(absUrl(req.url));
  res.setHeader('Content-Type', contentType);
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

const app = new App();

app.get('/GuestBook.html', serveGuestPage);
app.post('/GuestBook.html', serveGuestPagePost);
app.get('', servePage);
app.get('/', serveHomePage);
app.get('', serverDefaultPage);

app.post('', serverDefaultPage);

app.use(methodNotFound);

module.exports = app;
