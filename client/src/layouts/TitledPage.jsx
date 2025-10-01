import { Row, Col, Container } from "react-bootstrap";

const TitledPage = ({ title, titleButton, children }) => {
  // note that it cannot be a Layout using Outlet because i need to inject more than one component, so <Outlet /> is not enough

  return (
    <Container fluid className="ps-1 pe-1 ps-md-5 pe-md-5">
      <Row>
        <Col className="d-flex flex-column justify-content-center display-6 p-0">
          <span className="fw-normal">{title}</span>
        </Col>

        <Col
          xs={4}
          className="d-flex justify-content-end align-items-start p-0"
        >
          {titleButton}
        </Col>
        <hr className="my-4" />
      </Row>
      <Row>{children}</Row>
    </Container>
  );
};

export default TitledPage;
