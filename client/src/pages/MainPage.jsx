import React, { useContext, useState } from "react";
import usePosts from "../hooks/usePosts";
import PageCentered from "../layouts/PageCentered";
import { Spinner } from "react-bootstrap";
import PostHomeCardList from "../components/PostHomeCardList";
import { Container, Button } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import TitledPage from "../layouts/TitledPage";
import { useNavigate } from "react-router-dom";
import UserFloating from "../components/UserFloating";
import WithPopover from "../components/common/WithPopover";

const MainPage = ({ children }) => {
  const { authenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <TitledPage
      titleButton={
        authenticated ? (
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate("/posts/new")}
            className=" text-nowrap"
          >
            <i className="bi bi-plus me-2"></i>
            <span>New post</span>
          </Button>
        ) : (
          <WithPopover
            props={{
              trigger: ["hover", "focus", "click"],
              popoverTitle: "Login required",
              popoverBody: "Only authenticated users can add new posts.",
            }}
          >
            <Button size="lg" variant="primary" disabled>
              <i className="bi bi-plus me-2"></i>
              <span>New post</span>
            </Button>
          </WithPopover>
        )
      }
      title="All posts"
      aside={<UserFloating />}
    >
      {children}
    </TitledPage>
  );
};

const MainPageContainer = () => {
  const [stale, setStale] = useState(false);
  const { posts, loading, error } = usePosts(stale, setStale);

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
          <p>There was an error fetching posts.</p>
          <Button variant="primary" onClick={() => setStale(true)}>
            Retry
          </Button>
        </div>
      </PageCentered>
    );
  } else {
    content = (
      <Container fluid className="d-flex justify-content-start vh-100">
        {posts.length() === 0 ? (
          <p>No posts to see.</p>
        ) : (
          <PostHomeCardList posts={posts} />
        )}
      </Container>
    );
  }

  return <MainPage>{content}</MainPage>;
};

export default MainPageContainer;
