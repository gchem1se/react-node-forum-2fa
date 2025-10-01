import { useContext } from "react";
import { Card, Container, Image, Row, Col, Badge } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import anonymous from "../assets/anonymous.png";
import { AuthContext } from "../contexts/AuthContext";
import { logout } from "../services/auth.service";
import LoginButton from "./common/LoginButton";
import TOTPButton from "./common/TOTPButton";
import { ToastsContext } from "../contexts/ToastsContext";

const UserFloating = () => {
  const { user, setAuthenticated, okTOTP } = useContext(AuthContext);
  const { enqueue } = useContext(ToastsContext);

  return (
    <Card as="aside" className="border border-secondary-subtle">
      <Container fluid>
        <Col>
          <Row
            as="section"
            id="user-floating-image"
            className="d-flex justify-content-center align-items-center px-5 pb-0 mt-4 my-1"
          >
            <Image
              src={user ? user.getIcon() : anonymous}
              roundedCircle
              alt="user-image"
              style={{ width: 75, minWidth: 75, height: 75 }}
              className="border border-secondary-subtle bg-light object-fit-cover p-2"
            />
          </Row>
          <Row className="d-flex flex-col text-center align-items-center justify-content-center mb-1">
            <p className="fs-4 fw-medium mb-1" id="user-floating-username">
              {user ? user.username : "Anonymous"}
            </p>
            <div className="text-danger fw-normal mb-0" id="user-floating-role">
              {user && user.is_admin ? (
                <Container fluid className="mb-3">
                  <Row
                    className="d-flex align-items-center justify-content-center"
                  >
                    <Badge pill bg="danger" className=" w-50">
                      Administrator
                    </Badge>
                  </Row>
                </Container>
              ) : (
                <></>
              )}
            </div>
          </Row>
          <Row>
            <hr className="my-3"></hr>
          </Row>
          {user ? (
            <Row>
              <Col className="px-3 mb-3 d-flex align-items-center justify-content-center">
                <NavLink
                  className="w-auto p-0 text-nowrap"
                  onClick={async () => {
                    await logout();
                    setAuthenticated(false);
                    enqueue({
                      title: "Logout",
                      message: `Logged out succesfully!`,
                      variant: "light",
                      delay: 3000,
                    });
                  }}
                >
                  <i className="bi bi-door-closed-fill me-2 " />
                  <span>Logout</span>
                </NavLink>
              </Col>
            </Row>
          ) : (
            <Col>
              <Row className="px-3 mb-3 d-flex align-items-center justify-content-center">
                <LoginButton xs={6} />
              </Row>
            </Col>
          )}
          {!okTOTP && user && user.is_admin ? (
            <Container fluid>
              <Row className="d-flex align-items-center justify-content-center mb-3">
                <TOTPButton />
              </Row>
            </Container>
          ) : okTOTP ? (
            <Container fluid className="mb-3">
              <Row
                className="d-flex align-items-center justify-content-center"
              >
                <Badge pill bg="primary" className=" w-50">
                  2FA verified
                </Badge>
              </Row>
            </Container>
          ) : (
            <></>
          )}
        </Col>
      </Container>
    </Card>
  );
};

export default UserFloating;
