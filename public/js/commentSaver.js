const { writeFileSync } = require('fs');
const dbUrl = `${__dirname}/../../dataBase/commentHistory.json`
const commentHistory = require(dbUrl);

const saveComment = function(comment) {
  comment.date = new Date().toLocaleString();
  commentHistory.unshift(comment);
  writeFileSync(dbUrl, JSON.stringify(commentHistory, null, 2));
};

module.exports = saveComment;
