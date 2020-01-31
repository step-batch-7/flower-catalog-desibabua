const request = require('supertest');
const app = require('../lib/handler');

describe('GET /badFile ', function() {
  it('should give index.html', function(done) {
    request(app.serve.bind(app))
      .get('/badFile')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('GET for index.html ', function() {
  it('should give index.html', function(done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('content-type', /html/)
      .expect(/<h1 class="homeHeader">Flower Catalog<\/h1>/, done);
  });
  
  it('should give index.html', function(done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('content-type', /html/)
      .expect(/<h1 class="homeHeader">Flower Catalog<\/h1>/, done);
  });
});
