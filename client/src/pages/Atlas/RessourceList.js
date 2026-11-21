import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDice } from "@fortawesome/free-solid-svg-icons";
import ItemIcon from "../../components/ItemIcon";

const RessourceList = () => {
  const { activeHabitat } = useSelector((state) => state.atlas);
  const resources = activeHabitat.ressource ?? [];

  if (!resources.length) {
    return (
      <p className="atlas-resources-message">
        Für dieses Habitat sind keine Ressourcen eingetragen.
      </p>
    );
  }

  return (
    <div className="atlas-resources">
      {resources.map((resource, index) => (
        <article
          className="atlas-resource-card"
          key={resource.id?._id ?? `${resource.id?.name ?? "resource"}-${index}`}
        >
          <ItemIcon item={resource.id} enchantment={null} large={false} />
          <div className="atlas-resource-card__details">
            <h3>{resource.id?.name ?? "Unbekannte Ressource"}</h3>
            <span className="atlas-resource-card__availability">
              <FontAwesomeIcon icon={faDice} aria-hidden="true" />
              <span>Verfügbarkeit</span>
              <strong>{resource.dice ?? "–"}</strong>
            </span>
          </div>
        </article>
      ))}
    </div>
  );
};

export default RessourceList;
