import React from "react";
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getStatusPresentation = (status) => {
  const normalizedStatus = status.trim().toLocaleLowerCase();

  if (
    ["frei", "verfügbar", "passiv", "friedlich", "neutral"].includes(
      normalizedStatus
    )
  ) {
    return {
      className: "creature-status--positive",
      icon: faCircleCheck,
    };
  }

  if (["belegt", "vorsichtig", "fernkampf"].includes(normalizedStatus)) {
    return {
      className: "creature-status--caution",
      icon: faCircleExclamation,
    };
  }

  if (["flieht", "schurke"].includes(normalizedStatus)) {
    return {
      className: "creature-status--blue",
      icon: faCircleInfo,
    };
  }

  if (normalizedStatus === "magier") {
    return {
      className: "creature-status--magic",
      icon: faCircleInfo,
    };
  }

  if (["gesperrt", "inaktiv"].includes(normalizedStatus)) {
    return {
      className: "creature-status--muted",
      icon: faLock,
    };
  }

  if (["aggressiv", "feindlich", "krieger"].includes(normalizedStatus)) {
    return {
      className: "creature-status--danger",
      icon: faCircleExclamation,
    };
  }

  return {
    className: "creature-status--default",
    icon: faCircleInfo,
  };
};

function CreatureStatus({ status }) {
  const statusPresentation = getStatusPresentation(status);

  return (
    <span
      className={`creature-status ${statusPresentation.className}`}
      aria-label={`Status: ${status}`}
    >
      <FontAwesomeIcon icon={statusPresentation.icon} aria-hidden="true" />
      {status}
    </span>
  );
}

export default CreatureStatus;
