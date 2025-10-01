import { User } from "../models/user.model";
import { getJson } from "../utils/utils";

async function getUser() {
  const result = await getJson("/auth/user", { credentials: "include" });
  if (result.ok) {
    result.data = new User(result.data.username, result.data.email)
      .setIsAdmin(result.data.is_admin)
      .setOkTOTP(result.data.okTOTP || false);
  }
  return result; // { ok: true, data } || { ok: false, status, error };
}

export { getUser };
