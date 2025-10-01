import { Container, Row, Col } from "react-bootstrap";

const NoAuth = () => {
  return (
    <Container
      fluid
      className="d-flex vh-100 justify-content-center align-items-center"
    >
      <Row className="text-center">
        <Col>
          <h1 className="display-1 mb-3">401</h1>
          <h2 className="mb-4">Unauthenticated</h2>
          <p className="mb-4">
            Sorry, the page you're looking for is only available to authenticated users.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default NoAuth;
