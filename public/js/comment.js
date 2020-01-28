const { writeFileSync } = require('fs');
const dbUrl = `${__dirname}/../../dataBase/commentHistory.json`;
const commentHistory = require(dbUrl);

const pickupParams = (query, keyValue) => {
  const [key, value] = keyValue.split('=');
  query[key] = value;
  return query;
};

const readParams = keyValueTextPairs =>
  keyValueTextPairs.split('&').reduce(pickupParams, {});

const changeToCorrectFormate = function(text) {
  let line = text.replace(/\+/g, ' ');
  line = line.replace(/\%0D\%0A/g, '<br />');
  line = decodeURIComponent(line);
  return line;
};

const saveComment = function(comment) {
  if (!comment) return;
  comment = readParams(comment);
  comment.name = changeToCorrectFormate(comment.name);
  comment.comment = changeToCorrectFormate(comment.comment);
  comment.date = new Date().toJSON();
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
      <p class="date">${new Date(comment.date).toLocaleString()}</p>
    </div>`;
    return html;
  });
  return comments.join('\n');
};

module.exports = { saveComment, loadComments };
