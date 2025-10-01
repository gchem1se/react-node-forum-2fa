import { Modal, Button } from "react-bootstrap";
import TOTPForm from "../forms/auth/TOTPForm";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const TOTPModal = ({ show, setShow }) => {
  const { setError } = useContext(AuthContext);

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        setError(false);
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Admin access</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          You have logged in as an <strong>admin</strong>. 2FA is required to
          access admin privileges. If you choose not to verify now, you can
          continue using the system with regular user permissions.
        </p>
        <TOTPForm onSuccess={() => setShow(false)}></TOTPForm>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShow(false);
            setError(false);
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TOTPModal;
