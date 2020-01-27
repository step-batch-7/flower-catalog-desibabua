const { writeFileSync } = require('fs');
const dbUrl = `${__dirname}/../../dataBase/commentHistory.json`;
const commentHistory = require(dbUrl);

const changeToCorrectFormate = function(text) {
  let line = text.replace(/\+/g, ' ');
  line = line.replace(/%0D%0A/g, '\n');
  return line;
};

const saveComment = function(comment) {
  comment.name = changeToCorrectFormate(comment.name);
  comment.comment = changeToCorrectFormate(comment.comment);
  comment.date = new Date().toLocaleString();
  commentHistory.unshift(comment);
  writeFileSync(dbUrl, JSON.stringify(commentHistory, null, 2));
};

module.exports = saveComment;
