const App = require('./app');

const {
  serveHomePage,
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
app.get('/', serveHomePage);
app.get('', serverDefaultPage);

app.post('', serverDefaultPage);

app.use(methodNotFound);

module.exports = app;
