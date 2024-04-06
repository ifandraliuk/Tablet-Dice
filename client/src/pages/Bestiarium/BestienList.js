import { faPaw, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { memo } from "react";
const BestienList = memo(function BestienList({
  creatures,
  artFilter,
  setOnPopup,
  setCompanionId,
  fractionTheme,
}) {
  const creatureList =
    artFilter.length === 0
      ? creatures
      : creatures.filter(
          cr => cr.art === artFilter)
        ;
    
  if (creatureList.length > 0) {
    return (
      <div className="bestiaria ">
        {creatureList?.map((creature) => {
          const habitat = creature?.habitat;
          
           return (
            <div className="row info " key={creature._id}>

              <div className="row ">
              <div className="col-auto">
                <button
                      id={creature._id}
                      className={fractionTheme}
                      onClick={(e) => {
                        setCompanionId(e.currentTarget.id);
                        setOnPopup((popup) => !popup);
                      }}
                    >
                      <FontAwesomeIcon icon={faPaw} />
                      <FontAwesomeIcon icon={faPlus} />
                    </button>             
              </div>
              <div className="col-3 ">
                <h3>{creature.name}</h3>
                <strong>{` (Gattung: ${creature.art})`}</strong>
              </div>

              </div>
              <div className="col-3 mt-3">
                <img
                  className="img-creature"
                  src={`${creature.register}/${creature._id}.png`}
                  alt="creature"
                />
                <h5
                  className={creature.status}
                >{`Status: ${creature.status}`}</h5>
              </div>

              <div className="col-9 p-2 border-left">
                <h5>Beschreibung:</h5>
                <p>{creature.description}</p>
                <h5>Fertigkeiten:</h5>
                <p>{creature.ability}</p>
                <ul>
                  <li>
                    Trefferpunkte: <strong>{creature.hitpoints}</strong>
                  </li>
                  <li>
                    Rüstung: <strong>{creature.armor}</strong>
                  </li>
                  <li>
                    Schaden: <strong>{creature.damage}</strong>
                  </li>
                  <li>
                    Trefferchance: <strong>{creature.hitchance}</strong>
                  </li>
                </ul>
                <h5>Habitate:</h5>
                <ul>
                  {habitat?.map((h) => (
                    <li className="row" key={h._id}>
                      {h.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div>Es wurden noch keine Tiere zu dieser Art hinzugefügt...</div>
    );
  }
});

export default BestienList;
