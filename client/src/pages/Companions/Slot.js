import React, { useEffect, useState } from "react";
import AttributesList from "./AttributesList";
import MathButtonGroup from "../../components/MathButtonGroup";
import ProgressBar from "../../components/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import ItemIcon from "../../components/ItemIcon";

/*
 * Active companion slot wit all information about it. Has also 2 equipment slots. 
The items are sorted out of the users inventory.

 */
function Slot({
  i,
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
  const [showList, setShowList] = useState(false);
  const [currentHP, setCurrentHP] = useState(localHP ? parseInt(localHP) : -1);
  const [allowedForCompanion, setAllowedForCompanion] = useState([])
  const listVisible = () => {
    setShowList((showList) => !showList);
  };
  useEffect(()=>{

    if(unlocked){
      setAllowedForCompanion(slotFilter.filter(
        (el) => el.item?.type === usedBy[0]?.creature?.art
      ))
    }
  },[unlocked, slotFilter, usedBy])
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
        <div className="slot">
          <div className="row">
            <div className="col-auto">
              <div className="slot-number">{i}</div>
              <button
                id="Stall"
                name={_id}
                className="slot-number btn-remove mt-2"
                onClick={(e) => {
                  slotOnClick(e.currentTarget.id, e.currentTarget.name);
                  localStorage.removeItem(category);
                  setCurrentHP(-1);
                }}
              >
                X
              </button>
            </div>
            <div className="col-3 ">
              <h3 className="">{category}</h3>
              <img
                className="img-creature img-fluid"
                src={`creature/${creature?._id}.png`}
                alt="creature"
              />
            </div>
            <div className="col-5 border-pattern left repeat info-div">
              <h3>{name}</h3>
              <AttributesList
                hitpoints={creature?.hitpoints}
                capacity={creature?.capacity}
                hitchance={creature?.hitchance}
                armor={creature?.armor}
                slot1={usedBy[0]?.slot1}
                slot2={usedBy[0]?.slot2}
              />
              <ProgressBar
                color={creature?.picture}
                current={currentHP < 0 ? creature?.hitpoints : currentHP}
                max={creature?.hitpoints}
              />
              <div className="row">
                <div className="col-auto">
                  <input
                    type="number"
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
                    <p>{`${usedBy[0].slot1?.bonuses} (${usedBy[0].slot1.name})`}</p>
                  )}
                  {usedBy[0].slot2 && (
                    <p>{`${usedBy[0].slot2?.bonuses} (${usedBy[0].slot2.name})`}</p>
                  )}
                </div>
              ) : (
                <></>
              )}
              <h4>Schaden</h4>
              <div className="row">
                <div className="col-auto">{info}</div>
                <div className="col">
                  <img
                    name="damage"
                    alt="icon"
                    src={`/icons/common/swordxhdpi.png`}
                  />
                  {` ${creature?.damage}`}
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="row">
                {usedBy[0]?.slot1 ? (
                  <div className="col-6 info-div">
                    <div className="row ">
                      <div className="col-auto ">
                        <ItemIcon item={usedBy[0]?.slot1} />
                      </div>
                      <div className="col-4">
                        <button
                          id="slot1"
                          className="btn-remove"
                          onClick={(e) =>
                            clearSlot(usedBy[0], e.currentTarget.id)
                          }
                        >
                          X
                        </button>{" "}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-auto empty-slot">
                    <button onClick={listVisible}>+</button>
                  </div>
                )}
                {usedBy[0]?.slot2 ? (
                  <div className="col-6 info-div">
                    <div className="row ">
                      <div className="col-auto ">
                        <ItemIcon item={usedBy[0]?.slot2} />
                      </div>
                      <div className="col-4">
                        <button
                          id="slot2"
                          className="btn-remove"
                          onClick={(e) =>
                            clearSlot(usedBy[0], e.currentTarget.id)
                          }
                        >
                          X
                        </button>{" "}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-auto empty-slot">
                    <button onClick={listVisible}>+</button>
                  </div>
                )}
                <div>
                  {showList && (allowedForCompanion.length > 0 ? (
                    allowedForCompanion.map((element) => (
                      <motion.div
                        key={element._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className=" row companion-list "
                      >
                        <div
                          className="col-9"
                          onClick={() => {
                            equipItem(
                              _id,
                              element.item?.genus,
                              element?.item._id
                            );
                            listVisible();
                          }}
                        >
                          <h4>{element.item?.name}</h4>
                          <p>{`(${element.item?.bonuses})`}</p>
                          <strong>
                            <FontAwesomeIcon icon={faShield} /> +{" "}
                            {element.item?.value}
                          </strong>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="alert info">
                      {`Nichts passendes im Inventar zu Begleitertyp "${usedBy[0]?.creature?.art}" gefunden`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (usedBy?.length > 1) {
      <div className="alert error">
        Fehler! Zu diesem Slot sind mehr als ein Begleiter zugeordnet
      </div>;
    } else
      return (
        <div className="slot ">
          <div className="row">
            <div className="col-auto ">
              <div className="slot-number disabled">{i}</div>
            </div>
            <div className="col-3">
              <h3 className="">{category}</h3>
            </div>
            <div className="col-3 border-pattern left repeat">
              <p>{info}</p>
            </div>
          </div>
        </div>
      );
  } else
    return (
      <div className="slot disabled">
        <div className="row">
          <div className="col-auto ">
            <div className="slot-number disabled">{i}</div>
          </div>
          <div className="col-3">
            <h3 className="disabled">{category}</h3>
            <div className="alert error">
              Erfordert {charismaValue} Charismapunkte
            </div>
          </div>
          <div className="col-3 border-pattern left repeat">
            <p>{info}</p>
          </div>
        </div>
      </div>
    );
}

export default Slot;
