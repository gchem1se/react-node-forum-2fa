import { useContext } from "react";
import PageCentered from "../layouts/PageCentered";
import { Spinner } from "react-bootstrap";
import { ListGroup, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import CommentCardContainer from "./CommentCard";

const CommentsCardList = ({ comments, setStale }) => {
  return (
    <Col>
      <Row>
        <ListGroup as="ul" className="w-100 p-0">
          {comments.toArray().map((item) => (
            <ListGroup.Item
              key={item.id}
              className="p-0 my-0 border-0 bg-light bg-gradient"
            >
              <CommentCardContainer comment={item} setStale={setStale} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Row>
    </Col>
  );
};

const CommentsCardListContainer = ({ comments, loading, error, setStale }) => {
  const { user } = useContext(AuthContext);

  let content;

  if (loading) {
    content = (
      <PageCentered>
        <Spinner animation="border" role="status" variant="primary"></Spinner>
      </PageCentered>
    );
  } else if (error) {
    content = (
      <PageCentered>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <p>There was an error loading the comments.</p>
          <Button variant="primary" onClick={() => setStale(true)}>
            Retry
          </Button>
        </div>
      </PageCentered>
    );
  } else if (comments) {
    content = (
      <Container fluid>
        {!user ? (
          <Row xs="auto">
            <Alert variant="warning" className="mb-5">
              Note: you must be authenticated to read comments of non-anonymous
              authors.
            </Alert>
          </Row>
        ) : (
          <></>
        )}
        <Row className="mb-5">
          {comments.length() === 0 ? (
            <p>No comments to see.</p>
          ) : (
            <CommentsCardList
              comments={comments}
              setStale={setStale}
            ></CommentsCardList>
          )}
        </Row>
      </Container>
    );
  }

  return content;
};

export default CommentsCardListContainer;
