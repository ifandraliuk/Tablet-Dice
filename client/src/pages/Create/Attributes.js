import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAttribute, resetAttributes } from "../../features/creation/creationSlice";
import { allAttributes, attrDescr } from "../../data/ConstVariables";
import "../../Styles/Attributes.css";

function Attributes() {
  const { availablePoints, totalPoints, attributes } = useSelector((state) => state.creation);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const updateAttribute = (key, rawValue) => {
    const value = rawValue === "" ? 0 : Number(rawValue);
    if (!Number.isInteger(value) || value < 0) {
      setError("Bitte gib eine ganze Zahl ab 0 ein.");
    } else if (value - attributes[key] > availablePoints) {
      setError("Du hast nicht genügend freie Punkte für diesen Wert.");
    } else {
      setError("");
      dispatch(setAttribute({ id: key, value }));
    }
  };

  return (
    <div className="container create-attributes">
      <div className="alert info">
        Du fragst dich, ob du für deine nächsten Abenteuer bereit bist. Wo liegen deine Stärken und Schwächen?
      </div>
      <div className="create-attributes__summary">
        <div>
          <h3>Punkte verteilen</h3>
          <p>Verteile alle {totalPoints} Punkte. Vitalität muss mindestens 1 betragen.</p>
        </div>
        <div className="create-attributes__actions">
          <span className="attribute-points" role="status">{availablePoints} von {totalPoints} Punkten frei</span>
          <button type="button" className="btn-light" onClick={() => { dispatch(resetAttributes()); setError(""); }}>
            Zurücksetzen
          </button>
        </div>
      </div>
      <p className="create-attributes__hint">
        Magische Klassen nutzen <span className="Beltamor-text">Mana</span>, spirituelle Klassen
        <span className="Thamor-text"> Spirituelle Kraft</span>. Ohne zusätzliches Attribut werden
        Fähigkeiten mit <span className="Ethelion-text">Ausdauer</span> eingesetzt.
      </p>
      {availablePoints === 0 && attributes.vitality === 0 && (
        <p className="create-attributes__error" role="alert">Vitalität muss mindestens 1 betragen.</p>
      )}
      {error && <p className="create-attributes__error" role="alert">{error}</p>}
      <div className="create-attributes__grid">
        {Object.keys(allAttributes).map((key) => (
          <div className="create-attribute" key={key}>
            <div className="create-attribute__heading">
              <label htmlFor={key} className={{ mana: "Beltamor-text", spirit: "Thamor-text", stamina: "Ethelion-text" }[key]}>
                {allAttributes[key]}{key === "vitality" && <span className="required-asterisk" aria-hidden="true">*</span>}
              </label>
              <div className="create-attribute__control">
                <button type="button" aria-label={`${allAttributes[key]} verringern`} disabled={attributes[key] <= 0}
                  onClick={() => updateAttribute(key, attributes[key] - 1)}>−</button>
                <input type="number" id={key} min="0" max={attributes[key] + availablePoints} step="1"
                  value={attributes[key]} required={key === "vitality"}
                  aria-describedby={`${key}-description`}
                  onChange={(event) => updateAttribute(key, event.currentTarget.value)} />
                <button type="button" aria-label={`${allAttributes[key]} erhöhen`} disabled={availablePoints === 0}
                  onClick={() => updateAttribute(key, attributes[key] + 1)}>+</button>
              </div>
            </div>
            <p id={`${key}-description`}>{attrDescr[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Attributes;
