import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MotionButton from "../../components/MotionButton";
import {
  getProfessions,
  isProfessionComplete,
  setActiveAbility,
  setActiveProfession,
} from "../../features/creation/creationSlice";
import AbilityCard from "../../components/AbilityCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faGhost, faStar } from "@fortawesome/free-solid-svg-icons";
import "../../Styles/Attributes.css";

const categoryStyles = {
  Ausdauerklasse: { resource: "stamina", icon: faBolt },
  Manaklasse: { resource: "mana", icon: faStar },
  Spiritklasse: { resource: "spirit", icon: faGhost },
};

function Profession() {
  const dispatch = useDispatch();
  const { activeProfession, availableAbilities, activeAbility, specs, professionList, isLoading, isError, message } =
    useSelector((state) => state.creation);
  useEffect(() => {
    if (professionList.length === 0) dispatch(getProfessions());
    dispatch(isProfessionComplete());
  }, [activeProfession, professionList.length, activeAbility, dispatch]);

  const hasProfession = Boolean(activeProfession?.name);
  const categoryStyle = categoryStyles[activeProfession?.category];

  return (
    <div className="container create-profession">
      <div className="alert info">
        Du denkst zurück an deine Ausbildung und all die Übungsstunden. Wie hast du dich spezialisiert?
      </div>
      <h3>Deine Profession</h3>
      <p className="create-section-hint">Wähle eine Profession, um ihre Beschreibung und Fertigkeiten zu entdecken.</p>
      {isLoading && professionList.length === 0 && <p role="status">Professionen werden geladen …</p>}
      {isError && professionList.length === 0 && !isLoading && (
        <div className="create-attributes__error" role="alert">
          Professionen konnten nicht geladen werden: {message || "Bitte versuche es erneut."}{" "}
          <button type="button" className="btn-light" onClick={() => dispatch(getProfessions())}>Erneut versuchen</button>
        </div>
      )}
      <div className="create-profession__choices" aria-label="Profession auswählen">
        {professionList.map((profession) => (
          <MotionButton
            key={profession._id}
            name={profession.name}
            content={profession.name}
            className="create-choice"
            ariaPressed={activeProfession._id === profession._id}
            hoverScale={1}
            onClick={() => {
              if (activeProfession._id !== profession._id) dispatch(setActiveProfession(profession));
            }}
          />
        ))}
      </div>

      {hasProfession && (
        <section className="create-profession__details" aria-labelledby="create-profession-name">
          <img alt="" src={`/classes_img/${activeProfession._id}.svg`} />
          <div>
            <h4 id="create-profession-name">{activeProfession.name}</h4>
            <p>{activeProfession.description}</p>
            <dl className="create-profession__facts">
              <div>
                <dt>Kategorie</dt>
                <dd>
                  <span className={`create-profession__category${categoryStyle ? ` create-profession__category--${categoryStyle.resource}` : ""}`}>
                    {categoryStyle && <FontAwesomeIcon icon={categoryStyle.icon} aria-hidden="true" />}
                    {activeProfession.category}
                  </span>
                </dd>
              </div>
              <div><dt>Spezialisierungen</dt><dd>{specs.join(", ")}</dd></div>
              <div className="create-profession__advantages"><dt>Vorteile</dt><dd>{activeProfession.advantages}</dd></div>
            </dl>
          </div>
        </section>
      )}

      <section className="create-abilities" aria-labelledby="create-abilities-title">
        <div className="attribute-heading create-ability-heading">
          <h4 id="create-abilities-title">Fertigkeiten</h4>
          {!activeAbility && (
            <span className="attribute-points" role="status">
              <span className="attribute-points__icon" aria-hidden="true">!</span>
              Wähle deine erste Fertigkeit
            </span>
          )}
        </div>
        {!hasProfession ? (
          <p className="create-section-hint">Wähle zuerst eine Profession, um ihre verfügbaren Fertigkeiten zu sehen.</p>
        ) : availableAbilities.length === 0 ? (
          <p className="create-section-hint">Für diese Profession sind keine ersten Fertigkeiten verfügbar.</p>
        ) : (
          <div className="create-abilities__grid">
            {availableAbilities.map((ability) => (
              <AbilityCard
                key={ability._id}
                ability={ability}
                userclass={activeProfession._id}
                buttonText={activeAbility === ability._id ? "Ausgewählt" : "Wählen"}
                selected={activeAbility === ability._id}
                selectionLabel={`${ability.name} ${activeAbility === ability._id ? "ausgewählt" : "wählen"}`}
                customClick={(event) => dispatch(setActiveAbility(event.currentTarget.name))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Profession;
