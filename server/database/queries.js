"use strict";

const Queries = Object.freeze({
  GET_POSTS_HOME: `select
      post.id,
      post.title,
      post.text,
      post.pub_timestamp,
      user.username as author,
      post.max_comments,
      count(comment.id) as related_comments_n
    from
      post
    join
      user on post.author_id = user.id
    left join
      comment on comment.post_id = post.id
    group by
      post.title, post.text, post.pub_timestamp, user.username
    order by
      post.pub_timestamp desc`,

  GET_RELATED_COMMENTS_N: `select count(comment.id) as related_comments_n from comment where comment.post_id = :post_id`,

  GET_POST_DETAILS: `select
      post.id,
      post.title,
      post.text,
      post.pub_timestamp,
      user.username as author,
      post.max_comments,
      count(comment.id) as related_comments_n
    from
      post
    join
      user on post.author_id = user.id
    left join
      comment on comment.post_id = post.id
    where
      post.id = :id
    group by
      post.id, post.title, post.text, post.pub_timestamp, user.username`,

  GET_POST_COMMENTS: `select
      comment.id,
      comment.text,
      comment.pub_timestamp,
      user.username as author,
      case
      when exists (
        select 1
        from interesting_comment ic_user
        where ic_user.comment_id = comment.id
          and ic_user.user_id = :user_id
      ) then 1
      else 0
      end as marked
    from comment
      left join user on user.id = comment.author_id
      left join interesting_comment ic_all on ic_all.comment_id = comment.id
    where comment.post_id = :post_id
    group by comment.id, comment.text, comment.pub_timestamp, user.username
    order by comment.pub_timestamp desc`,

  GET_POST_ANON_COMMENTS: `select
      comment.id,
      comment.text,
      comment.pub_timestamp
    from
      comment
    left join
      user on user.id = comment.author_id
    where
      comment.post_id = :post_id and comment.author_id is null
    order by
      comment.pub_timestamp desc`,

  GET_INTERESTING_FLAGS_N: `select count(*) as interesting_flags_n from interesting_comment where comment_id = :comment_id`,

  GET_USERID_BY_USERNAME: `select id from user where username = :username`,

  GET_USER_BY_USERNAME: `select * from user where username = :username`,

  GET_USER_BY_EMAIL: `select * from user where email = :email`,

  GET_USER_BY_ID: `select * from user where id = :id`,

  ADDIGNORE_INTERESTING_FLAG: `insert or ignore into interesting_comment(user_id, comment_id)
    values (:user_id, :comment_id)`,

  ADD_POST: `insert into post(title, text, pub_timestamp, max_comments, author_id)
    values (:title, :text, :pub_timestamp, :max_comments, :user_id)`,

  ADD_COMMENT: `insert into comment(text, pub_timestamp, post_id, author_id)
    values (:text, :pub_timestamp, :post_id, :user_id)`,

  ADD_USER: `insert into user(username, email, password_hash, salt, totp_secret, is_admin)
    values (:username, :email, :password_hash, :salt, :totp_secret, :is_admin)`,

  USER_IS_ADMIN: `select is_admin as value from user where id = :id;`,

  UPDATE_COMMENT_TEXT: `update comment set text = :text where id = :id;`,

  POST_EXISTS: `select exists(select 1 from post where id = :id) as value;`,

  POST_WITH_TITLE_EXISTS: `select exists(select 1 from post where title = :title) as value;`,

  COMMENT_EXISTS: `select exists(select 1 from comment where id = :id) as value;`,

  GET_COMMENT_AUTHORID: `select author_id from comment where id = :id`,

  GET_COMMENT_POSTID: `select post_id from comment where id = :id`,

  GET_POST_AUTHORID: `select author_id from post where id = :id`,

  POST_CAN_HAVE_MORE_COMMENTS: `select 
    case 
      when post.max_comments is null then 1
      when count(comment.id) < post.max_comments then 1
      else 0
    end as value 
    from 
      post 
    left join 
      comment on comment.post_id = post.id 
    where 
      post.id = :post_id
    group by post.id, post.max_comments`,

  USER_IS_INTERESTED: `select exists(select 1 from interesting_comment where user_id = :user_id and comment_id = :comment_id) as value;`,

  // no delete user for now

  DELETE_COMMENT: `delete from comment where id = :id`,

  DELETE_POST: `delete from post where id = :id`,

  DELETE_INTERESTING_FLAG: `delete from interesting_comment where comment_id = :comment_id and user_id = :user_id`,
});

module.exports = Queries;
