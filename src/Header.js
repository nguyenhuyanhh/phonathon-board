import AboutModal from "./AboutModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Nav from "react-bootstrap/Nav";
import NavLink from "react-bootstrap/NavLink";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import { faSync } from "@fortawesome/free-solid-svg-icons";

const Header = () => (
  <Navbar bg="dark" variant="dark" defaultExpanded>
    <Navbar.Brand>Phonathon Management System</Navbar.Brand>
    <Nav className="ml-auto">
      <NavLink>
        <FontAwesomeIcon icon={faSync} />
      </NavLink>
      <AboutModal />
    </Nav>
  </Navbar>
);

export default Header;
