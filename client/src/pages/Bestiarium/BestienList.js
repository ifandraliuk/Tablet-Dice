import {
  faDice,
  faHeart,
  faPaw,
  faPlus,
  faShield,
  faWeightHanging,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { memo } from "react";
import CreatureStatus from "../../components/CreatureStatus";

const BestienList = memo(function BestienList({
  creatures,
  artFilter,
  gattungFilter,
  habitatFilter,
  statusFilter,
  nameFilter,
  onHabitatClick,
  setOnPopup,
  setCompanionId,
  fractionTheme,
}) {
  const normalizedNameFilter = nameFilter.trim().toLocaleLowerCase();
  const creatureList = creatures.filter((creature) => {
    const matchesArt = creature.register === artFilter;
    const matchesGattung =
      !gattungFilter || creature.art === gattungFilter;
    const matchesHabitat =
      !habitatFilter ||
      creature.habitat?.some((entry) => entry.name === habitatFilter);
    const matchesStatus = !statusFilter || creature.status === statusFilter;
    const matchesName =
      !normalizedNameFilter ||
      creature.name?.toLocaleLowerCase().includes(normalizedNameFilter);

    return (
      matchesArt &&
      matchesGattung &&
      matchesHabitat &&
      matchesStatus &&
      matchesName
    );
  });

  if (creatureList.length > 0) {
    return (
      <div className="bestiaria">
        {creatureList.map((creature) => (
          <article className="bestiaria-card" key={creature._id}>
            <header className="bestiaria-card__header">
              <div className="bestiaria-card__identity">
                <h3 className="bestiaria-card__name">{creature.name}</h3>
                <div className="bestiaria-card__meta">
                  <span className="bestiaria-card__kind">
                    Gattung: {creature.art}
                  </span>
                  {creature.status && (
                    <CreatureStatus status={creature.status} />
                  )}
                </div>
              </div>
              <button
                type="button"
                className={`bestiaria-card__tame ${fractionTheme}`}
                aria-label={`${creature.name}: Tier zähmen`}
                title="Tier zähmen"
                onClick={() => {
                  setCompanionId(creature._id);
                  setOnPopup(true);
                }}
              >
                <FontAwesomeIcon icon={faPaw} />
                <FontAwesomeIcon
                  className="bestiaria-card__tame-plus"
                  icon={faPlus}
                  aria-hidden="true"
                />
                <span>Tier zähmen</span>
              </button>
            </header>
            <div className="bestiaria-card__content">
              <div className="bestiaria-card__visual">
                <img
                  className="bestiaria-card__image"
                  src={`${creature.register}/${creature._id}.png`}
                  alt={creature.name}
                />
              </div>
              <div className="bestiaria-card__details">
                <div className="bestiaria-card__description">
                  <h4>Beschreibung</h4>
                  <p>{creature.description}</p>
                  <h4>Fertigkeiten</h4>
                  <p>{creature.ability}</p>
                </div>
                <dl className="bestiaria-card__attributes">
                  <div>
                    <dt>
                      <FontAwesomeIcon
                        className="bestiaria-card__attribute-icon"
                        icon={faWeightHanging}
                        aria-hidden="true"
                      />
                      Traglast
                    </dt>
                    <dd>{creature.capacity ?? "–"}</dd>
                  </div>
                  <div>
                    <dt>
                      <FontAwesomeIcon
                        className="bestiaria-card__attribute-icon"
                        icon={faHeart}
                        aria-hidden="true"
                      />
                      Trefferpunkte
                    </dt>
                    <dd>{creature.hitpoints}</dd>
                  </div>
                  <div>
                    <dt>
                      <FontAwesomeIcon
                        className="bestiaria-card__attribute-icon"
                        icon={faShield}
                        aria-hidden="true"
                      />
                      Rüstung
                    </dt>
                    <dd>{creature.armor}</dd>
                  </div>
                  <div>
                    <dt>
                      <FontAwesomeIcon
                        className="bestiaria-card__attribute-icon"
                        icon={faDice}
                        aria-hidden="true"
                      />
                      Trefferchance
                    </dt>
                    <dd>{creature.hitchance}</dd>
                  </div>
                </dl>
                <section className="bestiaria-card__damage">
                  <h4>Schaden</h4>
                  <div className="bestiaria-card__damage-value">
                    <img src="/icons/common/swordxhdpi.png" alt="" />
                    <p>{creature.damage}</p>
                  </div>
                </section>
                {creature.habitat?.length > 0 && (
                  <div className="bestiaria-card__habitats">
                    <h4>Habitate</h4>
                    <ul>
                      {creature.habitat.map((habitat) => (
                        <li key={habitat._id}>
                          <button
                            type="button"
                            className="bestiaria-card__habitat-button"
                            onClick={() => onHabitatClick(habitat)}
                            aria-label={`Informationen zum Habitat ${habitat.name} anzeigen`}
                          >
                            {habitat.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  } else {
    return (
      <p className="bestiaria-empty">
        {creatures.length === 0
          ? "Es wurden noch keine Tiere hinzugefügt."
          : "Keine Tiere entsprechen deiner Suche und den ausgewählten Filtern."}
      </p>
    );
  }
});

export default BestienList;
