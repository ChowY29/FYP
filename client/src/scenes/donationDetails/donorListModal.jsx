import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import moment from "moment"; // Make sure moment is imported for date formatting

const DonorListModal = ({ show, handleClose, donors, title }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Donations ({donors.length})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          {donors.map((donor, index) => (
            <ListGroup.Item key={index} className="mb-2">
              <div className="d-flex align-items-center">
                <i className="fa fa-user mr-2" />
                <strong>{donor.name}</strong>
              </div>
              <div className="d-flex align-items-center">
                <i className="fa fa-dollar-sign mr-2" />
                <em>RM {donor.amount} • {moment(donor.timestamp).fromNow()}</em>
              </div>
              <p>{donor.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DonorListModal;
