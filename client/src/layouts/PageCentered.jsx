import { Container } from "react-bootstrap";

const PageCentered = ({ children }) => {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      {children}
    </Container>
  );
};

export default PageCentered;
