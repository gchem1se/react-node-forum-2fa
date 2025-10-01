import { getIdenticon } from "../utils/utils";

function User(username, email) {
  this.username = username;
  this.email = email;
  this.setIsAdmin = (is_admin) => {
    this.is_admin = is_admin;
    return this;
  };
  this.getIcon = () => {
    return getIdenticon(this.username);
  };
  this.setOkTOTP = (ok) => {
    this.okTOTP = ok;
    return this;
  };
}

export { User };
