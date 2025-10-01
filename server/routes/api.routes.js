"use strict";

const express = require("express");
const dbmodule = require("../database/database");
const router = express.Router();
const queries = require("../database/queries");
const { logger } = require("../utils/logger");
const { ensureAuthenticated } = require("../middlewares/auth.middlewares");
const dayjs = require("dayjs");
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
const { check } = require("express-validator");
const handleValidationErrors = require("../middlewares/validation.middlewares");
const {
  postExists,
  canAddComment,
  commentExists,
  postIsTheirs,
  userIsInterested,
  userIsAdmin,
  commentIsTheirs,
  postWithTitleExists,
} = require("../utils/checks");

/* get all posts for the home */
router.get("/posts", async (req, res) => {
  try {
    // no restrictions on this API
    const db = await dbmodule.DatabaseSingleton().get();
    const query_result = await db.all(queries.GET_POSTS_HOME, {});
    res.json(query_result);
  } catch (error) {
    logger.error("Cannot get posts", error);
    res.status(503).json({ error: "ERR_GETTING_POSTS" });
  }
});

/* get one post for the details page */
router.get(
  "/posts/:id",
  [
    check("id")
      .isInt({ min: 1 })
      .withMessage("Comment ID must be a positive number"),
    handleValidationErrors,
  ],
  async (req, res) => {
    const post_id = req.params.id;
    try {
      // no restrictions on this API
      const db = await dbmodule.DatabaseSingleton().get();

      // check post exists, otherwise not found

      if (!(await postExists(db, post_id))) {
        logger.error(`Post ${post_id} does not exist.`);
        res.status(404).json({ error: "ERR_POST_NOT_FOUND" });
        return;
      }

      const query_result = await db.get(queries.GET_POST_DETAILS, {
        ":id": post_id,
      });

      res.json(query_result);
    } catch (error) {
      logger.error(`Cannot get post ${post_id}`, error);
      res.status(503).json({ error: "ERR_GETTING_POST" });
    }
  }
);

/* get comments count for a post */
router.get(
  "/posts/:id/comments-count",
  [
    check("id").isInt({ min: 1 }).withMessage("Id must be a positive number"),
    handleValidationErrors,
  ],
  async (req, res) => {
    const post_id = req.params.id;
    try {
      const db = await dbmodule.DatabaseSingleton().get();

      // check post exists, otherwise not found

      if (!(await postExists(db, post_id))) {
        logger.error(`Post ${post_id} does not exist.`);
        res.status(404).json({ error: "ERR_POST_NOT_FOUND" });
        return;
      }

      const query_result = await db.get(queries.GET_RELATED_COMMENTS_N, {
        ":post_id": post_id,
      });

      res.json(query_result);
    } catch (error) {
      logger.error(`Cannot get comments count for post ${post_id}`, error);
      res.status(503).json({
        error: "ERR_GETTING_COMMENTS_COUNT",
      });
    }
  }
);

/* get comments of a post */
router.get(
  "/posts/:id/comments",
  [
    check("id").isInt({ min: 1 }).withMessage("Id must be a positive number"),
    handleValidationErrors,
  ],
  async (req, res) => {
    const post_id = req.params.id;
    try {
      const db = await dbmodule.DatabaseSingleton().get();

      // check post exists, otherwise not found

      if (!(await postExists(db, post_id))) {
        logger.error(`Post ${post_id} does not exist.`);
        res.status(404).json({ error: "ERR_POST_NOT_FOUND" });
        return;
      }

      // check user is authenticated, otherwise return anonymous comments only
      let query_result;
      if (req.isAuthenticated()) {
        query_result = await db.all(queries.GET_POST_COMMENTS, {
          ":post_id": post_id,
          ":user_id": req.user.id,
        });
      } else {
        query_result = await db.all(queries.GET_POST_ANON_COMMENTS, {
          ":post_id": post_id,
        });
      }

      res.json({
        onlyAnon: !req.isAuthenticated(),
        data: query_result,
      });
    } catch (error) {
      logger.error(
        `Cannot get comments for post ${post_id} for ` +
          `${req.isAuthenticated() ? req.user.username : "an anonymous user"}`,
        error
      );
      res.status(503).json({
        error: "ERR_GETTING_COMMENTS",
      });
    }
  }
);

