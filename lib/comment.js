const { writeFileSync } = require('fs');
const { parse } = require('querystring');
const dbUrl = `${__dirname}/../dataBase/commentHistory.json`;
const commentHistory = require(dbUrl);

const saveComment = function(comment) {
  if (!comment) {
    return;
  }
  const currentComment = parse(comment);
  currentComment.date = new Date().toJSON();
  commentHistory.unshift(currentComment);
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
      <p class="date">${new Date(comment.date).toLocaleString()}</p>
    </div>`;
    return html;
  });
  return comments.join('\n');
};

module.exports = { saveComment, loadComments };
