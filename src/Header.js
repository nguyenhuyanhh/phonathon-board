import AboutModal from "./AboutModal";
import Clock from "./Clock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Nav from "react-bootstrap/Nav";
import NavLink from "react-bootstrap/NavLink";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import { faSync } from "@fortawesome/free-solid-svg-icons";

class Header extends React.Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark" defaultExpanded>
        <Navbar.Brand>Phonathon Management System</Navbar.Brand>
        <Navbar.Text>
          <Clock />
        </Navbar.Text>
        <Nav className="ml-auto">
          <NavLink>
            <FontAwesomeIcon icon={faSync} />
          </NavLink>
          <AboutModal buildNo={50}/>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