/* get interesting flags count for a comment */
router.get(
  "/comments/:id/interesting-flags",
  [
    ensureAuthenticated,
    check("id").isInt({ min: 1 }).withMessage("Id must be a positive number"),
    handleValidationErrors,
  ],
  async (req, res) => {
    const comment_id = req.params.id;
    logger.debug(comment_id);
    try {
      const db = await dbmodule.DatabaseSingleton().get();
      // check user is authenticated, otherwise unauthorized => done via middleware

      // check comment exists, otherwise not found

      if (!(await commentExists(db, comment_id))) {
        logger.error(`Comment ${comment_id} does not exist.`);
        res.status(404).json({ error: "ERR_COMMENT_NOT_FOUND" });
        return;
      }

      // check user is already interested or comment is theirs, otherwise forbidden

      if (
        !(await commentIsTheirs(db, comment_id, req.user.id)) &&
        !(await userIsInterested(db, comment_id, req.user.id))
      ) {
        logger.error(
          `User ${req.user.id} is not authorized to get interesting flags count for comment ${comment_id}.`
        );
        res
          .status(403)
          .json({ error: "ERR_UNAUTHORIZED_GETTING_INTERESTING_FLAGS_COUNT" });
        return;
      }

      const query_result = await db.get(queries.GET_INTERESTING_FLAGS_N, {
        ":comment_id": comment_id,
      });

      res.json(query_result["interesting_flags_n"]);
    } catch (error) {
      logger.error(
        `Cannot get interesting flags count for comment ${comment_id} for ${req.user.username}`,
        error
      );
      res.status(503).json({
        error: `ERR_GETTING_INTERESTING_FLAGS_COUNT`,
      });
    }
  }
);

/* add a post */
router.post(
  "/posts",
  [
    ensureAuthenticated,
    check("max_comments")
      .optional({ nullable: true })
      .isInt({ min: 0 })
      .withMessage(
        "Maximum number of comments must be null or an integer >= 0"
      ),
    check("text").trim().notEmpty().withMessage("Post text must not be empty"),
    check("title")
      .trim()
      .notEmpty()
      .withMessage("Post title must not be empty"),
    handleValidationErrors,
  ],
  async (req, res) => {
    // not idempotent because of auto-increment pk in db
    try {
      const db = await dbmodule.DatabaseSingleton().get();
      // check user is authenticated, otherwise unauthorized => done via middleware

      const cleanTitle = DOMPurify.sanitize(req.body.title).trim();

      // check that title is unique, otherwise conflict
      if (await postWithTitleExists(db, cleanTitle)) {
        logger.error(`A post with title "${cleanTitle}" already exists.`);
        res.status(409).json({ error: "ERR_TITLE_NOT_UNIQUE" });
        return;
      }

      const cleanText = DOMPurify.sanitize(req.body.text).trim();
      if (cleanTitle.length === 0 || cleanText.length === 0) {
        logger.error(`Title or text provided is empty.`);
        res.status(409).json({ error: "ERR_EMPTY_FIELDS" });
        return;
      }

      const result = await db.run(queries.ADD_POST, {
        // sanitizing received data, client will escape before outputting
        ":title": cleanTitle,
        ":text": cleanText,
        ":pub_timestamp": dayjs().unix(),
        ":max_comments": req.body.max_comments || null,
        ":user_id": req.user.id,
      });

      res.json({ id: result.lastID });
    } catch (error) {
      logger.error(
        `Failed to add post of title ${req.body.title} by user ${req.user.username}`,
        error
      );
      res.status(503).json({
        error: `ERR_ADDING_POST`,
      });
    }
  }
);

