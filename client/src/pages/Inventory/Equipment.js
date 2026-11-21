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
    <section
      className="inventory-equipment-panel"
      aria-labelledby="inventory-equipment-title"
    >
      <header className="inventory-equipment-panel__header">
        <h2 id="inventory-equipment-title">Ausrüstung</h2>
        <span>Angelegte Gegenstände und Schutzwerte</span>
      </header>
      <div
        className="inventory-equipment-summary"
        role="group"
        aria-label="Rüstungs- und Widerstandswerte"
      >
        <div className="inventory-equipment-summary__category">
          <span>Rüstungsklasse</span>
          <strong className={`${fractionTheme}-text`}>{armorCategory}</strong>
        </div>
        <div className="inventory-equipment-summary__stats">
          <div
            className="inventory-equipment-stat inventory-equipment-stat--armor"
            role="group"
            aria-label={`Rüstung: ${armor}`}
          >
            <FontAwesomeIcon icon={faShield} aria-hidden="true" />
            <span>Rüstung</span>
            <strong>{armor}</strong>
          </div>
          <div
            className="inventory-equipment-stat inventory-equipment-stat--magic"
            role="group"
            aria-label={`Magie: ${getArmorBonusValue("Magie") ?? 0}`}
          >
            <FontAwesomeIcon icon={faShieldHalved} aria-hidden="true" />
            <span>Magie</span>
            <strong>{getArmorBonusValue("Magie") ?? 0}</strong>
          </div>
          <div
            className="inventory-equipment-stat inventory-equipment-stat--heat"
            role="group"
            aria-label={`Hitze: ${getArmorBonusValue("Hitze") ?? 0}`}
          >
            <FontAwesomeIcon icon={faSun} aria-hidden="true" />
            <span>Hitze</span>
            <strong>{getArmorBonusValue("Hitze") ?? 0}</strong>
          </div>
          <div
            className="inventory-equipment-stat inventory-equipment-stat--cold"
            role="group"
            aria-label={`Kälte: ${getArmorBonusValue("Kälte") ?? 0}`}
          >
            <FontAwesomeIcon icon={faSnowflake} aria-hidden="true" />
            <span>Kälte</span>
            <strong>{getArmorBonusValue("Kälte") ?? 0}</strong>
          </div>
          <div
            className="inventory-equipment-stat inventory-equipment-stat--water"
            role="group"
            aria-label={`Wasser: ${getArmorBonusValue("Wasser") ?? 0}`}
          >
            <FontAwesomeIcon icon={faCloudRain} aria-hidden="true" />
            <span>Wasser</span>
            <strong>{getArmorBonusValue("Wasser") ?? 0}</strong>
          </div>
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
      <section
        className="inventory-equipment__weapon-group"
        aria-labelledby="inventory-weapons-title"
      >
        <h3 id="inventory-weapons-title">Waffen und Ringe</h3>
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
      </section>
    </section>
  );
});

export default Equipment;
