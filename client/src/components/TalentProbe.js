import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { diceAbbr } from "../data/ConstVariables";
import { getOriginAccentStyle } from "../data/OriginColors";
import "../Styles/TalentProbe.css";
import "../Styles/ThemedModal.css";

const attributeKeys = { ...diceAbbr, GSK: "dexterity", AUS: "stamina", MAN: "mana" };

export function TalentProbe({ dice, attributes, points, bonus, compact = false, loading = false }) {
  const parts = typeof dice === "string" ? dice.split("/").map((part) => part.trim()) : [];
  const learned = points > 0;
  const valuesAvailable = parts.length === 3 && parts.every((part) =>
    attributeKeys[part] && Number.isFinite(attributes?.[attributeKeys[part]])
  );
  return (
    <div className="talent-probe">
      <span>{dice || "Probe nicht hinterlegt"}</span>
      {valuesAvailable ? (
        <span className="talent-probe__values">
          {compact ? parts.map((part) => attributes[attributeKeys[part]] - (learned ? 0 : 1)).join(" / ") : parts.map((part, index) => (
            <span key={`${part}-${index}`}>{part} {attributes[attributeKeys[part]] - (learned ? 0 : 1)}</span>
          ))}
        </span>
      ) : <span className="talent-probe__note">{loading ? "Probenwerte werden geladen …" : attributes ? "Attributwerte nicht verfügbar" : "Probenwerte nicht verfügbar"}</span>}
      {!learned && <span className="talent-probe__note">Ungelernt: −1 je Attribut</span>}
      {!compact && Number.isFinite(bonus) && <span className="talent-probe__note">Ausgleich: {points} Talentpunkte {bonus < 0 ? "−" : "+"} {Math.abs(bonus)} Ausrüstungsbonus = {points + bonus}</span>}
    </div>
  );
}

export function TalentProbeRules({ fractionTheme }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <button type="button" className="talent-probe-info" aria-label="Informationen zur Talentprobe" title="Informationen zur Talentprobe" aria-haspopup="dialog" onClick={() => setShow(true)}>
        <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
      </button>
      <Modal show={show} onHide={() => setShow(false)} centered scrollable className="themed-modal" style={getOriginAccentStyle(fractionTheme)} aria-labelledby="talent-probe-info-title">
        <Modal.Header closeButton closeLabel="Schließen"><Modal.Title id="talent-probe-info-title">Die Talentprobe</Modal.Title></Modal.Header>
        <Modal.Body>
          <p>Würfle für jedes der drei Attribute einen W20. Ein Wurf ist erfolgreich, wenn er höchstens dem angezeigten Attributwert entspricht.</p>
          <p>Addiere die Überschreitungen: Die Probe gelingt, wenn dein gemeinsamer Vorrat aus Talentpunkten und Ausrüstungsboni zum Ausgleichen ausreicht.</p>
          <p>Bei einem ungelernten Talent wird jeder Attributwert um 1 gesenkt. Weitere Boni, Mali und Sonderregeln sind nicht eingerechnet.</p>
        </Modal.Body>
      </Modal>
    </>
  );
}
