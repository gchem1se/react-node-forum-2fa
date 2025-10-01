import { CommentsCollection } from "../models/comment.model";
import { getJson } from "../utils/utils";
import config from "../constants/config";
import { ERROR_MESSAGES } from "../constants/errors";

async function getPostComments(post_id) {
  const result = await getJson(`/api/posts/${post_id}/comments`, {
    credentials: "include",
  });
  if (result.ok) {
    result.onlyAnon = result.data.onlyAnon;
    result.data = new CommentsCollection().addMany(result.data.data);
  }
  return result; // { ok: true, onlyAnon, data } || { ok: false, status, error };
}

async function getInterestingFlagsN(id) {
  const result = await getJson(`/api/comments/${id}/interesting-flags`, {
    credentials: "include",
  });
  return result; // { ok: true, data } || { ok: false, status, error };
}

async function addComment(comment) {
  let response;
  try {
    response = await fetch(
      config.backend_URI + `/api/posts/${comment.post_id}/comments`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: comment.text,
        }),
      }
    );
    if (!response.ok) {
      const json = await response.json();
      const err = new Error();
      err.code = json.error || ERROR_MESSAGES.ERR_UNKNOWN;
      throw err;
    }
    const comments = await response.json();
    return { ok: true, data: comments }; // will refresh state with this
  } catch (err) {
    return {
      ok: false,
      status: response ? response.status : null,
      error: err.code,
    };
  }
}

async function editComment(commentId, text) {
  let response;
  try {
    response = await fetch(config.backend_URI + `/api/comments/${commentId}`, {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    });
    if (!response.ok) {
      const json = await response.json();
      const err = new Error();
      err.code = json.error || ERROR_MESSAGES.ERR_UNKNOWN;
      throw err;
    }
    const comments = await response.json();
    return { ok: true, data: comments }; // will refresh state with this
  } catch (err) {
    return {
      ok: false,
      status: response ? response.status : null,
      error: err.code,
    };
  }
}

async function deleteComment(id) {
  let response;
  try {
    response = await fetch(config.backend_URI + `/api/comments/${id}`, {
      credentials: "include",
      method: "DELETE",
    });
    if (!response.ok) {
      const json = await response.json();
      const err = new Error();
      err.code = json.error || ERROR_MESSAGES.ERR_UNKNOWN;
      throw err;
    }
    const comments = await response.json();
    return { ok: true, data: comments }; // will refresh state with this
  } catch (err) {
    return {
      ok: false,
      status: response ? response.status : null,
      error: err.code,
    };
  }
}

async function addInterestingFlag(id) {
  let response;
  try {
    response = await fetch(
      config.backend_URI + `/api/comments/${id}/interesting-flags`,
      {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const json = await response.json();
      const err = new Error();
      err.code = json.error || ERROR_MESSAGES.ERR_UNKNOWN;
      throw err;
    }
    const interesting_flags_n = await response.json();
    return { ok: true, data: interesting_flags_n }; // will refresh state with this
  } catch (err) {
    return {
      ok: false,
      status: response ? response.status : null,
      error: err.code,
    };
  }
}

async function removeInterestingFlag(id) {
  let response;
  try {
    response = await fetch(
      config.backend_URI + `/api/comments/${id}/interesting-flags`,
      {
        credentials: "include",
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const json = await response.json();
      const err = new Error();
      err.code = json.error || ERROR_MESSAGES.ERR_UNKNOWN;
      throw err;
    }
    const interesting_flags_n = await response.json();
    return { ok: true, data: interesting_flags_n }; // will refresh state with this
  } catch (err) {
    return {
      ok: false,
      status: response ? response.status : null,
      error: err.code,
    };
  }
}

export {
  getPostComments,
  getInterestingFlagsN,
  addComment,
  deleteComment,
  addInterestingFlag,
  removeInterestingFlag,
  editComment,
};
