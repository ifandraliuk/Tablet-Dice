import React from "react";
import {
  faDice,
  faHeart,
  faShield,
  faWeightHanging,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AttributesList({
  hitpoints,
  hitchance,
  capacity,
  armor,
  slot1,
}) {
  const attributes = [
    { label: "Lebenspunkte", icon: faHeart, value: hitpoints },
    { label: "Trefferchance", icon: faDice, value: hitchance },
    { label: "Traglast", icon: faWeightHanging, value: capacity },
    {
      label: "Rüstung",
      icon: faShield,
      value: slot1?.value ? armor + slot1.value : armor,
      emphasized: Boolean(slot1?.value),
    },
  ];

  return (
    <div
      className="companion-attributes"
      role="group"
      aria-label="Begleiterwerte"
    >
      {attributes.map(({ label, icon, value, emphasized }) => (
        <div className="companion-attribute" key={label}>
          <FontAwesomeIcon
            className="companion-attribute__icon"
            icon={icon}
            aria-hidden="true"
          />
          <span className="companion-attribute__label">{label}</span>
          <strong
            className={`companion-attribute__value ${
              emphasized ? "companion-attribute__value--bonus" : ""
            }`}
          >
            {value}
          </strong>
        </div>
      ))}
    </div>
  );
}

export default AttributesList;
