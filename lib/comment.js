class Comment {
  constructor(name, comment, time) {
    this.name = name;
    this.comment = comment;
    this.time = time;
  }

  toHTML() {
    const html = `
    <div class="comment">
      <h3>${this.name}</h3>
      <p>
        ${this.comment}
      </p>
      <p class="date">${new Date(this.time).toLocaleString()}</p>
    </div>`;
    return html;
  }
}

class Comments {
  constructor() {
    this.comments = [];
  }

  add(comment) {
    this.comments.unshift(comment);
  }

  toHTML() {
    const html = this.comments.map(comment => comment.toHTML()).join('');
    return html;
  }

  static load(content) {
    const commentList = new Comments();
    content.forEach(comment => {
      commentList.comments.push(
        new Comment(comment.name, comment.comment, comment.time)
      );
    });
    return commentList;
  }
}

module.exports = { Comment, Comments };
