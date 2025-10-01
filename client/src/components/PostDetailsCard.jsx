import { Card, Row, Col, Image, Button } from "react-bootstrap";
import { getIdenticon, formatTimestamp } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import WithPopover from "./common/WithPopover";
import { deletePost } from "../services/post.service";
import { ErrorCodes } from "../constants/errors";
import { ToastsContext } from "../contexts/ToastsContext";
import { ERROR_MESSAGES } from "../constants/errors";

const PostCardContainer = ({ post }) => {
  const { user, setAuthenticated, okTOTP } = useContext(AuthContext);
  const { enqueue } = useContext(ToastsContext);
  const navigate = useNavigate();

  const handleDelete = async (post) => {
    const result = await deletePost(post.id);

    if (result.ok) {
      enqueue({
        title: "Info",
        message: "Post deleted!",
        variant: "light",
        delay: 3000,
      });
      navigate("/");
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
        message: ERROR_MESSAGES[ErrorCodes.DELETING_POST],
        variant: "danger",
        delay: 3000,
      });
    }
  };

  const canDelete =
    user && (user.username == post.author || (user.is_admin && okTOTP));

  return (
    <PostDetailsCard
      post={post}
      canDelete={canDelete}
      onDelete={handleDelete}
    ></PostDetailsCard>
  );
};

const PostDetailsCard = ({ post, canDelete, onDelete }) => {
  return (
    <Card
      as="article"
      className="shadow-sm border-secondary-subtle my-4 w-100 p-4 position-relative"
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <Row className="align-items-center flex-grow-1">
            <Col xs="auto">
              <Image
                src={getIdenticon(post.author)}
                roundedCircle
                width={60}
                height={60}
                alt="avatar"
              />
            </Col>
            <Col>
              <h5 className="mb-0">{post.author}</h5>
              <small className="text-muted">
                {formatTimestamp(post.pub_timestamp)}
              </small>
            </Col>
          </Row>
          {canDelete ? (
            <WithPopover
              props={{
                trigger: "click",
                popoverTitle: "Destructive action",
                popoverBody: (
                  <div>
                    <p>
                      Are you sure you want to delete this post? All related
                      comments will be deleted too.
                    </p>
                    <div className="d-flex justify-content-start">
                      <Button
                        variant="outline-danger"
                        onClick={() => onDelete(post)}
                      >
                        <i className="bi bi-trash-fill"></i>
                        <span className="d-none d-md-inline ms-1">Delete</span>
                      </Button>
                    </div>
                  </div>
                ),
              }}
            >
              <Button variant="danger" className="ms-3">
                <i className="bi bi-trash-fill text-white"></i>
                <span className="d-none d-md-inline ms-1">Delete</span>
              </Button>
            </WithPopover>
          ) : (
            <></>
          )}
        </div>
        <Card.Text
          className="fs-5"
          style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}
        >
          {post.text}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PostCardContainer;
