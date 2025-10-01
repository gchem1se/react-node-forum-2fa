import { useContext, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { AuthContext } from "../../../contexts/AuthContext";
import { login } from "../../../services/auth.service";
import { ToastsContext } from "../../../contexts/ToastsContext";

function LoginForm() {
  const { enqueue } = useContext(ToastsContext);
  const [email, setEmail] = useState("alice@example.com"); // to save time at the exam
  const [password, setPassword] = useState("1234"); // to save time at the exam
  const [message, setMessage] = useState("Unexpected error!");

  const {
    setAuthenticated,
    setLoading,
    setError,
    error,
    user,
    loading,
    authenticated,
  } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(false);
      setLoading(true);
      const result = await login(email, password);

      if (result.ok) {
        setAuthenticated(true);
        setLoading(false);
        enqueue({
          title: "Login succeded",
          message: `Welcome!`,
          variant: "light",
          delay: 3000,
        });
        return;
      }

      switch (result.status) {
        case 401:
          setError(true);
          setMessage("Wrong email or password!");
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

  if (user) {
    return (
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-start"
      >
        <p>{`Welcome, ${user.username}!`}</p>
      </Container>
    );
  }

  if (!authenticated) {
    return (
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

export default LoginForm;
