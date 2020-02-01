const { env } = require('process');

const config = {
  COMMENT_STORE: env.COMMENT_STORE
};

module.exports = config;
