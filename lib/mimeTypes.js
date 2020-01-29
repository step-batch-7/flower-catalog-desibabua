const mimeType = {
  js: 'application/javascript',
  css: 'text/css',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  ico: 'image/jpeg',
  html: 'text/html',
  pdf: 'application/pdf'
};

const getMimeType = function(url) {
  const extension = url.split('.').pop();
  return mimeType[extension];
};

module.exports = getMimeType;
