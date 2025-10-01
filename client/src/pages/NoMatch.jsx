import { Container, Row, Col } from "react-bootstrap";

const NoMatch = () => {
  return (
    <Container
      fluid
      className="d-flex vh-100 justify-content-center align-items-center"
    >
      <Row className="text-center">
        <Col>
          <h1 className="display-1 mb-3">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="mb-4">
            Sorry, the page you're looking for doesn't exist.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default NoMatch;
