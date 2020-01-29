const { existsSync, statSync } = require('fs');
const SERVING_DIR = `${__dirname}/../public`;

const absUrl = url => `${SERVING_DIR}/${url}`;

const isFilePresent = function(path) {
  const stat = existsSync(path) && statSync(path).isFile();
  return stat;
};

module.exports = { absUrl, isFilePresent };
