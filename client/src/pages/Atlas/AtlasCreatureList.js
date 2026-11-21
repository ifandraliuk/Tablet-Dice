import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import CreatureStatus from "../../components/CreatureStatus";
import {
  getHabitatCreature,
  resetCreatures,
} from "../../features/atlas/atlasSlice";

function AtlasCreatureList({ register }) {
  const {
    activeHabitat,
    activeCreatures,
    creaturesLoading,
    creaturesError,
  } = useSelector((state) => state.atlas);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getHabitatCreature({
        habitat: activeHabitat._id,
        register,
      })
    );

    return () => {
      dispatch(resetCreatures());
    };
  }, [activeHabitat._id, dispatch, register]);

  if (creaturesLoading) {
    return (
      <p className="atlas-creatures-message" role="status">
        {register === "humanoid" ? "Humanoide" : "Tiere"} werden geladen …
      </p>
    );
  }

  if (creaturesError) {
    return (
      <p
        className="atlas-creatures-message atlas-creatures-message--error"
        role="alert"
      >
        {creaturesError}
      </p>
    );
  }

  if (!activeCreatures.length) {
    return (
      <p className="atlas-creatures-message">
        Für dieses Habitat sind keine{" "}
        {register === "humanoid" ? "Humanoiden" : "Tiere"} eingetragen.
      </p>
    );
  }

  return (
    <div className="atlas-creatures">
      {activeCreatures.map((creature) => (
        <article className="atlas-creature-card" key={creature._id}>
          <img
            src={`/${register}/${creature._id}.png`}
            alt={creature.name}
            className="atlas-creature-card__image"
          />
          <div className="atlas-creature-card__content">
            <div className="atlas-creature-card__identity">
              <h3>{creature.name}</h3>
              {creature.art && (
                <span className="atlas-creature-card__kind">
                  {register === "humanoid" ? "Fraktion" : "Gattung"}:{" "}
                  {creature.art}
                </span>
              )}
            </div>
            <div className="atlas-creature-card__info">
              <div className="atlas-creature-card__loot">
                <FontAwesomeIcon icon={faBoxOpen} aria-hidden="true" />
                <span>
                  <strong>Material:</strong>{" "}
                  {creature.material || "Keine Beute eingetragen"}
                </span>
              </div>
              <CreatureStatus status={creature.status || "Keine Angabe"} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default AtlasCreatureList;