/* add a comment to a post */
router.post(
  "/posts/:id/comments",
  [
    check("id").isInt({ min: 1 }).withMessage("Id must be a positive number"),
    check("text").trim().notEmpty().withMessage("Post text must not be empty"),
    handleValidationErrors,
  ],
  async (req, res) => {
    // not idempotent because of auto-increment pk in db
    const post_id = req.params.id;
    try {
      const db = await dbmodule.DatabaseSingleton().get();

      // check post exists, otherwise not found

      if (!(await postExists(db, post_id))) {
        logger.error(`Post ${post_id} does not exist.`);
        res.status(404).json({ error: "ERR_POST_NOT_FOUND" });
        return;
      }

      // check comments did not reach max_comments, otherwise conflict
      if (!(await canAddComment(db, post_id))) {
        logger.error(`Post ${post_id} has already reached the comments limit.`);
        res.status(409).json({ error: "ERR_EXCEEDING_MAX_COMMENTS" });
        return;
      }

      const cleanText = DOMPurify.sanitize(req.body.text);
      if (cleanText.length === 0) {
        logger.error(`Text provided is empty.`);
        res.status(409).json({ error: "ERR_EMPTY_FIELDS" });
        return;
      }

      const result = await db.run(queries.ADD_COMMENT, {
        // sanitizing received data, client will escape before outputting
        ":text": cleanText,
        ":pub_timestamp": dayjs().unix(),
        ":user_id": req.isAuthenticated() ? req.user.id : null,
        ":post_id": post_id,
      });

      res.json({ id: result.lastID });
    } catch (error) {
      logger.error(
        `Failed to add comment to post ${post_id} by ` +
          `${req.isAuthenticated() ? req.user.username : "an anonymous user"}`,
        error
      );
      res.status(503).json({
        error: "ERR_ADDING_COMMENT",
      });
    }
  }
);

/* edit a comment's text */
router.put(
  "/comments/:id",
  [
    ensureAuthenticated,
    check("id").isInt({ min: 1 }).withMessage("Id must be a positive number"),
    check("text").trim().notEmpty().withMessage("Post text must not be empty"),
    handleValidationErrors,
  ],
  async (req, res) => {
    // idempotent because editing with the same text as before yields the same result

    const comment_id = req.params.id;

    try {
      const db = await dbmodule.DatabaseSingleton().get();

      // check comment exists, otherwise not found

      if (!(await commentExists(db, comment_id))) {
        logger.error(`Comment ${comment_id} does not exist.`);
        return res.status(404).json({ error: "ERR_COMMENT_NOT_FOUND" });
      }

      // check post is theirs or user is admin, otherwise forbidden

      if (
        !(await commentIsTheirs(db, comment_id, req.user.id)) &&
        !((await userIsAdmin(db, req.user.id)) && req.session.method === "totp")
      ) {
        logger.error(
          `User ${req.user.id} is not authorized to edit comment ${comment_id}.`
        );
        return res
          .status(403)
          .json({ error: "ERR_UNAUTHORIZED_EDITING_COMMENT" });
      }

      const cleanText = DOMPurify.sanitize(req.body.text);
      if (cleanText.length === 0) {
        logger.error(`Text provided is empty.`);
        res.status(409).json({ error: "ERR_EMPTY_FIELDS" });
        return;
      }

      // update the comment text
      await db.run(queries.UPDATE_COMMENT_TEXT, {
        ":id": comment_id,
        ":text": cleanText,
      });

      res.json({ ok: true });
    } catch (error) {
      logger.error(
        `Failed to update comment ${comment_id} by user ${req.user.username}`,
        error
      );
      res.status(503).json({ error: "ERR_EDITING_COMMENT" });
    }
  }
);

/* add interesting flag to a comment by a user */
router.put(
  "/comments/:id/interesting-flags",
  [
    ensureAuthenticated,
    check("id").isInt({ min: 1 }).withMessage("Id must be a positive number"),
    handleValidationErrors,
  ],
  async (req, res) => {
    // idempotent because of "insert or ignore" in query
    const comment_id = req.params.id;
    try {
      const db = await dbmodule.DatabaseSingleton().get();

      // check user is authenticated, otherwise unauthorized => done via middleware

      // check comment exists, otherwise not found

      if (!(await commentExists(db, comment_id))) {
        logger.error(`Comment ${comment_id} does not exist.`);
        res.status(404).json({ error: "ERR_COMMENT_NOT_FOUND" });
        return;
      }

      await db.run(queries.ADDIGNORE_INTERESTING_FLAG, {
        ":user_id": req.user.id,
        ":comment_id": comment_id,
      });

      res.json({ ok: true });
    } catch (error) {
      logger.error(
        `Failed to add interesting flag to comment ${comment_id} by ` +
          `${req.isAuthenticated() ? req.user.username : "an anonymous user"}`,
        error
      );
      res.status(503).json({
        error: "ERR_ADDING_INTERESTING_FLAG",
      });
    }
  }
);

