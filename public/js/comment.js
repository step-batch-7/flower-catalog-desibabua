const { writeFileSync } = require('fs');
const dbUrl = `${__dirname}/../../dataBase/commentHistory.json`;
const commentHistory = require(dbUrl);

const changeToCorrectFormate = function(text) {
  let line = text.replace(/\+/g, ' ');
  line = line.replace(/%0D%0A/g, '\n');
  line = decodeURIComponent(line);
  return line;
};

const saveComment = function(comment) {
  if (!comment) return;
  comment.name = changeToCorrectFormate(comment.name);
  comment.comment = changeToCorrectFormate(comment.comment);
  comment.date = new Date().toLocaleString();
  commentHistory.unshift(comment);
  writeFileSync(dbUrl, JSON.stringify(commentHistory, null, 2));
};

const loadComments = function() {
  const comments = commentHistory.map(comment => {
    const html = `
    <div class="comment">
      <h3>${comment.name}</h3>
      <p>
        ${comment.comment}
      </p>
      <p class="date">${comment.date}</p>
    </div>`;
    return html;
  });
  return comments.join('\n');
};

module.exports = { saveComment, loadComments };
