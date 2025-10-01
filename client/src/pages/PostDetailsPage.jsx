import usePost from "../hooks/usePost";
import PageCentered from "../layouts/PageCentered";
import { Alert, Spinner } from "react-bootstrap";
import { Container, Button, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import TitledPage from "../layouts/TitledPage";
import BackButton from "../components/common/BackButton";
import PostDetailsCard from "../components/PostDetailsCard";
import CommentForm from "../components/forms/CommentForm";
import useComments from "../hooks/useComments";
import { useState } from "react";
import CommentsCardListContainer from "../components/CommentsCardList";

const PostDetailsPage = ({ children, post }) => {
  return (
    <TitledPage title={post ? post.title : ""} titleButton={<BackButton />}>
      {children}
    </TitledPage>
  );
};

const PostDetailsPageContainer = () => {
  const { id } = useParams();
  const { post, loading, error } = usePost(id);
  const [commentsStale, setCommentsStale] = useState(false);
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    commentsCount,
  } = useComments(id, commentsStale, setCommentsStale);
  const navigate = useNavigate();
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
          <p>There was an error loading the post.</p>
          <Button variant="primary" onClick={() => navigate("/")}>
            Go back to the list
          </Button>
        </div>
      </PageCentered>
    );
  } else if (post) {
    content = (
      <Container fluid className="p-0">
        <Row className="mb-5" as="article">
          <PostDetailsCard post={post}></PostDetailsCard>
        </Row>

        <Row xs={12} lg={10} as="section" className="mb-5">
          <span className="fs-3">Add a comment</span>
          <hr className="my-4"></hr>
          {commentsError ? (
            <Alert variant="danger" className="w-50">
              There was an error.
            </Alert>
          ) : post.max_comments !== null &&
            commentsCount >= post.max_comments ? (
            <Alert variant="warning" className="w-auto">
              No more comments are allowed for this post.
            </Alert>
          ) : (
            <CommentForm
              setStale={setCommentsStale}
              postId={id}
              editMode={false}
            />
          )}
        </Row>

        <Row xs={12} lg={10}>
          <span className="fs-3">{`Comments (${
            commentsCount !== null ? commentsCount : "?"
          }${
            post.max_comments !== null ? "/" + post.max_comments + " max" : ""
          })`}</span>
          <hr className="my-4"></hr>
          <CommentsCardListContainer
            comments={comments}
            loading={commentsLoading}
            error={commentsError}
            setStale={setCommentsStale}
          />
        </Row>
      </Container>
    );
  }

  return <PostDetailsPage post={post}>{content}</PostDetailsPage>;
};

export default PostDetailsPageContainer;
