import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EquippedItem from "./EquippedItem";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import { getUserWeapons } from "../../features/inventoryPage/inventoryPageSlice";

const Equipment = memo(({ setShowInfo, armor, err, uclass }) => {
  console.log("re-rendering equipment");
  console.log(uclass);
  const dispatch = useDispatch();
  const equipped = useSelector((state) =>
    state.inventoryPage.inventory.filter((el) => el.status === "Ausgerüstet")
  );
  const { mainWeapon, secondWeapon } = useSelector(
    (state) => state.inventoryPage
  );
  console.log(equipped, mainWeapon, secondWeapon);
  useEffect(() => {
    dispatch(getUserWeapons());
  }, []);
  return (
    <div className="row w-auto">
      <div className="row justify-content-center ">
        <div className="col-auto ">
          <h3>
            <FontAwesomeIcon icon={faShield} />
            {`Rüstwert: ${armor}`}
          </h3>
        </div>
      </div>
      {err && <div className={`${err.variant}-alert`}>{err.msg}</div>}
      <div className="row justify-content-center">
        <div className="col-auto ">
          {["Kopf", "Brust", "Hüfte", "Beine"].map((name, i) => {
            console.log("kopf");
            const equippedItem = equipped?.find(
              (el) => el.item?.genus === name
            );
            if (equippedItem) {
              return (
                <motion.div className="row pb-4" key={name}>
                  <EquippedItem
                    equippedItem={equippedItem}
                    category={name}
                    delayValue={i}
                    setShowInfo={setShowInfo}
                  />
                </motion.div>
              );
            } else {
              return (
                <motion.div className="col-auto pb-4 " key={name}>
                  <FontAwesomeIcon icon={faRectangleXmark} />
                </motion.div>
              );
            }
          })}
        </div>
        <div className="col-lg-4 ">
          <img className="userclass-img" src={`/classes_img/${uclass}.svg`} />
        </div>
        <div className="col-auto ">
          {["Rücken", "Hals", "Arme", "Füße"].map((name, i) => {
            const equippedItem = equipped?.find((el) => el.item.genus === name);
            console.log("rücken");
            if (equippedItem) {
              return (
                <motion.div className="row pb-4" key={name}>
                  <EquippedItem
                    equippedItem={equippedItem}
                    category={name}
                    delayValue={i}
                    setShowInfo={setShowInfo}
                  />
                </motion.div>
              );
            } else {
              return (
                <motion.div className="col-auto pb-4" key={name}>
                  <FontAwesomeIcon icon={faRectangleXmark} />
                </motion.div>
              );
            }
          })}
        </div>
        <div className="row  w-auto justify-content-center">
          {["Verbrauch", "Haupthand", "Nebenhand", "Finger"].map((name, i) => {
            let equippedItem;
            if (name === "Haupthand") {
              equippedItem = mainWeapon;
            } else if (name === "Nebenhand") {
              equippedItem = secondWeapon;
            } else {
              equippedItem = equipped?.find((el) => el.item.genus === name);
            }
            console.log("waffen");
            if (equippedItem) {
              return (
                <motion.div className="col-auto pb-4" key={name}>
                  <EquippedItem
                    equippedItem={equippedItem}
                    category={name}
                    delayValue={i}
                    setShowInfo={setShowInfo}
                  />
                </motion.div>
              );
            } else {
              return (
                <motion.div className="col-auto pb-4" key={name}>
                  <FontAwesomeIcon icon={faRectangleXmark} />
                </motion.div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
});

/*
      <div
        className="row justify-content-center"
        style={{ color: "white" }}
      >{`Rüstwert: ${armor}`}</div>
      <div>{err && <Alert variant={err.variant}>{err.msg}</Alert>}</div>
      <div className="row justify-content-center m-3 ">
        <div className="col-3 order-lg-1 order-md-1 col-md-3 col-sm-6 w-auto h-auto ">
          {["Kopf",  "Brust", "Hüfte", "Beine"].map(
            (name, i) => (
              <motion.div className="row pb-4" key={name}
              >
                <EquippedItem category={name} delayValue={i} setShowInfo={setShowInfo}/>
              </motion.div>
            )
          )}
        </div>
        <div className="col-md-2 col-lg-6 order-lg-2 order-md-3 col-sm-12 w-auto  align-self-start">
            <img className="userclass-img" src={`/classes_img/${uclass}.svg`} />
        </div>
        <div className="col-3 order-lg-3 order-md-2 col-sm-6  w-auto">
          {["Rücken", "Hals", "Arme", "Füße"].map(
            (name, i) => (
              <div className="row pb-4" key={name}>
                <EquippedItem category={name} delayValue={i}  setShowInfo={setShowInfo}/>
              </div>
            )
          )}
        </div>
      </div>
      <div className="row  justify-content-center">
          {["Rücken", "Hals", "Arme", "Füße"].map(
            (name, i) => (
              <div className="col-2" key={name}>
                <EquippedItem category={name} delayValue={i}  setShowInfo={setShowInfo}/>
              </div>
            )
          )}
        </div>
    </>
*/
export default Equipment;
