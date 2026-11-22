import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { getTalent, getPlayerTalent } from "../../features/talent/talentSlice";
import { getInventory } from "../../features/inventory/inventorySlice";
import { pageTransition } from "../../data/Animations";
import ItemIcon from "../../components/ItemIcon";
import { TalentProbe, TalentProbeRules } from "../../components/TalentProbe";
import useTalentProbeData from "../../components/useTalentProbeData";
import { professions, ownInventory, materialAvailability, professionResources } from "./craftingData";
import "../../Styles/Crafting.css";

const errorText = (error) =>
  typeof error === "string" ? error : error?.response?.data?.message || error?.message || "Bitte versuche es erneut.";

function Crafting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { fractionTheme } = useSelector((state) => state.player);
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [reload, setReload] = useState(0);
  const [tab, setTab] = useState("mine");
  const [selected, setSelected] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [recipeError, setRecipeError] = useState("");
  const [search, setSearch] = useState("");
  const [station, setStation] = useState("1");
  const [filter, setFilter] = useState("ready");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [favorites, setFavorites] = useState([]);
  const [favoriteError, setFavoriteError] = useState("");
  const favoriteKey = user?._id ? `craftingFavorites:${user._id}` : null;
  const probeData = useTalentProbeData(user);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    let active = true;
    setData(null);
    setLoadError("");
    Promise.all([
      dispatch(getTalent()).unwrap(),
      dispatch(getPlayerTalent()).unwrap(),
      dispatch(getInventory()).unwrap(),
    ]).then(([talents, playerTalents, inventory]) => {
      if (active) setData({ talents, playerTalents, inventory: inventory.data });
    }).catch((error) => {
      if (active) setLoadError(errorText(error));
    });
    return () => { active = false; };
  }, [dispatch, navigate, user, reload]);

  useEffect(() => {
    if (!favoriteKey) return;
    try {
      const saved = localStorage.getItem(favoriteKey);
      const parsed = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed) || parsed.some((id) => typeof id !== "string")) {
        throw new Error("Favoriten haben ein ungültiges Format.");
      }
      setFavorites(parsed);
      setFavoriteError("");
    } catch (error) {
      setFavorites([]);
      setFavoriteError(`Favoriten konnten nicht geladen werden: ${errorText(error)}`);
    }
  }, [favoriteKey]);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    setRecipes(null);
    setRecipeError("");
    const values = selected.stations.flatMap((item) => item.values);
    if (!values.length) {
      setRecipes([]);
      return;
    }
    const query = new URLSearchParams();
    values.forEach((value) => query.append("production", value));
    axios.get(`/items/recipes?${query.toString()}`).then((response) => {
      if (active) setRecipes(response.data);
    }).catch((error) => {
      if (active) setRecipeError(errorText(error));
    });
    return () => { active = false; };
  }, [selected]);

  const owned = useMemo(() => ownInventory(data?.inventory || [], user?.name), [data, user]);
  const resources = useMemo(() => professionResources(recipes || [], owned), [recipes, owned]);
  const visibleProfessions = professions.filter((profession) => {
    const talent = data?.talents.find((item) => item.category === "Handwerk" && item.name === profession.name);
    const points = data?.playerTalents.find((entry) => entry.talent?._id === talent?._id)?.points || 0;
    return talent && (tab === "all" || points >= 1);
  });
  const selectedTalent = data?.talents.find((item) => item.category === "Handwerk" && item.name === selected?.name);
  const selectedPoints = data?.playerTalents.find((entry) => entry.talent?._id === selectedTalent?._id)?.points || 0;
  const matchingRecipes = (selected ? recipes || [] : []).map((recipe) => {
    const requirements = materialAvailability(recipe, owned);
    const ready = requirements !== null && requirements.every((item) => item.available >= item.required);
    return { recipe, requirements, ready };
  }).filter(({ recipe, ready }) => {
    const searchMatch = recipe.name.toLocaleLowerCase("de").includes(search.trim().toLocaleLowerCase("de"));
    return searchMatch &&
      (filter !== "ready" || ready) &&
      (!favoritesOnly || favorites.includes(recipe._id));
  });
  const results = matchingRecipes.filter(({ recipe }) =>
    !station || selected.stations[Number(station) - 1].values.includes(recipe.production)
  ).sort((a, b) => Number(b.ready) - Number(a.ready));

  const openProfession = (profession) => {
    setRecipes(null);
    setSearch("");
    setStation("1");
    setFilter("ready");
    setFavoritesOnly(false);
    setVisibleCount(12);
    setSelected(profession);
  };
  const toggleFavorite = (id) => {
    if (!favoriteKey || favoriteError) return;
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    try {
      localStorage.setItem(favoriteKey, JSON.stringify(next));
      setFavorites(next);
    } catch (error) {
      setFavoriteError(`Favorit konnte nicht gespeichert werden: ${errorText(error)}`);
    }
  };

  return (
    <motion.div variants={pageTransition} initial="init" animate="animate" exit="exit">
      <div className={`${fractionTheme}-bg`}>
        <main className="container-fluid dark-bg crafting-page">
          {!selected && <header className="crafting-heading">
            <h1>Herstellung</h1>
            <p>Wähle einen Beruf, um Rezepte, Materialien und die passende Talentprobe zu sehen.</p>
          </header>}
          {loadError ? (
            <div role="alert">Berufe konnten nicht geladen werden: {loadError} <button type="button" onClick={() => setReload((value) => value + 1)}>Erneut versuchen</button></div>
          ) : !data ? <p role="status">Berufe und Inventar werden geladen …</p> : !selected ? (
            <>
              <div className="segmented-toggle" role="group" aria-label="Berufsauswahl">
                <button type="button" className={`segmented-toggle__button ${tab === "mine" ? "is-active" : ""}`} aria-pressed={tab === "mine"} onClick={() => setTab("mine")}>Meine Berufe</button>
                <button type="button" className={`segmented-toggle__button ${tab === "all" ? "is-active" : ""}`} aria-pressed={tab === "all"} onClick={() => setTab("all")}>Alle Berufe</button>
              </div>
              <p className="crafting-hint">Alle Herstellungsorte sind vorläufig verfügbar. Die Freischaltung nach Talentpunkten folgt später.</p>
              {visibleProfessions.length === 0 ? <p>Keine Berufe mit mindestens einem investierten Talentpunkt. Unter „Alle Berufe“ findest du die Übersicht.</p> : (
                <div className="crafting-professions">
                  {visibleProfessions.map((profession) => {
                    const talent = data.talents.find((item) => item.category === "Handwerk" && item.name === profession.name);
                    const points = data.playerTalents.find((entry) => entry.talent?._id === talent._id)?.points || 0;
                    return (
                      <button type="button" className="crafting-profession" key={profession.name} onClick={() => openProfession(profession)}>
                        <strong>{profession.name}</strong>
                        <span className={`creature-status ${points > 0 ? "creature-status--default" : "creature-status--muted"}`}>{points > 0 ? `${points} ${points === 1 ? "Talentpunkt" : "Talentpunkte"}` : "Noch nicht gelernt · 0 Punkte"}</span>
                        <span>Probe: {talent.dice || "nicht hinterlegt"}</span>
                        <span className="crafting-profession__stations">{profession.stations.map((item, index) => <span key={index}>{index + 1}. {item.name}</span>)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
          <section className="crafting-detail" aria-labelledby="crafting-detail-title">
            <div className="crafting-detail__navigation">
              <button type="button" className="crafting-back" onClick={() => setSelected(null)}>← Zur Berufsauswahl</button>
              <label>Beruf wechseln
                <select className="form-select dark-filter-control" value={selected.name} onChange={(event) => {
                  const profession = professions.find((item) => item.name === event.target.value);
                  if (profession) openProfession(profession);
                }}>
                  {professions.filter((profession) => data.talents.some((talent) => talent.category === "Handwerk" && talent.name === profession.name)).map((profession) => <option key={profession.name} value={profession.name}>{profession.name}</option>)}
                </select>
              </label>
            </div>
            <header className="crafting-detail__heading">
              <h1 id="crafting-detail-title">{selected.name} · Herstellung</h1>
              <span className={`creature-status ${selectedPoints > 0 ? "creature-status--default" : "creature-status--muted"}`}>{selectedPoints > 0 ? `${selectedPoints} ${selectedPoints === 1 ? "Talentpunkt" : "Talentpunkte"}` : "Noch nicht gelernt · 0 Punkte"}</span>
            </header>
            {selectedPoints < 1 && (
              <div className="crafting-learn-hint">
                <strong>Entdecke {selected.name}</strong>
                <p>Auch ungelernt kannst du Rezepte ansehen und im Spiel eine Talentprobe ablegen. Dabei gilt −1 auf jeden Attributwert. Gelernte Talentpunkte helfen dir, Überschreitungen bei der Probe auszugleichen.</p>
                <Link to={`/talents?talent=${encodeURIComponent(selected.name)}`}>Talent {selected.name} ansehen →</Link>
              </div>
            )}
            <div className="crafting-probe"><strong>Talentprobe:</strong> <TalentProbeRules fractionTheme={fractionTheme} />
              <TalentProbe dice={selectedTalent?.dice} attributes={probeData.attributes} points={selectedPoints} bonus={probeData.boni ? (probeData.boni.find((item) => item.bonus?.type === selected.name)?.value ?? 0) : null} loading={probeData.loading} />
              {probeData.error && <p role="alert">Probenwerte konnten nicht geladen werden: {probeData.error} <button type="button" onClick={probeData.retry}>Erneut versuchen</button></p>}
            </div>
            <p className="crafting-hint">Alle drei Stufen verwenden vorläufig dieselbe Talentprobe. Die Herstellung selbst ist noch nicht verfügbar. Favoriten werden nur in diesem Browser gespeichert.</p>
            {!favoriteKey && <p role="alert">Favoriten sind ohne Charakterkennung nicht verfügbar.</p>}
            {favoriteError && <p role="alert">{favoriteError}</p>}
            <div className="crafting-workspace">
              <section aria-labelledby="crafting-recipes">
                <h2 id="crafting-recipes">Rezepte</h2>
                <div className="crafting-filters">
                  <label>Rezept suchen<input className="form-control dark-filter-control" value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(12); }} type="search" /></label>
                  <label>Herstellungsort<select className="form-select dark-filter-control" value={station} onChange={(event) => { setStation(event.target.value); setVisibleCount(12); }}><option value="">Alle Stufen{recipes !== null && !recipeError ? ` (${matchingRecipes.length})` : ""}</option>{selected.stations.map((item, index) => <option value={index + 1} key={index}>{index + 1}. {item.name}{recipes !== null && !recipeError ? ` (${matchingRecipes.filter(({ recipe }) => item.values.includes(recipe.production)).length})` : ""}</option>)}</select></label>
                  <label>Anzeige<select className="form-select dark-filter-control" value={filter} onChange={(event) => { setFilter(event.target.value); setVisibleCount(12); }}><option value="all">Alle Rezepte</option><option value="ready">Material vorhanden</option></select></label>
                  <label className="crafting-favorites-filter"><input type="checkbox" role="switch" checked={favoritesOnly} disabled={!favoriteKey || Boolean(favoriteError)} onChange={(event) => { setFavoritesOnly(event.target.checked); setVisibleCount(12); }} /> Nur Favoriten</label>
                </div>
                <a className="crafting-mobile-jump" href="#crafting-inventory-title">Zu deinen Ressourcen ↓</a>
                {recipeError ? <p role="alert">Rezepte konnten nicht geladen werden: {recipeError} <button type="button" onClick={() => setSelected({ ...selected })}>Erneut versuchen</button></p> : recipes === null ? <p role="status">Rezepte werden geladen …</p> : results.length === 0 ? <p>{selected.name === "Verzaubern" ? "Herstellungsorte für Verzaubern werden später ergänzt; Rezepte können deshalb noch nicht zugeordnet werden." : recipes.length ? `Keine Rezepte für diese Auswahl gefunden. Passe die Suche, den Herstellungsort${favoritesOnly ? ", die Anzeige oder den Favoritenfilter" : " oder die Anzeige"} an, um weitere Rezepte zu sehen.` : "Für diesen Beruf wurden keine Rezepte gefunden."}</p> : (
                  <>
                  <p className="crafting-hint">{results.length} {results.length === 1 ? "Rezept" : "Rezepte"} gefunden</p>
                  <div className="crafting-recipes">
                    {results.slice(0, visibleCount).map(({ recipe, requirements, ready }) => {
                      const level = selected.stations.findIndex((item) => item.values.includes(recipe.production));
                      return <article className="crafting-recipe" key={recipe._id}>
                        <div className="crafting-recipe__header"><div className="crafting-recipe__identity"><span aria-hidden="true"><ItemIcon item={recipe} /></span><div><h3>{recipe.name}</h3><span>Stufe {level + 1} · {selected.stations[level].name}{recipe.rarity ? ` · ${recipe.rarity}` : ""}</span></div></div>
                          <button type="button" className="crafting-favorite" aria-label={`${recipe.name} ${favorites.includes(recipe._id) ? "aus Favoriten entfernen" : "als Favorit speichern"}`} aria-pressed={favorites.includes(recipe._id)} disabled={!favoriteKey || Boolean(favoriteError)} onClick={() => toggleFavorite(recipe._id)}>{favorites.includes(recipe._id) ? "★" : "☆"}</button></div>
                        <p className={ready ? "crafting-ready" : "crafting-missing"}>{requirements === null ? "Materialangaben unvollständig" : ready ? "Material vorhanden" : "Material fehlt"}</p>
                        {requirements && <ul className="crafting-materials">{requirements.map((item) => <li key={item.id}><span aria-hidden="true"><ItemIcon item={item.item} /></span><span>{item.name}: <strong className={item.available >= item.required ? "crafting-material-count--ready" : "crafting-material-count--missing"}>{item.available}/{item.required}</strong>{item.available < item.required ? ` · ${item.required - item.available} fehlt` : " · vorhanden"}</span></li>)}</ul>}
                        <button className="crafting-action" type="button" disabled title="Herstellung folgt später">Herstellen · demnächst</button>
                      </article>;
                    })}
                  </div>
                  {visibleCount < results.length && <button type="button" className="crafting-more" onClick={() => setVisibleCount((count) => count + 12)}>Weitere Rezepte anzeigen ({Math.min(visibleCount, results.length)} von {results.length})</button>}
                  </>
                )}
              </section>
              <aside className="crafting-inventory" aria-labelledby="crafting-inventory-title">
                <h2 id="crafting-inventory-title">Deine Ressourcen</h2>
                <a className="crafting-mobile-jump" href="#crafting-recipes">↑ Zurück zu den Rezepten</a>
                <p>Eigene, nicht ausgerüstete Ressourcen für Rezepte dieses Berufs.</p>
                {recipeError ? <p>Ressourcen können ohne die Rezepte nicht zugeordnet werden.</p> : recipes === null ? <p>Ressourcen werden zugeordnet …</p> : resources.length === 0 ? <p>Keine passenden Ressourcen im Inventar.</p> : (
                  <ul>{resources.map(({ item, amount }) => <li key={item._id}><span className="crafting-inventory__item"><span aria-hidden="true"><ItemIcon item={item} /></span><span>{item.name}</span></span><strong>{amount}</strong></li>)}</ul>
                )}
              </aside>
            </div>
          </section>
          )}
        </main>
      </div>
    </motion.div>
  );
}

export default Crafting;