import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faRefresh} from '@fortawesome/free-solid-svg-icons'

function MathButtonGroup({
  add,
  subtract,
  onReset,
  className = "",
  labels = {},
  resetIcon = faRefresh,
}) {
  const addLabel = labels.add ?? "Wert erhöhen";
  const subtractLabel = labels.subtract ?? "Wert verringern";
  const resetLabel = labels.reset ?? "Werte zurücksetzen";

  return (
    <div className={`button-group ${className}`.trim()}>
      <button type="button" id="increase" className="btn-save" onClick={add} aria-label={addLabel} title={addLabel}>
        <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
      </button>
      <button type="button" id="decrease" className="btn-edit" onClick={subtract} aria-label={subtractLabel} title={subtractLabel}>
        <FontAwesomeIcon icon={faMinus} aria-hidden="true" />
      </button>
      <button type="button" className="btn-remove" onClick={onReset} aria-label={resetLabel} title={resetLabel}>
        <FontAwesomeIcon icon={resetIcon} aria-hidden="true" />
      </button>
    </div>
  );
}

export default MathButtonGroup;
