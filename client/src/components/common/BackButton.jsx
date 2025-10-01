import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={() => {
        navigate("/");
      }}
      className=" text-nowrap"
    >
      <i className="bi bi-arrow-left me-2" />
      <span>Go back</span>
    </Button>
  );
};

export default BackButton;
