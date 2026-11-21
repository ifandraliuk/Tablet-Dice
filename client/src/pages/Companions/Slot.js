import React, { useEffect, useState } from "react";
import AttributesList from "./AttributesList";
import MathButtonGroup from "../../components/MathButtonGroup";
import ProgressBar from "../../components/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import ItemIcon from "../../components/ItemIcon";
import ExtendedInfo from "../Inventory/ExtendedInfo";

/*
 * Active companion slot wit all information about it. Has also 2 equipment slots. 
The items are sorted out of the users inventory.

 */
function Slot({
  category,
  data,
  usedBy,
  unlocked,
  slotOnClick,
  slotFilter,
  equipItem,
  clearSlot,
}) {
  const { charismaValue, info } = data;
  const localHP = localStorage.getItem(category);
  const [damageDone, setDamageDone] = useState(0);
  const [selectedEquipmentSlot, setSelectedEquipmentSlot] = useState(null);
  const [selectedItemInfo, setSelectedItemInfo] = useState(null);
  const [currentHP, setCurrentHP] = useState(localHP ? parseInt(localHP) : -1);
  const [allowedForCompanion, setAllowedForCompanion] = useState([])
  useEffect(()=>{

    if(unlocked){
      setAllowedForCompanion(slotFilter.filter(
        (el) => el.item?.type === usedBy[0]?.creature?.art
      ))
    }
  },[unlocked, slotFilter, usedBy])
  const equipmentOptions = allowedForCompanion.filter((element) =>
    selectedEquipmentSlot === "slot1"
      ? element.item?.genus === "Sattel"
      : selectedEquipmentSlot === "slot2"
        ? element.item?.genus !== "Sattel"
        : false
  );
  const selectedEquipmentLabel =
    selectedEquipmentSlot === "slot1" ? "Sattel" : "Weitere Ausrüstung";
  const selectedEquipmentDescription =
    selectedEquipmentSlot === "slot1" ? "den Sattel" : "weitere Ausrüstung";
  if (unlocked) {
    if (usedBy?.length === 1) {
      const { _id, creature, name } = usedBy[0];
      console.log(usedBy);
      const add = () => {
        if (currentHP === -1) {
          console.log("first load +");
          setCurrentHP(() => creature?.hitpoints);
          localStorage.setItem(category, creature?.hitpoints);
        } else if (currentHP + damageDone <= creature?.hitpoints) {
          setCurrentHP((curr) => curr + damageDone);
          localStorage.setItem(category, currentHP + damageDone);
        }
      };
      const subtract = () => {
        if (currentHP === -1) {
          console.log("first load -");
          setCurrentHP(() => creature?.hitpoints - damageDone);
          localStorage.setItem(category, creature?.hitpoints - damageDone);
        } else if (currentHP - damageDone >= 0) {
          localStorage.setItem(category, currentHP - damageDone);
          setCurrentHP((curr) => curr - damageDone);
        }
      };

      return (
        <>
        <div className="slot companion-slot--active">
          <div className="row companion-slot-active-row">
            <div className="companion-slot-visual">
              <div className="companion-slot-heading">
                <h3>{category}</h3>
                <button
                  type="button"
                  id="Stall"
                  name={_id}
                  className="companion-release-button"
                  aria-label={`${name} zurück in den Stall stellen`}
                  title="In den Stall zurückstellen"
                  onClick={(e) => {
                    slotOnClick(e.currentTarget.id, e.currentTarget.name);
                    localStorage.removeItem(category);
                    setCurrentHP(-1);
                  }}
                >
                  X
                </button>
              </div>
              <img
                className="img-creature img-fluid companion-active-image"
                src={`creature/${creature?._id}.png`}
                alt="creature"
              />
              <section
                className="companion-equipment"
                aria-label="Begleiter-Ausrüstung"
              >
                <div className="companion-equipment__slots">
                  {["slot1", "slot2"].map((slotName) => {
                    const item = usedBy[0]?.[slotName];
                    const slotLabel =
                      slotName === "slot1" ? "Sattel" : "Weitere Ausrüstung";

                    return (
                      <div
                        className="companion-equipment__slot"
                        key={slotName}
                      >
                        <strong className="companion-equipment__slot-type">
                          {slotLabel}
                        </strong>
                        <div className="companion-equipment__slot-content">
                          {item ? (
                            <button
                              type="button"
                              className="companion-equipment__item-preview"
                              aria-label={`${item.name} details anzeigen`}
                              onClick={() => {
                                const inventoryItem = slotFilter.find(
                                  (entry) =>
                                    entry.item?._id?.toString() ===
                                    item._id?.toString()
                                );
                                setSelectedItemInfo(inventoryItem || item);
                              }}
                            >
                              <ItemIcon item={item} />
                            </button>
                          ) : (
                            <ItemIcon isEmpty={true} />
                          )}
                          {item ? (
                            <button
                              type="button"
                              id={slotName}
                              className="companion-equipment__action companion-equipment__remove"
                              onClick={(e) =>
                                clearSlot(usedBy[0], e.currentTarget.id)
                              }
                              aria-label={`${item.name} entfernen`}
                              title="Entfernen"
                            >
                              X
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="companion-equipment__action companion-equipment__add"
                              aria-label={`${slotLabel} ausrüsten`}
                              aria-expanded={
                                selectedEquipmentSlot === slotName
                              }
                              onClick={() =>
                                setSelectedEquipmentSlot((currentSlot) =>
                                  currentSlot === slotName ? null : slotName
                                )
                              }
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedEquipmentSlot &&
                  (equipmentOptions.length > 0 ? (
                    <div className="companion-equipment__options">
                      <h5 className="companion-equipment__options-title">
                        {selectedEquipmentLabel} auswählen
                      </h5>
                      {equipmentOptions.map((element) => (
                        <motion.button
                          key={element._id}
                          type="button"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="companion-equipment__option"
                          onClick={() => {
                            equipItem(
                              _id,
                              element.item?.genus,
                              element?.item._id
                            );
                            setSelectedEquipmentSlot(null);
                          }}
                        >
                          <ItemIcon item={element} />
                          <span>
                            <strong>{element.item?.name}</strong>
                            <small>{element.item?.bonuses}</small>
                          </span>
                          <strong>
                            <FontAwesomeIcon icon={faShield} />{" "}
                            {element.item?.value}
                          </strong>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="alert info">
                      {`Keine passenden Gegenstände für ${selectedEquipmentDescription} des Begleitertyps "${usedBy[0]?.creature?.art}" im Inventar gefunden.`}
                    </div>
                  ))}
              </section>
            </div>
            <div className="col-12 col-lg-8 companion-active-info">
              <h3 className="companion-name">
                {name}
                {creature?.name && (
                  <span className="companion-card__creature-type">
                    {" "}({creature.name})
                  </span>
                )}
              </h3>
              <AttributesList
                hitpoints={creature?.hitpoints}
                capacity={creature?.capacity}
                hitchance={creature?.hitchance}
                armor={creature?.armor}
                slot1={usedBy[0]?.slot1}
              />
              <div className="companion-health-progress">
                <ProgressBar
                  color={creature?.status}
                  current={currentHP < 0 ? creature?.hitpoints : currentHP}
                  max={creature?.hitpoints}
                />
              </div>
              <div className="row companion-health-controls">
                <div className="col-auto">
                  <input
                    type="number"
                    className="form-control dark-filter-control w-100"
                    value={damageDone}
                    name="val"
                    onChange={(e) => {
                      setDamageDone(parseInt(e.currentTarget.value));
                    }}
                  ></input>
                </div>
                <div className="col">
                  <MathButtonGroup
                    add={add}
                    subtract={subtract}
                    className="resource-adjustment-buttons"
                    onReset={() => {
                      setCurrentHP(creature?.hitpoints);
                      localStorage.setItem(category, creature?.hitpoints);
                    }}
                  />
                </div>
              </div>

              <h4>Fertigkeiten</h4>
              <p>{creature?.ability}</p>
              <div className={`line ${creature?.picture}`}></div>
              {usedBy[0]?.slot1 || usedBy[0]?.slot2 ? (
                <div>
                  <h4>Ausrüstungsbonus</h4>
                  {usedBy[0].slot1 && (
                    <p>{usedBy[0].slot1?.bonuses}</p>
                  )}
                  {usedBy[0].slot2 && (
                    <p>{usedBy[0].slot2?.bonuses}</p>
                  )}
                </div>
              ) : (
                <></>
              )}
              <h4>Schaden</h4>
              <p className="companion-damage-description">{info}</p>
              <div className="companion-damage-value">
                <img
                  name="damage"
                  alt=""
                  src={`/icons/common/swordxhdpi.png`}
                />
                <span>{creature?.damage}</span>
              </div>
            </div>
          </div>
        </div>
        {selectedItemInfo && (
          <ExtendedInfo
            customItemInfo={selectedItemInfo}
            minimized={true}
            setShowInfo={() => setSelectedItemInfo(null)}
          />
        )}
        </>
      );
    } else if (usedBy?.length > 1) {
      <div className="alert error">
        Fehler! Zu diesem Slot sind mehr als ein Begleiter zugeordnet
      </div>;
    } else
      return (
        <div className="slot ">
          <div className="companion-slot-state-row">
            <div className="companion-slot-state">
              <h3>{category}</h3>
              <span className="companion-slot-status companion-slot-status--free">
                Frei
              </span>
            </div>
            <div className="companion-slot-description">
              <p>{info}</p>
            </div>
          </div>
        </div>
      );
  } else
    return (
      <div className="slot disabled">
        <div className="companion-slot-state-row">
          <div className="companion-slot-state">
            <h3>{category}</h3>
            <span className="companion-slot-status companion-slot-status--locked">
              Gesperrt
            </span>
            <p className="companion-slot-requirement">
              Freigeschaltet ab {charismaValue} Charisma
            </p>
          </div>
          <div className="companion-slot-description">
            <p>{info}</p>
          </div>
        </div>
      </div>
    );
}

export default Slot;
