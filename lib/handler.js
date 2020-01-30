const App = require('./app');

const {
  serveGuestPage,
  serveGuestPagePost,
  servePage,
  serverDefaultPage,
  methodNotFound
} = require('./responsePages');

const app = new App();

app.get('/GuestBook.html', serveGuestPage);
app.post('/GuestBook.html', serveGuestPagePost);
app.get('', servePage);

app.use(serverDefaultPage);
app.use(methodNotFound);

module.exports = app;
