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
    let { headers, content } = headersAndBody.reduce(collectHeadersAndContent, {
      headers: {}
    });
    const [url, keyValuePairs] = fileAndKeyValuePairs.split('?');
    const query = keyValuePairs && readParams(keyValuePairs);
    if (headers[`Content-Type`] === 'application/x-www-form-urlencoded') {
      content = readParams(content);
    }
    const req = new Request(method, url, query, headers, content);
    return req;
  }
}

module.exports = Request;
