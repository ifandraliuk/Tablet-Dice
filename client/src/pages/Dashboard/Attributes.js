import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allAttributes } from "../../data/ConstVariables";
import { updateAttribute } from "../../features/player/playerSlice";
import "../../Styles/Attributes.css";

const attributeKeys = Object.keys(allAttributes);

function Attributes() {
  const { attributes, fractionTheme, pointsLeft, attributeUpdatePending } = useSelector((state) => state.player);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const dispatch = useDispatch();
  const allocated = attributeKeys.reduce(
    (sum, key) => sum + (typeof attributes[key] === "number" ? attributes[key] : 0),
    0
  );
  const freePoints = pointsLeft - allocated;

  const increaseAttribute = async (key) => {
    if (submitting.current || attributeUpdatePending) return;
    submitting.current = true;
    setError("");
    try {
      await dispatch(updateAttribute(key)).unwrap();
    } catch (requestError) {
      setError(typeof requestError === "string" ? requestError : requestError?.message || "Attribut konnte nicht erhöht werden.");
    } finally {
      submitting.current = false;
    }
  };

  return (
    <div>
      <div className="attribute-heading">
        <h3>Attribute</h3>
        {freePoints > 0 && (
          <span className="attribute-points" role="status">
            <span className="attribute-points__icon" aria-hidden="true">!</span>
            {freePoints} {freePoints === 1 ? "Punkt" : "Punkte"} verfügbar
          </span>
        )}
      </div>
      {error && <p className="attribute-error" role="alert">{error}</p>}
      <div className="row info-div attribute-grid dashboard-attribute-grid">
        {attributeKeys.map((key) =>
          attributes[key] > 0 && (
            <div key={key} className="dashboard-attribute">
              <h6>{allAttributes[key]}</h6>
              <strong className={`${fractionTheme}-text`}>{attributes[key]}</strong>
              {freePoints > 0 && (
                <button
                  type="button"
                  className="attribute-increase"
                  onClick={() => increaseAttribute(key)}
                  disabled={attributeUpdatePending}
                  aria-label={`${allAttributes[key]} um 1 erhöhen`}
                  title={`${allAttributes[key]} um 1 erhöhen`}
                >
                  <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default React.memo(Attributes);
