import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import NavLink from "react-bootstrap/NavLink";
import PropType from "prop-types";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const Link = props => (
  <a href={props.href} target="_blank" rel="noreferrer noopener">
    {props.name}
  </a>
);

Link.propTypes = {
  href: PropType.string.isRequired,
  name: PropType.string.isRequired
};

const AboutModal = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <NavLink onClick={() => setShow(true)}>
        <FontAwesomeIcon icon={faInfoCircle} />
      </NavLink>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>About Phonathon Management System</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Build #</div>
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
};

export default AboutModal;
