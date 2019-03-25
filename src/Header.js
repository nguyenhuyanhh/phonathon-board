import AboutModal from "./AboutModal";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import React from "react";

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" defaultExpanded>
      <Navbar.Brand>Phonathon Management System</Navbar.Brand>
      <Nav className="ml-auto">
        <NavDropdown title="Dropdown" id="header-dropdown" alignRight>
          <NavDropdown.Item>Refresh</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item>
            <AboutModal />
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
};

export default Header;
