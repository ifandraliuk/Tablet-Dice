import React, { useState } from "react";
import { useSelector } from "react-redux";

const CreateWindow = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({ name: "", pwd: "", check: "" });
  const { isError, isSuccess, message } = useSelector((state) => state.auth);
  const infoError = useSelector((state) => state.creation.isError);
  const infoMessage = useSelector((state) => state.creation.message);
  const { name, pwd, check } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <div className="blur-bg">
      <div className="popup border ">
        <div className="rowd-flex align-items-center justify-content-center">
          <div className="col-auto  text-center">
            <h4>Namensgebung</h4>
          </div>
          {isError && (
            <div className="row">
              <div className="alert error">{message}</div>
            </div>
          )}
          {infoError && (
            <div className="row">
              <div className="alert error">{infoMessage}</div>
            </div>
          )}
          {isSuccess && (
            <div className="row">
              <div className="alert info">{message}</div>
            </div>
          )}
        </div>
        <form className="border-pattern top">
          <div className="row mt-3">
            <label for="name">
              Name<span class="required-asterisk">*</span>
            </label>{" "}
          </div>
          <div className="row ms-2">
            <input
              className="Thornheim-text"
              type="text"
              id="name"
              value={name}
              required
              autoFocus
              onChange={onChange}
            ></input>
          </div>
          <div className="row mt-3">
            <label for="pwd">
              Passwort<span class="required-asterisk">*</span>
            </label>{" "}
          </div>
          <div className="row ms-2">
            <input
              className="Thornheim-text"
              type="password"
              id="pwd"
              value={pwd}
              required
              onChange={onChange}
            ></input>
          </div>
          <div className="row mt-3">
            <label for="check">
              Passwort wiederholen<span class="required-asterisk">*</span>
            </label>{" "}
          </div>
          <div className="row ms-2">
            <input
              className="Thornheim-text"
              type="password"
              id="check"
              value={check}
              required
              onChange={onChange}
            ></input>
          </div>

          <div className="row mt-2 ">
            <div className="col-6">
              <button
                onClick={(e) => onSubmit(e, formData)}
                type="submit"
                className="btn-light"
              >
                Bestätigen
              </button>
            </div>
            <div className="col-6">
              <button className="btn-light" onClick={onClose}>
                Abbrechen
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateWindow;
