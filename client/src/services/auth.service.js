import config from "../constants/config";
import { ERROR_MESSAGES } from "../constants/errors";

async function login(email, password) {
  let response;
  try {
    response = await fetch(config.backend_URI + "/auth/login", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password,
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
    }; // { ok: true } || { ok: false, status, error };
  }
}

async function verifyTOTP(totpCode) {
  let response;
  try {
    response = await fetch(config.backend_URI + "/auth/totp", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: totpCode }),
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
    }; // { ok: true } || { ok: false, status, error };
  }
}

async function logout() {
  let response;
  try {
    response = await fetch(config.backend_URI + "/auth/logout", {
      credentials: "include",
      method: "POST",
    });
    if (response.ok) {
      return { ok: true };
    } else {
      throw new Error({ code: response.error || ERROR_MESSAGES.ERR_UNKNOWN });
    }
  } catch (err) {
    return {
      ok: false,
      status: response ? response.status : null,
      error: err.code,
    }; // { ok: true } || { ok: false, status, error };
  }
}

export { login, logout, verifyTOTP };
