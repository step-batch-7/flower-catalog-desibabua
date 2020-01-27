const SERVING_DIR = `${__dirname}/../public`;
const lookUp = require('./lookUp');

const collectHeadersAndContent = (result, line) => {
  if (line === '') {
    result.content = '';
    return result;
  }
  if ('content' in result) {
    result.content += line;
    return result;
  }
  const [key, value] = line.split(': ');
  result.headers[key] = value;
  return result;
};

const getReqFileName = function(url) {
  const lookUpForFile = {
    '/': '/index.html',
    '/saveComment': '/GuestBook.html'
  };
  const fileName = lookUpForFile[url] ? lookUpForFile[url] : url;
  const [, urlType] = url.match(/.*\.(.*)$/) || [, '/'];
  const absUrl = `${SERVING_DIR}/${lookUp[urlType].dir}${fileName}`;
  return absUrl;
};

const pickupParams = (query, keyValue) => {
  const [key, value] = keyValue.split('=');
  query[key] = value;
  return query;
};

const readParams = keyValueTextPairs =>
  keyValueTextPairs.split('&').reduce(pickupParams, {});

class Request {
  constructor(method, url, query, header, body) {
    this.method = method;
    this.url = url;
    this.query = query;
    this.header = header;
    this.body = body;
  }

  static parse(data) {
    const [requestLine, ...headersAndBody] = data.split('\r\n');
    const [method, fileAndKeyValuePairs, protocol] = requestLine.split(' ');
    const { headers, body } = headersAndBody.reduce(collectHeadersAndContent, {
      headers: {}
    });
    const [reqUrl, keyValuePairs] = fileAndKeyValuePairs.split('?');
    const query = keyValuePairs && readParams(keyValuePairs);
    const url = getReqFileName(reqUrl);
    const req = new Request(method, url, query, headers, body);
    console.error(req);
    return req;
  }
}

module.exports = Request;
