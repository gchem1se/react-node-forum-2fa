import { Post, PostsCollection } from "../models/post.model";
import { getJson } from "../utils/utils";
import { getPostComments } from "./comment.service";
import config from "../constants/config";
import { ERROR_MESSAGES } from "../constants/errors";

async function getPosts() {
  const result = await getJson("/api/posts");
  if (result.ok) result.data = new PostsCollection().addMany(result.data);
  return result; // { ok: true, data } || { ok: false, status, error };
}

async function getPostById(id) {
  const result = await getJson(`/api/posts/${id}`);
  if (result.ok)
    result.data = new Post(result.data.title, result.data.text)
      .setAuthor(result.data.author)
      .setId(result.data.id)
      .setMaxComments(result.data.max_comments)
      .setPubTimestamp(result.data.pub_timestamp)
      .setRelatedCommentsN(result.data.related_comments_n)
      .setComments(await getPostComments(id));
  return result; // { ok: true, data } || { ok: false, status, error };
}

async function getRelatedCommentsN(id) {
  const result = await getJson(`/api/posts/${id}/comments-count`);
  return result; // { ok: true, data } || { ok: false, status, error };
}

async function addPost(post) {
  let response;
  try {
    response = await fetch(config.backend_URI + "/api/posts", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: post.text,
        title: post.title,
        max_comments: post.max_comments,
      }),
    });
    if (!response.ok) {
      const json = await response.json();
      const err = new Error();
      err.code = json.error || ERROR_MESSAGES.ERR_UNKNOWN;
      throw err;
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      status: response ? response.status : null,
      error: err.code,
    };
  }
}

async function deletePost(id) {
  let response;
  try {
    response = await fetch(config.backend_URI + `/api/posts/${id}`, {
      credentials: "include",
      method: "DELETE",
    });
    if (!response.ok) {
      const json = await response.json();
      const err = new Error();
      err.code = json.error || ERROR_MESSAGES.ERR_UNKNOWN;
      throw err;
    }
    const posts = await response.json();
    return { ok: true, data: posts }; // will refresh state with this
  } catch (err) {
    return {
      ok: false,
      status: response ? response.status : null,
      error: err.code,
    };
  }
}

export { getPosts, getPostById, addPost, deletePost, getRelatedCommentsN };
