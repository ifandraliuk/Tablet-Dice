import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EquippedItem from "./EquippedItem";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShield,
  faRectangleXmark,
  faSun,
  faSnowflake,
  faCloudRain,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import {
  getCategoryBoni,
  getUserWeapons,
} from "../../features/inventory/inventorySlice";
import { getProfession } from "../../features/player/playerSlice";
import ItemIcon from "../../components/ItemIcon";
import { itemNames } from "../../data/ConstVariables";

const getEquipmentTileClass = (equippedItem) => {
  const item = equippedItem?.item ?? equippedItem;
  const rarity =
    itemNames?.rarity?.[equippedItem?.enchantment?.rarity ?? item?.rarity] ??
    "unknown";

  return `inventory-item inventory-equipment__slot inventory-item--rarity-${rarity}`;
};

const Equipment = memo(({ setShowInfo, err }) => {
  //console.log("re-rendering equipment");
  const dispatch = useDispatch();
  const equipped = useSelector((state) =>
    state.inventory.inventory.filter((el) => el.status === "Ausgerüstet")
  );
  const { armor, armorCategory, armorBoni, mainWeapon, secondWeapon } =
    useSelector((state) => state.inventory);
  const { profession, fractionTheme } = useSelector((state) => state.player);
  // console.log(equipped, mainWeapon, secondWeapon);
  useEffect(() => {
    dispatch(getUserWeapons());
    dispatch(getProfession());
  }, []);

  const getArmorBonusValue = (armorType) => {
    // console.log(armorType);
    if (armorBoni?.length > 0) {
      const foundBoni = armorBoni.find((el) => el.bonus.type === armorType);
      // console.log(`Value for ${armorType}: ${foundBoni?.value}`);
      return foundBoni ? foundBoni.value : null;
    } else return null;
  };

  return (
    <div className="container w-auto">
      <div className="row justify-content-center ">
        <div className="col-auto">
          Rüstungsklasse:{" "}
          <strong className={`${fractionTheme}-text`}>{armorCategory}</strong>
        </div>
      </div>
      <div className="row justify-content-center ">
        <div className="col-auto ">
          <FontAwesomeIcon icon={faShield} /> {armor}
        </div>
        <div className="col-auto  violet-text">
          <FontAwesomeIcon icon={faShieldHalved} />
          {getArmorBonusValue("Magie") ? getArmorBonusValue("Magie") : 0}
        </div>
        <div className="col-auto  yellow-text">
          <FontAwesomeIcon icon={faSun} />{" "}
          {getArmorBonusValue("Hitze") ? getArmorBonusValue("Hitze") : 0}
        </div>
        <div className="col-auto  cyan-text">
          <FontAwesomeIcon icon={faSnowflake} />{" "}
          {getArmorBonusValue("Kälte") ? getArmorBonusValue("Kälte") : 0}
        </div>
        <div className="col-auto  blue-text">
          <FontAwesomeIcon icon={faCloudRain} />{" "}
          {getArmorBonusValue("Wasser") ? getArmorBonusValue("Wasser") : 0}
        </div>
      </div>
      {err && <div className={`${err.variant}-alert`}>{err.msg}</div>}
      <div className="inventory-equipment">
        <div className="inventory-equipment__slots inventory-equipment__slots--left">
          {["Kopf", "Brust", "Hüfte", "Beine"].map((name, i) => {
            const equippedItem = equipped?.find(
              (el) => el.item?.genus === name
            );
            if (equippedItem) {
              return (
                <motion.div
                  className={getEquipmentTileClass(equippedItem)}
                  data-slot-label={`Slot: ${name}`}
                  key={name}
                >
                  <EquippedItem
                    equippedItem={{ ...equippedItem }}
                    category={name}
                    delayValue={i}
                    setShowInfo={setShowInfo}
                  />
                </motion.div>
              );
            } else {
              return (
                <motion.div
                  className={getEquipmentTileClass()}
                  data-slot-label={`Slot: ${name}`}
                  role="img"
                  aria-label={`Leerer Ausrüstungsslot: ${name}`}
                  key={name}
                >
                  <ItemIcon
                    equippedItem={{ ...equippedItem }}
                    category={name}
                    delayValue={i}
                    setShowInfo={false}
                    isEmpty={true}
                  />
                </motion.div>
              );
            }
          })}
        </div>
        <div className="inventory-equipment__character">
          {profession?._id && (
            <img
              className="userclass-img"
              src={`/classes_img/${profession._id}.svg`}
              alt={`${profession.name} Klasse`}
              onError={(event) => {
                event.currentTarget.hidden = true;
              }}
            />
          )}
        </div>
        <div className="inventory-equipment__slots inventory-equipment__slots--right">
          {["Rücken", "Hals", "Arme", "Füße"].map((name, i) => {
            const equippedItem = equipped?.find((el) => el.item.genus === name);
            if (equippedItem) {
              return (
                <motion.div
                  className={getEquipmentTileClass(equippedItem)}
                  data-slot-label={`Slot: ${name}`}
                  key={name}
                >
                  <EquippedItem
                    equippedItem={{ ...equippedItem }}
                    category={name}
                    delayValue={i}
                    setShowInfo={setShowInfo}
                  />
                </motion.div>
              );
            } else {
              return (
                <motion.div
                  className={getEquipmentTileClass()}
                  data-slot-label={`Slot: ${name}`}
                  role="img"
                  aria-label={`Leerer Ausrüstungsslot: ${name}`}
                  key={name}
                >
                  <ItemIcon
                    equippedItem={{ ...equippedItem }}
                    category={name}
                    delayValue={i}
                    setShowInfo={false}
                    isEmpty={true}
                  />
                </motion.div>
              );
            }
          })}
        </div>
      </div>
      <div className="row w-100 justify-content-center inventory-equipment__weapons">
          {["Fernkampf", "Haupthand", "Nebenhand", "Finger"].map((name, i) => {
            let equippedItem;
            if (name === "Haupthand") {
              equippedItem = mainWeapon;
            } else if (name === "Nebenhand") {
              equippedItem = secondWeapon;
            } else if (name === "Fernkampf") {
              equippedItem = equipped?.find(
                (el) =>
                  el.item.category === "Waffe" &&
                  ["Wurfwaffe", "Armbrust", "Bogen", "Schusswaffe"].includes(
                    el.item.genus
                  )
              );
            } else {
              equippedItem = equipped?.find((el) => el.item.genus === name);
            }
            // console.log("waffen");
            const keyFor = `${name}-${equippedItem?._id ?? "empty"}`;
            if (equippedItem) {
              return (
                <motion.div
                  className={getEquipmentTileClass(equippedItem)}
                  data-slot-label={`Slot: ${name}`}
                  key={keyFor}
                >
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
                <motion.div
                  className={getEquipmentTileClass()}
                  data-slot-label={`Slot: ${name}`}
                  role="img"
                  aria-label={`Leerer Ausrüstungsslot: ${name}`}
                  key={keyFor}
                >
                  <ItemIcon
                    item={equippedItem}
                    category={name}
                    delayValue={i}
                    setShowInfo={false}
                    isEmpty={true}
                  />
                </motion.div>
              );
            }
          })}
      </div>
    </div>
  );
});

export default Equipment;
