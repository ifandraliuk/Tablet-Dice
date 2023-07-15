import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faRefresh} from '@fortawesome/free-solid-svg-icons'

function MathButtonGroup({ add, subtract, onReset }) {
  return (
    <div className="button-group">
      <button id="increase" className="btn-save" onClick={add}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <button id="decrease" className="btn-edit" onClick={subtract}>
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <button className="btn-remove" onClick={onReset}>
        <FontAwesomeIcon icon={faRefresh} />
      </button>
    </div>
  );
}

export default MathButtonGroup;
