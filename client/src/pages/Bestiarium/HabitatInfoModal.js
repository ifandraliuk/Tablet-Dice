import React from "react";
import { Modal } from "react-bootstrap";

function HabitatInfoModal({ habitat, onHide }) {
  return (
    <Modal
      show
      onHide={onHide}
      centered
      size="lg"
      className="bestiarium-habitat-modal"
      aria-labelledby="bestiarium-habitat-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="bestiarium-habitat-title">{habitat.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="bestiarium-habitat-modal__content">
          {habitat.kingdomName && (
            <img
              className="bestiarium-habitat-modal__image"
              src={`/habitat/${encodeURIComponent(habitat.kingdomName)}/${habitat._id}.png`}
              alt={habitat.name}
            />
          )}
          <p>{habitat.description}</p>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default HabitatInfoModal;
