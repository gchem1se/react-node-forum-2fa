import { useContext, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { AuthContext } from "../../../contexts/AuthContext";
import { ToastsContext } from "../../../contexts/ToastsContext";
import { verifyTOTP } from "../../../services/auth.service";

function TOTPForm({ onSuccess }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("Unexpected error!");
  const { enqueue } = useContext(ToastsContext);

  const { setLoading, setError, error, loading, setOkTOTP, okTOTP } =
    useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(false);
      setLoading(true);
      const result = await verifyTOTP(code);

      if (result.ok) {
        setOkTOTP(true);
        setLoading(false);
        enqueue({
          title: "Info",
          message: `TOTP code correctly verified!`,
          variant: "light",
          delay: 3000,
        });
        onSuccess ? onSuccess() : (() => {})();
        return;
      }

      switch (result.status) {
        case 401:
          setError(true);
          setMessage("Wrong code!");
          break;

        case null:
          setError(true);
          setMessage("Unable to communicate with our servers!");
          break;

        default:
          setError(true);
          setMessage("Unexpected error!");
          break;
      }
    } catch (err) {
      setError(true);
      setMessage("Unexpected error!");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Container
        fluid
        className="w-100 d-flex align-items-center justify-content-center"
      >
        <Spinner animation="border" role="status" variant="primary"></Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-start"
      >
        <p>{message}</p>
        <Button onClick={() => setError(false)}>Retry</Button>
      </Container>
    );
  }

  if (okTOTP) {
    return (
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-start"
      >
        <p>{`TOTP verified!`}</p>
      </Container>
    );
  }

  if (!okTOTP) {
    return (
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Form.Group className="mb-3">
          <Form.Label>TOTP code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter code"
            required
            onChange={(e) => setCode(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

export default TOTPForm;
