
import React, { useState } from "react";

function CompanionPopup({ companion, setOnPopup, companionOnClick }) {
  const [name, setName] = useState("");

  return (
    <div className="blur-bg">
      <div className="popup bestiarium-popup">
        <div className="row ">
          <div className="col-auto ms-auto">
            <button
              type="button"
              className="bestiarium-popup__close"
              aria-label="Fenster schließen"
              onClick={() => {
                setOnPopup(false);
                setName("");
              }}
            >
              X
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-auto ms-auto me-auto">
            <h3>Glückwunsch!</h3>
          </div>
        </div>
        <p className="text-center p-3">
          {`Du hast das Vertrauen von "${companion.name}" gewonnen.`}
        </p>
        <div className="bestiarium-popup__form">
            <label htmlFor="companion-name">Name:</label>
            <input
              className="bestiarium-popup__input"
              id="companion-name"
              name="name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              defaultValue=""
            />            
             <button
               type="button"
               className="bestiarium-popup__submit"
               onClick={() => companionOnClick(name)}
             >
               Zähmen
             </button>
        </div>
      </div>
    </div>
  );
}

export default CompanionPopup;
