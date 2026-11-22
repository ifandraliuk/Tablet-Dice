import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Fraction from "../../components/Fraction";
import { setActive, setUserImage } from "../../features/creation/creationSlice";
import { allAttributes } from "../../data/ConstVariables";
import AbilityCard from "../../components/AbilityCard";

const generalInfoNames = {
  age: "Alter",
  sex: "Geschlecht",
  kind: "Spezies",
  eyecolor: "Augenfarbe",
  haircut: "Frisur",
  haircolor: "Haarfarbe",
  more: "Besondere Merkmale",
};

function Overview({ onClick }) {
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const readSequence = useRef(0);
  const { activeProfession, activeAbility, generalInfo, activeOrigin, cuttedOrigin, attributes, userImage } =
    useSelector((state) => state.creation);
  const ability = activeProfession?.abilities?.find((item) => item._id === activeAbility);

  const handleFileChange = (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const sequence = ++readSequence.current;
    if (!file.type.startsWith("image/")) {
      setImageLoading(false);
      setImageError("Bitte wähle eine Bilddatei aus.");
      event.currentTarget.value = "";
      return;
    }
    const reader = new FileReader();
    setImageError("");
    setImageLoading(true);
    reader.onload = () => {
      if (sequence !== readSequence.current) return;
      setImageLoading(false);
      if (typeof reader.result !== "string") {
        setImageError("Das Bild konnte nicht gelesen werden. Bitte versuche es erneut.");
        return;
      }
      setImageError("");
      dispatch(setUserImage(reader.result));
    };
    reader.onerror = () => {
      if (sequence !== readSequence.current) return;
      setImageLoading(false);
      setImageError("Das Bild konnte nicht gelesen werden. Bitte versuche es erneut.");
    };
    reader.readAsDataURL(file);
    event.currentTarget.value = "";
  };

  return (
    <div className="create-overview">
      <div className="alert info">
        Dein Abenteuer kann bald beginnen. Überprüfe deine Auswahl und gib deinem Charakter einen Namen.
      </div>
      <div className="create-overview__layout">
        <aside className="create-overview__portrait create-overview__panel">
          <h3>Dein Charakterbild</h3>
          <img className="create-overview__portrait-image"
            alt={userImage ? "Dein gewähltes Charakterbild" : "Vorschau deiner Spezies"}
            src={userImage || `/race/${generalInfo.sex === "männlich" ? "m" : "w"}/${generalInfo.kind}.png`} />
          <input id="create-character-image" type="file" accept="image/*" onChange={handleFileChange} />
          <label className="create-overview__upload" htmlFor="create-character-image">
            {userImage ? "Bild ändern" : "Bild auswählen"}
          </label>
          {imageLoading && <p role="status">Bild wird geladen …</p>}
          <p>Für die Erstellung benötigst du ein eigenes Charakterbild.</p>
          {imageError && <p className="create-overview__error" role="alert">{imageError}</p>}
          <div className="create-overview__origin">
            <span>Herkunft</span>
            <strong>{activeOrigin}</strong>
            <div className="create-overview__crest"><Fraction fraction={cuttedOrigin} /></div>
          </div>
        </aside>

        <div className="create-overview__main">
          <section className="create-overview__panel" aria-labelledby="overview-general-title">
            <div className="create-overview__heading">
              <h3 id="overview-general-title">Allgemeines</h3>
              <button type="button" className="create-overview__edit" onClick={() => dispatch(setActive("general"))}>Bearbeiten</button>
            </div>
            <dl className="create-overview__facts">
              {Object.entries(generalInfoNames).map(([key, label]) => (
                <div key={key}><dt>{label}</dt><dd>{generalInfo[key] || "–"}</dd></div>
              ))}
            </dl>
          </section>

          <section className="create-overview__panel" aria-labelledby="overview-attributes-title">
            <div className="create-overview__heading">
              <h3 id="overview-attributes-title">Attribute</h3>
              <button type="button" className="create-overview__edit" onClick={() => dispatch(setActive("attributes"))}>Bearbeiten</button>
            </div>
            <dl className="create-overview__attributes">
              {Object.keys(allAttributes).map((key) => (
                <div key={key}><dt>{allAttributes[key]}</dt><dd>{attributes[key]}</dd></div>
              ))}
            </dl>
          </section>

          <section className="create-overview__panel" aria-labelledby="overview-profession-title">
            <div className="create-overview__heading">
              <h3 id="overview-profession-title">Profession</h3>
              <button type="button" className="create-overview__edit" onClick={() => dispatch(setActive("profession"))}>Bearbeiten</button>
            </div>
            <div className="create-overview__profession">
              <div>
                <h4>{activeProfession.name}</h4>
                <p>{activeProfession.description}</p>
                <p><strong>Spezialisierung:</strong> {ability?.specialization || "–"}</p>
                <p><strong>Vorteile:</strong> {activeProfession.advantages}</p>
              </div>
              <div className="create-ability-cards">
                <h4>Deine erste Fertigkeit</h4>
                {ability ? <AbilityCard ability={ability} userclass={activeProfession._id} readOnly /> : (
                  <p className="create-overview__error" role="alert">Die gewählte Fertigkeit wurde nicht gefunden. Bitte überprüfe deine Profession.</p>
                )}
              </div>
            </div>
          </section>
          <div className="create-overview__finish">
            {!userImage && <p>Wähle zuerst ein Charakterbild aus.</p>}
            <button type="button" className="create-overview__confirm" disabled={!userImage || !ability || imageLoading} onClick={onClick}>
              Weiter zur Namensgebung
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
