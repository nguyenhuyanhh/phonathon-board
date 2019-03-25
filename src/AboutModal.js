import React, { useState } from "react";

import Modal from "react-bootstrap/Modal";
import NavItem from "react-bootstrap/NavItem";

const AboutModal = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <NavItem onClick={() => setShow(true)}>About</NavItem>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>About Phonathon Management System</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Build #</div>
          <div>(c) Nguyen Huy Anh, 2019</div>
          <div>
            {"Made using "}
            <a
              href="https://github.com/jsoma/tabletop"
              target="_blank"
              rel="noreferrer noopener"
            >
              Tabletop
            </a>
            {", "}
            <a
              href="https://getbootstrap.com/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Bootstrap 4
            </a>
            {" and "}
            <a
              href="https://fontawesome.com/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Font Awesome 5
            </a>
            .
          </div>
          <div>
            {"Source code on "}
            <a
              href="https://github.com/nguyenhuyanhh/phonathon-management-system"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </a>
            .
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AboutModal;
