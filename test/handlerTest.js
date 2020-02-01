const fs = require('fs');
const request = require('supertest');
const app = require('../lib/handler');
const config = require('../config');

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
    it('should give index page when url is /', function(done) {
      request(app.serve.bind(app))
        .get('/')
        .set('Accept', '*/*')
        .expect(200)
        .expect('content-type', /html/)
        .expect(/<h1 class="homeHeader">Flower Catalog<\/h1>/, done)
        .expect('Content-Length', '837');
    });

    it('should give index page', function(done) {
      request(app.serve.bind(app))
        .get('/')
        .set('Accept', '*/*')
        .expect(200)
        .expect('content-type', /html/)
        .expect(/<h1 class="homeHeader">Flower Catalog<\/h1>/, done)
        .expect('Content-Length', '837');
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
        )
        .expect('Content-Length', '1392');
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
        )
        .expect('Content-Length', '1180');
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

describe('** PUT ', function() {
  it('should give error for method not found', function(done) {
    request(app.serve.bind(app))
      .put('/badFile')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('** POST ', function() {
  after(() => {
    fs.truncateSync(config.COMMENT_STORE);
  });

  describe('* when one comment is written', function() {
    it('should redirect when /GuestBook.html is called by post method', function(done) {
      request(app.serve.bind(app))
        .post('/GuestBook.html')
        .set('Accept', '*/*')
        .send('name=Tom&comment=I+want+jerry')
        .expect(303, done)
        .expect(res => {
          res.header['location'] === '/GuestBook.html';
        });
    });
    it('should give GuestBook page', function(done) {
      request(app.serve.bind(app))
        .get('/GuestBook.html')
        .set('Accept', '*/*')
        .expect(200)
        .expect('content-type', /html/)
        .expect('content-length', '1040')
        .expect(
          /<h1 class="centerHeader"><a href="index.html">&lt;&lt;<\/a> GuestBook<\/h1>/,
          done
        );
    });
  });

  describe('* when two comments are written', function() {
    it('should redirect when /GuestBook.html is called by post method and write first comment ', function(done) {
      request(app.serve.bind(app))
        .post('/GuestBook.html')
        .set('Accept', '*/*')
        .send('name=Tom&comment=I+want+jerry')
        .expect(303, done)
        .expect(res => {
          res.header['location'] === '/GuestBook.html';
        });
    });

    it('should redirect when /GuestBook.html is called by post method and write second comment ', function(done) {
      request(app.serve.bind(app))
        .post('/GuestBook.html')
        .set('Accept', '*/*')
        .send('name=Tom&comment=But+I+will+not+eat+him')
        .expect(303, done)
        .expect(res => {
          res.header['location'] === '/GuestBook.html';
        });
    });

    it('should give GuestBook page', function(done) {
      request(app.serve.bind(app))
        .get('/GuestBook.html')
        .set('Accept', '*/*')
        .expect(200)
        .expect('content-type', /html/)
        .expect('content-length', '1342')
        .expect(
          /<h1 class="centerHeader"><a href="index.html">&lt;&lt;<\/a> GuestBook<\/h1>/,
          done
        );
    });
  });
});
