import dayjs from "dayjs";
import config from "../constants/config";
import { createAvatar } from "@dicebear/core";
import { bigEars } from "@dicebear/collection";
import { ERROR_MESSAGES } from "../constants/errors";

async function getJson(endpoint, options = {}) {
  let response;
  try {
    response = await fetch(config.backend_URI + endpoint, {
      ...options,
    });
    if (!response.ok) {
      const json = await response.json();
      const err = new Error();
      err.code = json.error || ERROR_MESSAGES.ERR_UNKNOWN;
      throw err;
    }
    const json = await response.json();
    return { ok: true, data: json };
  } catch (err) {
    return {
      ok: false,
      status: response ? response.status : null,
      error: err.code,
    };
  }
}

function formatTimestamp(unixTimestamp) {
  return dayjs.unix(unixTimestamp).format("YYYY-MM-DD HH:mm:ss");
}

function getIdenticon(username, size = 128) {
  const style = bigEars;
  return createAvatar(style, {
    seed: username,
    size: size,
  }).toDataUri();
}

export { getJson, getIdenticon, formatTimestamp };
