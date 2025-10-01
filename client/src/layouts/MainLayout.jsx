import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Container, Image } from "react-bootstrap";
import PageCentered from "./PageCentered";
import banner from "../assets/banner.jpg";

const MainLayout = ({ children }) => {
  return (
    <div className="bg-light bg-gradient">
      <Navbar />
      <Image
        src={banner}
        className="object-fit-cover w-100 mb-5"
        style={{ height: "210px", objectPosition: "50% 32%" }}
      />
      {children}
    </div>
  );
};

export default MainLayout;
