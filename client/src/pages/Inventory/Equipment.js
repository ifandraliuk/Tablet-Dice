import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EquippedItem from "./EquippedItem";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faRectangleXmark, faSun, faSnowflake, faCloudRain, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { getCategoryBoni, getUserWeapons } from "../../features/inventory/inventorySlice";
import { getProfession } from "../../features/player/playerSlice";

const Equipment = memo(({ setShowInfo, err }) => {
  console.log("re-rendering equipment");
  const dispatch = useDispatch();
  const equipped = useSelector((state) =>
    state.inventory.inventory.filter((el) => el.status === "Ausgerüstet")
  );
  const { armor, armorCategory, armorBoni, mainWeapon, secondWeapon } = useSelector(
    (state) => state.inventory
  );
  const { profession, fractionTheme } = useSelector(
    (state) => state.player
  );
  console.log(equipped, mainWeapon, secondWeapon);
  useEffect(() => {
    dispatch(getUserWeapons());
    dispatch(getProfession())
    
  }, []);

  const getArmorBonusValue = (armorType) => {
    console.log(armorType);
    if(armorBoni?.length > 0){
      const foundBoni = armorBoni.find((el) => el.bonus.type === armorType);
      console.log(`Value for ${armorType}: ${foundBoni?.value}`);
      return foundBoni ? foundBoni.value : null;
    } else return null

  };

  return (
    <div className="container w-auto">
      <div className="row justify-content-center " >
        <div className="col-auto">Rüstungsklasse: <strong className={`${fractionTheme}-text`}>{armorCategory}</strong></div>
      </div>
      <div className="row justify-content-center ">
        
        <div className="col-auto ">
          <FontAwesomeIcon icon={faShield} /> {armor}
        </div>
        <div className="col-auto  violet-text">
          <FontAwesomeIcon icon={faShieldHalved} /> 
          {getArmorBonusValue('Magie') ? getArmorBonusValue('Magie') : 0}
        </div>
        <div className="col-auto  yellow-text">
          <FontAwesomeIcon icon={faSun} /> {getArmorBonusValue('Hitze') ? getArmorBonusValue('Hitze') : 0}
        </div>
        <div className="col-auto  cyan-text">
          <FontAwesomeIcon icon={faSnowflake} /> {getArmorBonusValue('Kälte') ? getArmorBonusValue('Kälte') : 0}
        </div>
        <div className="col-auto  blue-text">
          <FontAwesomeIcon icon={faCloudRain} /> {getArmorBonusValue('Wasser') ? getArmorBonusValue('Wasser') : 0}
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
          <img className="userclass-img" src={`/classes_img/${profession?.name}.svg`} />
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

export default Equipment;
