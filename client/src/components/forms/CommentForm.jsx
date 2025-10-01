import { useState, useContext } from "react";
import { Form, Button, Card, Alert, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastsContext } from "../../contexts/ToastsContext";
import { Comment } from "../../models/comment.model";
import { addComment, editComment } from "../../services/comment.service";
import { ERROR_MESSAGES, ErrorCodes } from "../../constants/errors";

const CommentForm = ({
  setStale,
  placeholder,
  shouldDiscard,
  onDiscard,
  postId,
  editMode,
  commentId,
}) => {
  const { user, setAuthenticated } = useContext(AuthContext);
  const { enqueue } = useContext(ToastsContext);
  const [text, setText] = useState(placeholder || "");
  const [error, setError] = useState("");
  const [textTouched, setTextTouched] = useState(false);

  const isEmptyOrWhitespace = (value) => !value || !value.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isTextInvalid = isEmptyOrWhitespace(text);

    if (isTextInvalid) {
      setTextTouched(true);
      setError("Please fill out the comment text.");
      return;
    }

    setError("");

    let result;
    if (editMode) {
      result = await editComment(commentId, text);
      onDiscard();
    } else {
      const comment = new Comment(postId, text);
      result = await addComment(comment);
    }

    if (result.ok) {
      if (editMode) {
        enqueue({
          title: "Info",
          message: "Comment edited!",
          variant: "light",
          delay: 3000,
        });
      } else {
        enqueue({
          title: "Info",
          message: "Comment created!",
          variant: "light",
          delay: 3000,
        });
      }
    } else if (result.status === 401 && user) {
      enqueue({
        title: "Error",
        message: "Your session is expired.",
        variant: "danger",
        delay: 3000,
      });
      setAuthenticated(false);
    } else if (result.error) {
      enqueue({
        title: "Error",
        message: ERROR_MESSAGES[result.error],
        variant: "danger",
        delay: 3000,
      });
    } else {
      enqueue({
        title: "Error",
        message:
          ERROR_MESSAGES[
            editMode ? ErrorCodes.EDITING_COMMENT : ErrorCodes.ADDING_COMMENT
          ],
        variant: "danger",
        delay: 3000,
      });
    }

    // trigger refresh
    setStale(true);
    // Reset
    setText("");
    setTextTouched(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-4" controlId="text">
        {/* <Form.Label>Comment text *</Form.Label> */}
        <Form.Control
          as="textarea"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setTextTouched(true)}
          placeholder={placeholder ? "" : "Write your comment here..."}
          isInvalid={textTouched && isEmptyOrWhitespace(text)}
        />
        <Form.Control.Feedback type="invalid">
          Comment text is required.
        </Form.Control.Feedback>
      </Form.Group>

      <Row className="align-items-center justify-content-end">
        {/* Error message */}
        <Col xs="auto">
          {error && (
            <Alert variant="danger" className="mb-0">
              {error}
            </Alert>
          )}
        </Col>

        {/* Submit + Discard + Anonymous Warning */}
        <Col xs="auto" className="d-flex align-items-center gap-3 p-0">
          {shouldDiscard && (
            <Button variant="secondary" onClick={onDiscard}>
              Discard
            </Button>
          )}

          {!user && (
            <Alert variant="light" className="mb-0">
              Note: you're writing as anonymous.
            </Alert>
          )}

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CommentForm;
