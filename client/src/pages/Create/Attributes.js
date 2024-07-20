import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAttribute,
  resetAttributes,
} from "../../features/creation/creationSlice";
import { allAttributes, attrDescr } from "../../data/ConstVariables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faRefresh } from "@fortawesome/free-solid-svg-icons";
function Attributes() {
  const keys = Object.keys(allAttributes);
  const { availablePoints, attributes } = useSelector(
    (state) => state.creation
  );
  const dispatch = useDispatch();

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="alert info">
          Du fragst dich ob du gut vorbereitet bist für deine nächsten
          Abenteuer, denn deine Stärken und Schwächen sind:
        </div>
        <p className="ms-2">
          Du hast 70 Punkte zur Verfügung, verteile diese Punkte auf die
          folgenden Attribute. Als magische Klasse hast du das zusätzliche
          Attribut <span className="Beltamor-text">Mana</span>, als spirituelle
          Klasse das zusätzliche Attribut
          <span className="Thamor-text"> Spirituelle Kraft</span>, mit dem du
          deine Fähigkeiten einsetzen kannst. Besitzt du kein zusätzliches
          Attribut, nutzt du deine Fähigkeiten mit dem Attribut{" "}
          <span className="Ethelion-text">Ausdauer</span>. Wähle weise.
        </p>
        <div className="row mt-2">
          <div className="col-4">
            <div className="row">
              <div className="col-auto d-flex justify-content-center align-items-center">
                <h4>Freie punkte: {availablePoints}</h4>
              </div>
              <div className="col-auto">
                <button
                  className="btn-light"
                  onClick={() => dispatch(resetAttributes())}
                >
                  <FontAwesomeIcon icon={faRefresh} />
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            {keys.map((key) => (
              <div className="row" key={key}>
                <div className="row mt-3">
                  <label for={key}>
                    {key === "mana" ? (
                      <span className="Beltamor-text">
                        {allAttributes[key]}
                      </span>
                    ) : key === "spirit" ? (
                      <span className="Thamor-text">{allAttributes[key]}</span>
                    ) : key === "stamina" ? (
                      <span className="Ethelion-text">
                        {allAttributes[key]}
                      </span>
                    ) : (
                      <span>{allAttributes[key]}</span>
                    )}
                    :
                    {["vitality"].includes(key) && (
                      <span class="required-asterisk">*</span>
                    )}
                  </label>{" "}
                  <div className="row">
                    <div className="col-3 mt-2 d-flex flex-column align-items-center">
                      <div className="row">
                        <div className="col-8">
                      <input
                        className="Thornheim-text"
                        type="number"
                        id={key}
                        required={key === "vitaltiy" ? true : false}
                        value={attributes[key]}
                        onChange={(e) =>
                          dispatch(
                            setAttribute({
                              id: e.currentTarget.id,
                              value: parseInt(e.currentTarget.value),
                            })
                          )
                        }
                      ></input></div>
                      <div className="col-auto"><FontAwesomeIcon icon={faArrowRight} /></div>
                      </div>
                    </div>
                    <div className="col-9">{attrDescr[key]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attributes;
