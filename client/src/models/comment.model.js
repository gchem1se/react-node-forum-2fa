function Comment(post_id, text) {
  this.post_id = post_id;
  this.text = text;
  this.setPubTimestamp = (t) => {
    this.pub_timestamp = t;
    return this;
  };
  this.setMarked = (b) => {
    this.marked = b;
    return this;
  };
  this.setInterestingFlagsN = (n) => {
    this.interesting_flags_n = n;
    return this;
  };
  this.setAuthor = (username) => {
    this.author = username;
    return this;
  };
  this.setId = (id) => {
    this.id = id;
    return this;
  };
}

function CommentsCollection() {
  this.items = new Map();
  this.add = (comment) => {
    if (this.items.has(comment.id)) {
      throw new Error(`There is already one item with that id (${comment.id})`);
    }
    this.items.set(comment.id, comment);
    return this;
  };
  this.addMany = (comments) => {
    comments.forEach((element) => {
      const newComment = new Comment(element.post_id, element.text)
        .setInterestingFlagsN(element.interesting_flags_n)
        .setPubTimestamp(element.pub_timestamp)
        .setAuthor(element.author)
        .setMarked(element.marked === 1)
        .setId(element.id);
      this.add(newComment);
    });
    return this;
  };
  this.length = () => this.items.size;
  this.clear = () => {
    this.items = new Map();
  };
  this.toArray = () => {
    return Array.from(this.items.values());
  };
  this.getById = (id) => {
    const comment = this.items.get(id);
    if (!comment) throw new Error(`No item with that id (${id})`);
    return comment;
  };
  this.deleteByid = (id) => {
    const comment = this.items.get(id);
    if (!comment) throw new Error(`No item with that id (${id})`);
    this.items.delete(id);
    return this;
  };
  this.getLast = () => {
    const sorted = this.toArray().sort(
      (a, b) => a.pub_timestamp - b.pub_timestamp
    );
    return sorted[sorted.length - 1];
  };
}

export { Comment, CommentsCollection };
