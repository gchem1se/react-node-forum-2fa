import { Image, Dropdown, Badge, Container, Row } from "react-bootstrap";
import { logout } from "../services/auth.service";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import TOTPButton from "./common/TOTPButton";
import { ToastsContext } from "../contexts/ToastsContext";

const UserDropdown = () => {
  const { user, setAuthenticated, okTOTP } = useContext(AuthContext);
  const { enqueue } = useContext(ToastsContext);

  return (
    <Dropdown drop="down" align={"end"}>
      <Dropdown.Toggle variant="white">
        <span className="text-muted me-3">{user.username}</span>
        <Image src={user.getIcon()} alt="avatar" width={40} height={40} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
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
          Logout
        </Dropdown.Item>
        {!okTOTP && user && user.is_admin ? (
          <div
            className="px-3 py-2"
            onClick={(e) => e.stopPropagation()} // to not close the dropdown when user clicks on TOTPForm
            onMouseDown={(e) => e.stopPropagation()} // to not close the dropdown when user clicks on TOTPForm
          >
            <TOTPButton />
          </div>
        ) : okTOTP ? (
          <Container fluid className="my-3 w-auto mx-3">
            <Row>
              <Badge pill bg="primary">
                2FA verified
              </Badge>
            </Row>
          </Container>
        ) : (
          <></>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserDropdown;
