"use strict";

const queries = require("../database/queries");

const commentExists = async (db, comment_id) =>
  (await db.get(queries.COMMENT_EXISTS, { ":id": comment_id })).value === 1;

const commentIsTheirs = async (db, comment_id, user_id) =>
  (await db.get(queries.GET_COMMENT_AUTHORID, { ":id": comment_id }))
    .author_id === user_id;

const userIsAdmin = async (db, user_id) =>
  (await db.get(queries.USER_IS_ADMIN, { ":id": user_id })).value === 1;

const postExists = async (db, post_id) =>
  (
    await db.get(queries.POST_EXISTS, {
      ":id": post_id,
    })
  ).value === 1;

const postIsTheirs = async (db, post_id, user_id) =>
  (
    await db.get(queries.GET_POST_AUTHORID, {
      ":id": post_id,
    })
  ).author_id === user_id;

const userIsInterested = async (db, comment_id, user_id) =>
  (
    await db.get(queries.USER_IS_INTERESTED, {
      ":comment_id": comment_id,
      ":user_id": user_id,
    })
  ).value === 1;

const postWithTitleExists = async (db, title) =>
  (
    await db.get(queries.POST_WITH_TITLE_EXISTS, {
      ":title": title,
    })
  ).value === 1;

const canAddComment = async (db, post_id) =>
  (
    await db.get(queries.POST_CAN_HAVE_MORE_COMMENTS, {
      ":post_id": post_id,
    })
  ).value === 1;

module.exports = {
  commentExists,
  commentIsTheirs,
  postWithTitleExists,
  userIsAdmin,
  postExists,
  postIsTheirs,
  canAddComment,
  userIsInterested,
};
