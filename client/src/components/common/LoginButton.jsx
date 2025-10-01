import React, { useContext } from "react";
import WithPopover from "./WithPopover";
import LoginForm from "../forms/auth/LoginForm";
import { AuthContext } from "../../contexts/AuthContext";
import { Button } from "react-bootstrap";

const LoginButton = () => {
  const { setError } = useContext(AuthContext);
  return (
    <WithPopover
      props={{
        trigger: "click",
        popoverTitle: "Login",
        popoverBody: <LoginForm />,
        onPopOut: () => {
          setError(false);
        },
      }}
    >
      <Button variant="primary">Login</Button>
    </WithPopover>
  );
};

export default LoginButton;
