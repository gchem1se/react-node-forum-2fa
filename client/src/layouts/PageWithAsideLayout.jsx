import { Row, Col, Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";

const PageWithAsideLayout = ({ aside }) => {
  return (
    <MainLayout>
      <Container fluid className="px-5">
        <Row>
          <Col>
            <Outlet />
          </Col>
          <Col className="d-none d-lg-block col-lg-3 col-xl-2">{aside}</Col>
        </Row>
      </Container>
    </MainLayout>
  );
};

export default PageWithAsideLayout;
