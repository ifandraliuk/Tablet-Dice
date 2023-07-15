
import React, { useState } from "react";

function CompanionPopup({ companion, setOnPopup, companionOnClick }) {
  const [name, setName] = useState("");

  return (
    <div className="blur-bg">
      <div className="popup border ">
        <div className="row ">
          <div className="col-auto ms-auto">
            <button
              onClick={() => {
                setOnPopup((onPopup) => !onPopup);
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
        <p className="text-align-center p-3 ">
          {`Du hast erfolgreich das Zurtrauen eines Begleiters "${companion.name}" gewonnen.`}
        </p>
        <div className="row">
          <div className="col-auto ms-auto me-auto">
           Name: <input
              id="amount"
              name="name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              defaultValue=""
            />            
             <button className="btn-light" onClick={() => companionOnClick(name)}>Zähmen</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanionPopup;
