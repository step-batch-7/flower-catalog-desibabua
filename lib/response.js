class Response {
  constructor() {
    this.statusCode = 404;
    this.headers = [
      { key: 'Content-Type', value: 'text/plain' },
      { key: 'Content-Length', value: '0' }
    ];
  }

  setHeader(key, value) {
    let header = this.headers.find(header => header.key === key);
    if (header) header.value = value;
    this.headers.push({ key, value });
  }

  getHeaderMsg() {
    const lines = this.headers.map(header => `${header.key}: ${header.value}`);
    return lines.join('\r\n');
  }

  writeTo(writable) {
    writable.write(`HTTP/1.1 ${this.statusCode}\r\n`);
    writable.write(this.getHeaderMsg());
    writable.write('\r\n\r\n');
    this.body && writable.write(this.body);
  }
}

module.exports = Response;
