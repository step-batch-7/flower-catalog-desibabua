const { readFileSync } = require('fs');
const sqlite3 = require('sqlite3');

const querystring = require('querystring');
const getMimeType = require('./mimeTypes');

const { absUrl, tempFolderUrl, isFilePresent } = require('./utils');

const dataBase = new sqlite3.Database('./Database/comments.db', () => console.log('connected to db') );
const schema = `
  create table if not exists comments (
  name varchar(30) not null,
  comment varchar(1000) not null,
  time date not null
)`;

const toHTML = function (comment) {
  const html = `
    <div class="comment">
      <h3>${comment.name}</h3>
      <p>
        ${comment.comment}
      </p>
      <p class="date">${new Date(comment.time).toLocaleString()}</p>
    </div>`;
  return html;
};

const getCommentsPromise = function () {
  return new Promise((resolve, rejects) => {
    const command = 'select * from comments order by time desc;';
    dataBase.all(command, (err, rows) => resolve(rows));
  })
}

const getCommentsAsHtml = function (rows) {
  if (rows)
    return rows.map(toHTML).join('');
  return '';
}

const postComment = function (name, comment, time) {
  const command = `insert into comments(name, comment, time) values('${name}', '${comment}', '${time}');`;
  dataBase.run(command, (err) => {if (err) console.log(`error: ${err}\n`)});
};

const servePage = function (req, res, next) {
  if (req.url === '/') {
    req.url = '/index.html';
  }
  if (!isFilePresent(absUrl(req.url))) {
    return next();
  }
  const mimeType = getMimeType(req.url);
  const content = readFileSync(absUrl(req.url));
  res.setHeader('Content-Type', mimeType);
  res.end(content);
};

const serveGuestPagePost = function (req, res) {
  postComment(req.body.name, req.body.comment, new Date());
  res.statusCode = 303;
  res.setHeader('location', 'GuestBook.html');
  res.end();
};

const readBody = function (req, res, next) {
  let comment = '';
  req.on('data', (chunk) => {
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

const serveGuestPage = function (req, res) {
  const mimeType = getMimeType(req.url);
  let content = readFileSync(tempFolderUrl(req.url), 'utf8');
  dataBase.run(schema);
  
  getCommentsPromise().then((rows) => {
    content = content.replace(/__comments__/, getCommentsAsHtml(rows));
    res.setHeader('Content-Type', mimeType);
    res.end(content);
  })
};

const serverDefaultPage = function (req, res) {
  res.writeHead(404, 'file Not found');
  res.end();
};

const methodNotFound = function (req, res) {
  res.writeHead(404, 'method is not legal');
  res.end();
};

module.exports = {
  serveGuestPagePost,
  serveGuestPage,
  readBody,
  servePage,
  serverDefaultPage,
  methodNotFound,
};
