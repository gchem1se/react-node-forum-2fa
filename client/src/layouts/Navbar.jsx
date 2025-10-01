import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navvbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import config from "../constants/config";
import LoginButton from "../components/common/LoginButton";
import UserDropdown from "../components/UserDropdown";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import TOTPModal from "../components/common/TOTPModal";

function Navbar() {
  const { user, promptedForTOTP, setPromptedForTOTP } = useContext(AuthContext);

  return (
    <Navvbar expand="lg" className="bg-white">
      <Container fluid className="p-3 d-flex justify-content-between">
        <div className="d-flex align-items-center justify-content-start">
          <Navvbar.Brand>{config.app_name}</Navvbar.Brand>
          <Nav className="me-3 my-2 my-lg-0" navbarScroll>
            <NavLink to="/">Home</NavLink>
          </Nav>
          {/* {user ? (
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <NavLink to="/settings">Settings</NavLink>
            </Nav>
          ) : (
            <></>
          )} */}
        </div>
        <section className="me-3">
          {user ? <UserDropdown /> : <LoginButton />}
        </section>
      </Container>

      <TOTPModal
        show={!promptedForTOTP}
        setShow={() => setPromptedForTOTP(true)}
      />
    </Navvbar>
  );
}

export default Navbar;
