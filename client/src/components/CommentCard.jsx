import anonymous from "../assets/anonymous.png";
import { Card, Row, Col, Image, Badge, Button } from "react-bootstrap";
import { getIdenticon, formatTimestamp } from "../utils/utils";
import CommentForm from "./forms/CommentForm";
import { useState, useContext } from "react";
import useInterestingFlagsN from "../hooks/useInterestingFlagsN";
import {
  addInterestingFlag,
  deleteComment,
  removeInterestingFlag,
} from "../services/comment.service";
import { AuthContext } from "../contexts/AuthContext";
import WithPopover from "./common/WithPopover";
import { ErrorCodes } from "../constants/errors";
import { ToastsContext } from "../contexts/ToastsContext";
import { ERROR_MESSAGES } from "../constants/errors";

const CommentCardContainer = ({ comment, setStale }) => {
  const { user, okTOTP, setAuthenticated } = useContext(AuthContext);
  const { enqueue } = useContext(ToastsContext);

  const [marked, setMarked] = useState(comment.marked);
  const { interestingFlagsN } = useInterestingFlagsN(
    comment.id,
    marked,
    user && comment.author === user.username
  );

  const handleDelete = async (comment) => {
    const result = await deleteComment(comment.id);

    if (result.ok) {
      enqueue({
        title: "Info",
        message: "Comment deleted!",
        variant: "light",
        delay: 3000,
      });
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
        message: ERROR_MESSAGES[ErrorCodes.DELETING_COMMENT],
        variant: "danger",
        delay: 3000,
      });
    }

    setStale(true);
  };

  const handleMarkInteresting = async (comment) => {
    const action = marked ? removeInterestingFlag : addInterestingFlag;

    const result = await action(comment.id);

    if (result.ok) {
      setMarked((old) => !old);
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
        message: ERROR_MESSAGES[ErrorCodes.ADDING_INTERESTING_FLAG],
        variant: "danger",
        delay: 3000,
      });
    }
  };

  return (
    <CommentCard
      comment={comment}
      marked={marked}
      onMarkInteresting={handleMarkInteresting}
      onDelete={handleDelete}
      setStale={setStale}
      canMark={user !== null}
      showActions={
        user
          ? (user.is_admin && okTOTP) || user.username === comment.author
          : false
      }
      interestingFlagsN={interestingFlagsN}
    ></CommentCard>
  );
};

const CommentCard = ({
  comment,
  marked,
  canMark,
  showActions,
  setStale,
  onMarkInteresting,
  onDelete,
  interestingFlagsN,
}) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <Row className="align-items-start mb-4">
      {/* Main Card */}
      <Col xs={11}>
        <Card
          as="article"
          tabIndex={0}
          className="shadow-sm border-secondary-subtle w-100"
        >
          <Card.Body>
            <Row>
              {/* Avatar */}
              <Col xs={1} className="m-0 p-0">
                <Row className="align-items-center justify-content-center text-center">
                  <Image
                    className="w-auto p-0 m-0"
                    src={
                      comment.author ? getIdenticon(comment.author) : anonymous
                    }
                    roundedCircle
                    alt="avatar"
                    width={40}
                    height={40}
                  />
                  <span className="text-muted">{comment.author}</span>
                </Row>
              </Col>

              {/* Text Content */}
              <Col as="main" className="w-100">
                {editMode ? (
                  <CommentForm
                    setStale={setStale}
                    placeholder={comment.text}
                    commentId={comment.id}
                    shouldDiscard={true}
                    onDiscard={() => {
                      setEditMode(false);
                    }}
                    postId={comment.post_id}
                    editMode={true}
                  />
                ) : (
                  <Card.Text
                    className="mb-0 fs-5"
                    style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}
                  >
                    {comment.text}
                  </Card.Text>
                )}
              </Col>

              {/* Timestamp */}
              <Col xs="auto" className="m-3 mt-0">
                <Row className="mt-2">
                  <Badge className="text-end bg-light text-muted fw-medium">
                    <span>{formatTimestamp(comment.pub_timestamp)}</span>
                    <i className="bi bi-clock-fill text-muted ms-2"></i>
                  </Badge>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      {/* Floating Button Column */}
      <Col xs={1} className="d-flex flex-column align-items-start gap-2">
        {/* Combine button and label horizontally */}
        {canMark ? (
          <div className="d-flex align-items-center gap-1">
            <Button
              variant={marked ? "primary" : "outline-primary"}
              size="sm"
              onClick={async () => await onMarkInteresting(comment)}
            >
              <i className="bi bi-star-fill"></i>
              {interestingFlagsN ? (
                <span className="d-none d-md-inline ms-1">
                  {interestingFlagsN}
                </span>
              ) : (
                <></>
              )}
            </Button>
          </div>
        ) : (
          <></>
        )}
        {showActions ? (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditMode(true)}
              className=" text-nowrap"
            >
              <i className="bi bi-pencil-fill text-white"></i>
              <span className="d-none d-md-inline ms-1">Edit</span>
            </Button>
            <WithPopover
              props={{
                trigger: "click",
                popoverTitle: "Destructive action",
                popoverBody: (
                  <div>
                    <p>Are you sure you want to delete this comment?</p>
                    <div className="d-flex justify-content-start">
                      <Button
                        variant="outline-danger"
                        onClick={() => onDelete(comment)}
                        className=" text-nowrap"
                      >
                        <i className="bi bi-trash-fill"></i>
                        <span className="d-none d-md-inline ms-1">Delete</span>
                      </Button>
                    </div>
                  </div>
                ),
              }}
            >
              <Button variant="danger" size="sm" className=" text-nowrap">
                <i className="bi bi-trash-fill text-white"></i>
                <span className="d-none d-md-inline ms-1">Delete</span>
              </Button>
            </WithPopover>
          </>
        ) : (
          <></>
        )}
      </Col>
    </Row>
  );
};

export default CommentCardContainer;
