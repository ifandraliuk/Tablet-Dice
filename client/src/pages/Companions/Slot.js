import React, { useState } from "react";
import AttributesList from "./AttributesList";
import MathButtonGroup from "../../components/MathButtonGroup";
import ProgressBar from "../../components/ProgressBar";


function Slot({ i, category, data, usedBy, unlocked, slotOnClick }) {
  const {charismaValue,  info } = data;
  const localHP = localStorage.getItem(category);
  const [damageDone, setDamageDone] = useState(0);
  const [currentHP, setCurrentHP] = useState(localHP ? parseInt(localHP) : -1);
  console.log(currentHP)
  if (unlocked) {
    if (usedBy?.length === 1) {
      const { _id, creature, name, level } = usedBy[0];

      const add = () => {
        console.log(typeof currentHP, typeof damageDone);
        if (currentHP === -1) {
          console.log("first load +")
          setCurrentHP(() => creature?.hitpoints);
          localStorage.setItem(category, creature?.hitpoints);
        } else if (currentHP + damageDone <= creature?.hitpoints) {
          setCurrentHP((curr) => curr + damageDone);
          localStorage.setItem(category, currentHP + damageDone);
        }
      };
      const subtract = () => {
        if (currentHP === -1) {
          console.log("first load -")
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
            <div className="col-auto ">
              <div className="slot-number">{i}</div>
              <button
                id="Stall"
                name={_id}
                className="slot-number btn-remove mt-2"
                onClick={(e) =>{
                  slotOnClick(e.currentTarget.id, e.currentTarget.name)
                  localStorage.removeItem(category);
                  setCurrentHP(-1)
                }
                  
                
                }
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
            <div className="alert error">Erfordert {charismaValue} Charismapunkte</div>
          </div>
          <div className="col-3 border-pattern left repeat">
            <p>{info}</p>
          </div>
        </div>
      </div>
    );
}

export default Slot;
