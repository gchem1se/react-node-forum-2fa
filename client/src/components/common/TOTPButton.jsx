import React, { useContext } from "react";
import WithPopover from "./WithPopover";
import TOTPForm from "../forms/auth/TOTPForm";
import { AuthContext } from "../../contexts/AuthContext";
import { Button } from "react-bootstrap";

const TOTPButton = () => {
  const { setError } = useContext(AuthContext);
  return (
    <WithPopover
      props={{
        trigger: "click",
        popoverTitle: "2FA",
        popoverBody: <TOTPForm />,
        onPopOut: () => {
          setError(false);
        },
      }}
    >
      <Button variant="primary">Enter TOTP</Button>
    </WithPopover>
  );
};

export default TOTPButton;
