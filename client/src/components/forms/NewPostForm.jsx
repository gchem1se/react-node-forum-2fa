import { useState, useContext } from "react";
import { Form, Button, Card, Alert, Row, Col } from "react-bootstrap";
import { addPost } from "../../services/post.service";
import { Post } from "../../models/post.model";
import { useNavigate } from "react-router-dom";
import { ERROR_MESSAGES } from "../../constants/errors";
import { ToastsContext } from "../../contexts/ToastsContext";
import { AuthContext } from "../../contexts/AuthContext";

const NewPostForm = () => {
  const { user, setAuthenticated } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [maxComments, setMaxComments] = useState("");
  const navigate = useNavigate();
  const { enqueue } = useContext(ToastsContext);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({
    text: false,
    title: false,
  });

  const isEmptyOrWhitespace = (value) => !value || !value.trim();

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // no redirect

    const isTextEmpty = isEmptyOrWhitespace(text);
    const isTitleEmpty = isEmptyOrWhitespace(title);

    if (isTextEmpty || isTitleEmpty) {
      setTouched({ text: true, title: true });
      setError("Please fill out all required fields.");
      return;
    }

    if (maxComments && parseInt(maxComments) < 0) {
      setError("Max comments must be non-negative.");
      return;
    }

    setError("");

    const post = new Post(title, text);
    if (maxComments !== "") {
      post.setMaxComments(parseInt(maxComments));
    }

    const result = await addPost(post);
    if (result.ok) {
      navigate("/");
      enqueue({
        title: "Info",
        message: "Post created!",
        variant: "light",
        delay: 3000,
      });
    } else if (result.error) {
      setError(ERROR_MESSAGES[result.error]);
    } else {
      setError(ERROR_MESSAGES.ERR_ADDING_POST);
    }

    if (result.status === 401 && user) {
      enqueue({
        title: "Error",
        message: "Your session is expired.",
        variant: "danger",
        delay: 3000,
      });
      setAuthenticated(false);
    }

    // // Reset fields
    // setTitle("");
    // setText("");
    // setMaxComments("");
    // setTouched({ text: false, title: false });
  };

  return (
    <Card className="bg-white border-secondary-subtle">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              placeholder="Enter a unique title"
              isInvalid={touched.title && isEmptyOrWhitespace(title)}
            />
            <Form.Control.Feedback type="invalid">
              Title is required.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="text">
            <Form.Label>Text *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={handleBlur}
              placeholder="What's on your mind?"
              isInvalid={touched.text && isEmptyOrWhitespace(text)}
            />
            <Form.Control.Feedback type="invalid">
              Text is required.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="max_comments">
            <Form.Label>Max comments (optional)</Form.Label>
            <Form.Control
              type="number"
              name="max_comments"
              value={maxComments}
              onChange={(e) => setMaxComments(e.target.value)}
              placeholder="Leave blank for unlimited"
              min="0"
            />
          </Form.Group>

          <Row className="align-items-center">
            <Col xs={9}>
              {error && (
                <Alert variant="danger" className="mb-0">
                  {error}
                </Alert>
              )}
            </Col>
            <Col xs={3} className="text-end">
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                size="lg"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NewPostForm;
