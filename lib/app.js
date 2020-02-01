class App {
  constructor() {
    this.routes = [];
  }

  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }

  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }

  use(mediator) {
    this.routes.push({ handler: mediator });
  }

  serve(req, res) {
    const matchingRoutes = this.routes.filter(route => matchRoute(route, req));
    const next = function() {
      const route = matchingRoutes.shift();
      route.handler(req, res, next);
    };
    next();
  }
}

const matchRoute = function(route, req) {
  if (route.method) {
    return route.method === req.method && req.url.match(route.path);
  }
  return true;
};

module.exports = App;
