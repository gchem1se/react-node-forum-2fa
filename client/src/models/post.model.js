function Post(title, text) {
  this.title = title;
  this.text = text;
  this.setPubTimestamp = (t) => {
    this.pub_timestamp = t;
    return this;
  };
  this.setMaxComments = (max) => {
    this.max_comments = max;
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
  this.setRelatedCommentsN = (n) => {
    this.related_comments_n = n;
    return this;
  };
  this.setInterestingFlagsN = (n) => {
    this.interesting_flags_n = n;
    return this;
  };
  this.setComments = (comments) => {
    this.comments = comments;
    return this;
  };
}

function PostsCollection() {
  this.items = new Map();
  this.add = (post) => {
    if (this.items.has(post.id)) {
      throw new Error(`There is already one item with that id (${post.id})`);
    }
    this.items.set(post.id, post);
    return this;
  };
  this.addMany = (posts) => {
    posts.forEach((element) => {
      const newPost = new Post(element.title, element.text)
        .setRelatedCommentsN(element.related_comments_n)
        .setMaxComments(element.max_comments)
        .setPubTimestamp(element.pub_timestamp)
        .setAuthor(element.author)
        .setInterestingFlagsN(element.setInterestingFlagsN)
        .setId(element.id);
      this.add(newPost);
    });
    return this;
  };
  this.length = () => this.items.size;
  this.clear = () => {
    this.items = new Map();
    return this;
  };
  this.toArray = () => {
    return Array.from(this.items.values());
  };
  this.getById = (id) => {
    const post = this.items.get(id);
    if (!post) throw new Error(`No item with that id (${id})`);
    return post;
  };
  this.deleteById = (id) => {
    const post = this.items.get(id);
    if (!post) throw new Error(`No item with that id (${id})`);
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

export { Post, PostsCollection };
