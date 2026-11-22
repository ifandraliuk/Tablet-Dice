import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getOriginAccentStyle } from "../../data/OriginColors";
import "../../Styles/ThemedModal.css";

const CreateWindow = ({ onSubmit, onClose, origin }) => {
  const [formData, setFormData] = useState({ name: "", pwd: "", check: "" });
  const { isError, isSuccess, message } = useSelector((state) => state.auth);
  const { isError: infoError, message: infoMessage } = useSelector((state) => state.creation);
  const onChange = (event) => {
    setFormData((previous) => ({ ...previous, [event.target.id]: event.target.value }));
  };

  return (
    <Modal show onHide={onClose} centered className="themed-modal create-modal" style={origin ? getOriginAccentStyle(origin) : { "--diary-origin-color": "#f5f0e3", "--diary-origin-border": "rgba(245, 240, 227, 0.3)" }} aria-labelledby="create-modal-title">
      <Modal.Header closeButton closeLabel="Schließen"><Modal.Title id="create-modal-title">Namensgebung</Modal.Title></Modal.Header>
      <form onSubmit={(event) => onSubmit(event, formData)}>
        <Modal.Body>
          {isError && <p className="create-modal__error" role="alert">{message}</p>}
          {infoError && <p className="create-modal__error" role="alert">{infoMessage}</p>}
          {isSuccess && <p role="status">{message}</p>}
          <div className="create-modal__fields">
            <label htmlFor="name">Name <span className="required-asterisk">*</span></label>
            <input id="name" type="text" value={formData.name} required autoFocus autoComplete="username" onChange={onChange} />
            <label htmlFor="pwd">Passwort <span className="required-asterisk">*</span></label>
            <input id="pwd" type="password" value={formData.pwd} required autoComplete="new-password" onChange={onChange} />
            <label htmlFor="check">Passwort wiederholen <span className="required-asterisk">*</span></label>
            <input id="check" type="password" value={formData.check} required autoComplete="new-password" onChange={onChange} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="create-modal__button" onClick={onClose}>Abbrechen</button>
          <button type="submit" className="create-modal__button create-modal__button--primary">Bestätigen</button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CreateWindow;