/* remove post */
router.delete(
  "/posts/:id",
  [
    ensureAuthenticated,
    check("id").isInt({ min: 1 }).withMessage("Id must be a positive number"),
    handleValidationErrors,
  ],
  async (req, res) => {
    // idempotent because SQL delete from ... where ... is always idempotent
    const post_id = req.params.id;
    try {
      const db = await dbmodule.DatabaseSingleton().get();
      // check user is authenticated, otherwise unauthorized => done via middleware

      // check post exists, otherwise not found

      if (!(await postExists(db, post_id))) {
        logger.error(`Post ${post_id} does not exist.`);
        res.status(404).json({ error: "ERR_POST_NOT_FOUND" });
        return;
      }

      // check post is theirs or user is admin, otherwise forbidden

      if (
        !(await postIsTheirs(db, post_id, req.user.id)) &&
        !((await userIsAdmin(db, req.user.id)) && req.session.method === "totp")
      ) {
        logger.error(
          `User ${req.user.id} is not authorized to delete post ${post_id}.`
        );
        res.status(403).json({ error: "ERR_UNAUTHORIZED_DELETING_POST" });
        return;
      }

      await db.run(queries.DELETE_POST, {
        ":id": post_id,
      });

      res.json({ ok: true });
    } catch (error) {
      logger.error(
        `Failed to delete interesting flag by ` +
          `${req.isAuthenticated() ? req.user.username : "an anonymous user"}` +
          ` from comment ${post_id}`,
        error
      );
      res.status(503).json({
        error: "ERR_DELETING_POST",
      });
    }
  }
);

/* remove comment */
router.delete(
  "/comments/:id",
  [
    ensureAuthenticated,
    check("id").isInt({ min: 1 }).withMessage("Id must be a positive number"),
    handleValidationErrors,
  ],
  async (req, res) => {
    // idempotent because SQL delete from ... where ... is always idempotent
    const comment_id = req.params.id;
    try {
      const db = await dbmodule.DatabaseSingleton().get();
      // check user is authenticated, otherwise unauthorized => done via middleware1

      // check comment exists, otherwise not found

      if (!(await commentExists(db, comment_id))) {
        logger.error(`Comment ${comment_id} does not exist.`);
        res.status(404).json({ error: "ERR_COMMENT_NOT_FOUND" });
        return;
      }

      // check comment is theirs or user is admin, otherwise forbidden

      if (
        !(await commentIsTheirs(db, comment_id, req.user.id)) &&
        !((await userIsAdmin(db, req.user.id)) && req.session.method === "totp")
      ) {
        logger.error(
          `User ${req.user.id} is not authorized to delete comment ${comment_id}.`
        );
        res.status(403).json({ error: "ERR_UNAUTHORIZED_DELETING_COMMENT" });
        return;
      }

      await db.run(queries.DELETE_COMMENT, {
        ":id": comment_id,
      });

      res.json({ ok: true });
    } catch (error) {
      logger.error(
        `Failed to delete comment ${comment_id}, action requested by ` +
          `${req.isAuthenticated() ? req.user.username : "an anonymous user"}`,
        error
      );
      res.status(503).json({
        error: "ERR_DELETING_COMMENT",
      });
    }
  }
);

/* remove interesting flag by a user from a comment */
router.delete(
  "/comments/:id/interesting-flags",
  [
    ensureAuthenticated,
    check("id").isInt({ min: 1 }).withMessage("Id must be a positive number"),
    handleValidationErrors,
  ],
  async (req, res) => {
    // idempotent because SQL delete from ... where ... is always idempotent
    const comment_id = req.params.id;
    try {
      const db = await dbmodule.DatabaseSingleton().get();
      // check user is authenticated, otherwise unauthorized => done via middleware

      // check comment exists, otherwise not found

      if (!(await commentExists(db, comment_id))) {
        logger.error(`Comment ${comment_id} does not exist.`);
        res.status(404).json({ error: "ERR_COMMENT_NOT_FOUND" });
        return;
      }

      await db.run(queries.DELETE_INTERESTING_FLAG, {
        ":user_id": req.user.id,
        ":comment_id": comment_id,
      });

      res.json({ ok: true });
    } catch (error) {
      logger.error(
        `Failed to delete interesting flag by ` +
          `${req.isAuthenticated() ? req.user.username : "an anonymous user"}` +
          ` from comment ${comment_id}`,
        error
      );
      res.status(503).json({
        error: "ERR_REMOVING_INTERESTING_FLAG",
      });
    }
  }
);

module.exports = router;
