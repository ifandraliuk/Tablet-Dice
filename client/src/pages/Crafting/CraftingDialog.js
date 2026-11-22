import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import ItemIcon from "../../components/ItemIcon";
import RarityBadge from "../../components/RarityBadge";
import { TalentProbe, TalentProbeRules } from "../../components/TalentProbe";
import { getOriginAccentStyle } from "../../data/OriginColors";
import "../../Styles/ThemedModal.css";

export default function CraftingDialog({ recipe, profession, station, requirements, token, fractionTheme, talentDice, points, bonus, probeData, onClose, onRefresh }) {
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [rollConfirmed, setRollConfirmed] = useState(false);
  const [outcome, setOutcome] = useState("success");
  const [pending, setPending] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [refreshError, setRefreshError] = useState("");
  const operationId = useRef(null);
  const submitting = useRef(false);
  const count = Number(locationConfirmed) + Number(rollConfirmed);
  const chooseOutcome = (value) => {
    setOutcome(value);
    setRollConfirmed(false);
  };

  const refresh = async () => {
    try {
      await onRefresh();
      setRefreshError("");
    } catch (err) {
      setRefreshError("Inventar und Talente konnten nicht aktualisiert werden. Bitte erneut laden.");
    }
  };
  const submit = async () => {
    if (submitting.current || count !== 2) return;
    if (!window.crypto?.randomUUID) {
      setError("Herstellung ist nur in einer sicheren Verbindung (HTTPS) oder auf localhost möglich.");
      return;
    }
    submitting.current = true;
    setPending(true);
    setError("");
    try {
      if (!operationId.current) operationId.current = window.crypto.randomUUID();
      const response = await axios.post("/inventory/craft", {
        recipeId: recipe._id, profession, outcome, operationId: operationId.current,
        locationConfirmed, rollConfirmed,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setResult(response.data.message);
      setUncertain(false);
      await refresh();
    } catch (err) {
      const status = err.response?.status;
      const ambiguous = !status || status >= 500;
      setUncertain(ambiguous);
      setError(ambiguous
        ? "Der Abschluss konnte nicht bestätigt werden. Bitte dieselbe Anfrage erneut versuchen; sie wird nicht doppelt ausgeführt."
        : err.response?.data?.message || "Herstellung fehlgeschlagen.");
      if (!ambiguous) {
        setRejected(true);
        if (status === 409) await refresh();
      }
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };

  return (
    <Modal show onHide={pending || uncertain || refreshError ? undefined : onClose} backdrop={pending || uncertain || refreshError ? "static" : true} keyboard={!pending && !uncertain && !refreshError} size="lg" centered scrollable className="themed-modal crafting-dialog" style={getOriginAccentStyle(fractionTheme)} aria-labelledby="crafting-dialog-title">
      <Modal.Header closeButton={!pending && !uncertain && !refreshError} closeLabel="Schließen"><Modal.Title id="crafting-dialog-title">Herstellung bestätigen</Modal.Title></Modal.Header>
      <Modal.Body>
        <div className="crafting-dialog__layout">
        <div>
          <section aria-labelledby="crafting-result-title" className="crafting-dialog__section">
            <h3 id="crafting-result-title">Du stellst her</h3>
            <div className="crafting-dialog__item">
              <span aria-hidden="true"><ItemIcon item={recipe} /></span>
              <div><h4>{recipe.name}</h4><p>{[recipe.category, recipe.genus, recipe.type].filter(Boolean).join(" · ")}</p>{recipe.rarity && <RarityBadge rarity={recipe.rarity} />}</div>
            </div>
            {(recipe.bonuses || recipe.dice || recipe.description || recipe.price || recipe.weight != null || (recipe.category !== "Ressource" && recipe.value != null)) && <dl className="crafting-dialog__details">
              {recipe.bonuses && <div><dt>Bonus / Wirkung</dt><dd>{recipe.bonuses}</dd></div>}
              {recipe.dice && <div><dt>{recipe.category === "Waffe" ? "Schaden" : recipe.category === "Ressource" ? "Abbauen / Verarbeiten" : "Widerstand"}</dt><dd>{recipe.dice}</dd></div>}
              {recipe.category !== "Ressource" && recipe.value != null && <div><dt>{recipe.category === "Rüstung" ? "Rüstwert" : "Reichweite"}</dt><dd>{recipe.value}</dd></div>}
              {recipe.weight != null && <div><dt>Gewicht</dt><dd>{recipe.weight} kg</dd></div>}
              {recipe.price && <div><dt>Preis</dt><dd>{recipe.price}</dd></div>}
              {recipe.description && <div><dt>Beschreibung</dt><dd>{recipe.description}</dd></div>}
            </dl>}
          </section>
          <section aria-labelledby="crafting-consumption-title" className="crafting-dialog__section">
            <h3 id="crafting-consumption-title">Diese Materialien werden verbraucht</h3>
            <ul className="crafting-dialog__materials">{requirements.map((item) => <li key={item.id}>
              <span aria-hidden="true"><ItemIcon item={item.item} /></span><span>{item.name}</span><span className="crafting-dialog__consumed" aria-label={`${item.required} ${item.required === 1 ? "wird" : "werden"} verbraucht`}>−{item.required}</span>
            </li>)}</ul>
          </section>
        </div>
        <div>
          <section aria-labelledby="crafting-dialog-probe-title" className="crafting-dialog__section">
            <div className="crafting-probe__heading"><h3 id="crafting-dialog-probe-title">Deine Talentprobe</h3><TalentProbeRules fractionTheme={fractionTheme} /></div>
            <TalentProbe dice={talentDice} attributes={probeData.attributes} points={points} bonus={bonus} loading={probeData.loading} compact showBonus />
            {probeData.error && <p role="alert">Probenwerte konnten nicht geladen werden: {probeData.error} <button type="button" className="crafting-dialog__secondary" onClick={probeData.retry}>Erneut versuchen</button></p>}
          </section>
        {!result ? <>
          <div className="crafting-profession__progress">
            <div className="crafting-profession__progress-heading"><span>Voraussetzungen</span><strong>{count}/2</strong></div>
            <div className="crafting-dialog__progress" aria-hidden="true"><span className={locationConfirmed ? "is-unlocked" : ""} /><span className={rollConfirmed ? "is-unlocked" : ""} /></div>
          </div>
          <fieldset disabled={pending || uncertain} className="crafting-dialog__checks">
            <label><input type="checkbox" checked={locationConfirmed} onChange={(event) => setLocationConfirmed(event.target.checked)} /> Ich befinde mich am richtigen Herstellungsort ({station}).</label>
            <label><input type="checkbox" checked={rollConfirmed} onChange={(event) => setRollConfirmed(event.target.checked)} /> Ich bestätige das unten gewählte Ergebnis meiner Talentprobe.</label>
            <fieldset>
              <legend>Ergebnis der Talentprobe</legend>
              <label><input type="radio" name="craft-outcome" checked={outcome === "success"} onChange={() => chooseOutcome("success")} /> Erfolg</label>
              <label><input type="radio" name="craft-outcome" checked={outcome === "criticalSuccess"} onChange={() => chooseOutcome("criticalSuccess")} /> Kritischer Erfolg</label>
              <label><input type="radio" name="craft-outcome" checked={outcome === "criticalFailure"} onChange={() => chooseOutcome("criticalFailure")} /> Kritischer Misserfolg</label>
            </fieldset>
          </fieldset>
          <p className="crafting-dialog__note">Ob ein Ergebnis kritisch ist, entscheidet der GM. Kritischer Erfolg: Gegenstand und +1 Talentpunkt. Kritischer Misserfolg: Materialien werden verbraucht, kein Gegenstand.</p>
          {error && <p role="alert">{error}</p>}
        </> : <p role="status">{result}</p>}
        {refreshError && <p role="alert">{refreshError} <button type="button" className="crafting-dialog__secondary" onClick={refresh}>Erneut laden</button></p>}
        </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {!pending && !uncertain && !refreshError && <button type="button" className="crafting-dialog__secondary" onClick={onClose}>{result ? "Schließen" : "Abbrechen"}</button>}
        {!result && <button type="button" className="crafting-dialog__confirm" disabled={pending || rejected || count !== 2} onClick={submit}>{pending ? "Wird gespeichert …" : uncertain ? "Erneut versuchen" : outcome === "criticalFailure" ? "Misserfolg bestätigen" : "Herstellung abschließen"}</button>}
      </Modal.Footer>
    </Modal>
  );
}
