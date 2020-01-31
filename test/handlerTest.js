const request = require('supertest');
const app = require('../lib/handler');

describe('** GET', function() {
  describe('* for /badFile ', function() {
    it('should give error ', function(done) {
      request(app.serve.bind(app))
        .get('/badFile')
        .set('Accept', '*/*')
        .expect(404, done);
    });
  });

  describe('* for index.html ', function() {
    it('should give index page', function(done) {
      request(app.serve.bind(app))
        .get('/')
        .set('Accept', '*/*')
        .expect(200)
        .expect('content-type', /html/)
        .expect(/<h1 class="homeHeader">Flower Catalog<\/h1>/, done);
    });

    it('should give index page', function(done) {
      request(app.serve.bind(app))
        .get('/')
        .set('Accept', '*/*')
        .expect(200)
        .expect('content-type', /html/)
        .expect(/<h1 class="homeHeader">Flower Catalog<\/h1>/, done);
    });
  });

  describe('* Abeliophyllum.html', function() {
    it('should give Abeliophyllum page', function(done) {
      request(app.serve.bind(app))
        .get('/Abeliophyllum.html')
        .set('Accept', '*/*')
        .expect(200)
        .expect('content-type', /html/)
        .expect(
          /<h1 class="centerHeader"><a href="index.html">&lt;&lt;<\/a> Abeliophyllum<\/h1>/,
          done
        );
    });
  });

  describe('* agerantum.html', function() {
    it('should give agerantum page', function(done) {
      request(app.serve.bind(app))
        .get('/agerantum.html')
        .set('Accept', '*/*')
        .expect(200)
        .expect('content-type', /html/)
        .expect(
          /<h1 class="centerHeader"><a href="index.html">&lt;&lt;<\/a> Agerantum<\/h1>/,
          done
        );
    });
  });

  describe('* GuestBook.html', function() {
    it('should give GuestBook page', function(done) {
      request(app.serve.bind(app))
        .get('/GuestBook.html')
        .set('Accept', '*/*')
        .expect(200)
        .expect('content-type', /html/)
        .expect(
          /<h1 class="centerHeader"><a href="index.html">&lt;&lt;<\/a> GuestBook<\/h1>/,
          done
        );
    });
  });
});
