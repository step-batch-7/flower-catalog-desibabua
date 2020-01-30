const App = require('./app');

const {
  serveGuestPagePost,
  serveGuestPage,
  readBody,
  servePage,
  serverDefaultPage,
  methodNotFound
} = require('./responsePages');

const app = new App();

app.use(readBody);
app.get('/GuestBook.html', serveGuestPage);
app.get('', servePage);
app.post('/GuestBook.html', serveGuestPagePost);

app.use(serverDefaultPage);
app.use(methodNotFound);

module.exports = app;
