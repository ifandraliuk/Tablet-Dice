import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faRefresh} from '@fortawesome/free-solid-svg-icons'

function MathButtonGroup({ add, subtract, onReset, className = "" }) {
  return (
    <div className={`button-group ${className}`.trim()}>
      <button type="button" id="increase" className="btn-save" onClick={add} aria-label="Wert erhöhen">
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <button type="button" id="decrease" className="btn-edit" onClick={subtract} aria-label="Wert verringern">
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <button type="button" className="btn-remove" onClick={onReset} aria-label="Werte zurücksetzen">
        <FontAwesomeIcon icon={faRefresh} />
      </button>
    </div>
  );
}

export default MathButtonGroup;
