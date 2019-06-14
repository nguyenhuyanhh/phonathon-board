import AboutModal from "./AboutModal";
import Clock from "./Clock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Nav from "react-bootstrap/Nav";
import NavLink from "react-bootstrap/NavLink";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import { faSync } from "@fortawesome/free-solid-svg-icons";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { buildNo: "unknown" };
  }

  componentDidMount() {
    const initSHA = "dabfd3352d2779b94fd01048d334b0c4d8c91c96";
    fetch(
      "https://api.github.com/repos/nguyenhuyanhh/phonathon-board/git/refs/heads/master"
    )
      .then(res => res.json())
      .then(
        results => {
          let url =
            "https://api.github.com/repos/nguyenhuyanhh/phonathon-board/compare/" +
            initSHA +
            "..." +
            results["object"]["sha"];
          fetch(url)
            .then(res => res.json())
            .then(
              results => {
                this.setState({
                  buildNo: (results["total_commits"] + 1).toString()
                });
              },
              () => {
                return;
              }
            );
        },
        () => {
          return;
        }
      );
  }

  render() {
    const { buildNo } = this.state;
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
          <AboutModal buildNo={buildNo} />
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
