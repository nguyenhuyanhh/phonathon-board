import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "./Link";
import Modal from "react-bootstrap/Modal";
import NavLink from "react-bootstrap/NavLink";
import PropType from "prop-types";
import React from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

class AboutModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  render() {
    return (
      <>
        <NavLink onClick={() => this.setState({ show: true })}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </NavLink>
        <Modal
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>About Phonathon Management System</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Build {this.props.buildNo}</div>
            <div>(c) Nguyen Huy Anh, 2019</div>
            <div>
              {"Made using "}
              <Link href="https://github.com/jsoma/tabletop" name="Tabletop" />
              {", "}
              <Link href="https://getbootstrap.com/" name="Bootstrap 4" />
              {" and "}
              <Link href="https://fontawesome.com/" name="Font Awesome 5" />.
            </div>
            <div>
              {"Source code on "}
              <Link
                href="https://github.com/nguyenhuyanhh/phonathon-management-system"
                name="GitHub"
              />
              .
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

AboutModal.propTypes = {
  buildNo: PropType.string
};

export default AboutModal;
