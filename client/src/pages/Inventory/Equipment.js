import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EquippedItem from "./EquippedItem";
import { motion } from "framer-motion";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShield,
  faRectangleXmark,
  faSun,
  faSnowflake,
  faCloudRain,
  faShieldHalved,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import {
  getCategoryBoni,
  getUserWeapons,
} from "../../features/inventory/inventorySlice";
import { getProfession } from "../../features/player/playerSlice";
import ItemIcon from "../../components/ItemIcon";
import { itemNames } from "../../data/ConstVariables";
import { getOriginAccentStyle } from "../../data/OriginColors";
import "../../Styles/ThemedModal.css";

const getEquipmentTileClass = (equippedItem) => {
  const item = equippedItem?.item ?? equippedItem;
  const rarity =
    itemNames?.rarity?.[equippedItem?.enchantment?.rarity ?? item?.rarity] ??
    "unknown";

  return `inventory-item inventory-equipment__slot item-rarity-${rarity}`;
};

const Equipment = memo(({ setShowInfo, onSelectEmptySlot, selectedSlot, err }) => {
  //console.log("re-rendering equipment");
  const dispatch = useDispatch();
  const [showProtectionInfo, setShowProtectionInfo] = useState(false);
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
        <div className="inventory-equipment-panel__heading">
          <h2 id="inventory-equipment-title">Ausrüstung</h2>
          <button
            type="button"
            className="inventory-protection-info__button"
            aria-label="Informationen zu Rüstung und Widerständen"
            title="Informationen zu Rüstung und Widerständen"
            aria-haspopup="dialog"
            onClick={() => setShowProtectionInfo(true)}
          >
            <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
          </button>
        </div>
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
      <Modal
        show={showProtectionInfo}
        onHide={() => setShowProtectionInfo(false)}
        centered
        scrollable
        className="themed-modal inventory-protection-modal"
        style={getOriginAccentStyle(fractionTheme)}
        aria-labelledby="inventory-protection-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="inventory-protection-title">Rüstung und Widerstände</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section aria-labelledby="protection-armor-heading">
            <h3 id="protection-armor-heading">Rüstungsklasse und Rüstungswert</h3>
            <p>
              Die Rüstungsklasse richtet sich nach dem Gesamtgewicht der ausgerüsteten
              Gegenstände der Gattungen Kopf, Brust, Hüfte, Beine, Arme und Füße.
              Der Rüstungswert ist die Summe ihrer Werte.
            </p>
            <p>
              Plattenrüstung bietet den höchsten Rüstungswert, leichte Rüstung den
              niedrigsten; dafür bleibt man in leichter Rüstung beweglicher.
            </p>
            <ul>
              <li><strong>Leicht: 0 bis 1,6 kg.</strong> 1 Kampfaktion, 1 Paradeaktion und 1 Bonusaktion.</li>
              <li><strong>Mittel: 1,7 bis 3,9 kg.</strong> 1 Kampfaktion und 1 Paradeaktion, keine Bonusaktion; Ausnahmen sind z. B. Dolche.</li>
              <li><strong>Schwer (Kette): 4 bis 6,5 kg.</strong> 1 Kampfaktion, keine Parade- oder Bonusaktion; Ausnahme Schild. Heimlichkeit −1 pro Rüstungsgegenstand.</li>
              <li><strong>Schwer (Platte): ab 6,6 kg.</strong> 1 Kampfaktion, keine Parade- oder Bonusaktion; Ausnahme Schild. Geschicklichkeit −1 und Heimlichkeit −2 pro Rüstungsgegenstand.</li>
            </ul>
            <p>
              Paradeaktionen können auch zum Ausweichen genutzt werden. Die App ordnet
              Plattenrüstung derzeit nur bis 10 kg zu. Bei schwerer Rüstung blendet das
              Dashboard Bonusaktion und Reaktion aus.
            </p>
          </section>
          <section aria-labelledby="protection-resistance-heading">
            <h3 id="protection-resistance-heading">Widerstände und Wetter</h3>
            <p>
              Die Werte für Magie, Hitze, Kälte und Wasser zeigen die passenden
              Widerstandsboni aus ausgerüsteten Gegenständen; deren Wert richtet sich
              nach der Seltenheit des Bonus. Waffen der Gattung „Werkzeug“ werden
              auch ohne Ausrüstung berücksichtigt.
            </p>
            <p>
              Bei einer Wetterresistenzprobe würfelst du die angegebenen Würfel und
              vergleichst ihre Summe mit dem passenden Widerstandswert. Ist der
              Widerstand mindestens so hoch wie der Wurf, widerstehst du dem Effekt.
              Welches Wetter auftritt, bestimmt die Spielleitung.
            </p>
            <details>
              <summary>Kälte und Frost</summary>
              <ul>
                <li><strong>Kälte · W20:</strong> −1 auf Geschicklichkeit, Vitalität und Ausdauer; keine Regeneration im Schlaf.</li>
                <li><strong>Frost · W20 + W12:</strong> −2 auf Geschicklichkeit, Vitalität und Ausdauer; keine Regeneration im Schlaf. Täglich eine Vitalitätsprobe: Bei Misslingen entsteht eine Pneumonie, die bis zur Heilung täglich W20 Schaden verursacht.</li>
                <li><strong>Polarfrost · 2 W20:</strong> −4 auf Geschicklichkeit, Vitalität und Ausdauer sowie stündlich 2 W20 Schaden. Täglich eine Vitalitätsprobe gegen Pneumonie.</li>
              </ul>
            </details>
            <details>
              <summary>Hitze</summary>
              <ul>
                <li><strong>Trockene Hitze · W20:</strong> −1 auf Stärke, Vitalität und Ausdauer. Täglich eine Vitalitätsprobe: Bei Misslingen verursacht ein Sonnenstich einmalig W20 Schaden und −2 Intelligenz für einen Tag.</li>
                <li><strong>Schwüle Hitze · W20:</strong> −2 auf Stärke, Vitalität und Ausdauer.</li>
                <li><strong>Hölle · 2 W20:</strong> −4 auf Stärke, Vitalität und Ausdauer sowie stündlich 2 W20 Schaden.</li>
              </ul>
              <p>
                Bei trockener und schwüler Hitze muss täglich zweimal getrunken werden,
                um Ausdauer bzw. Mana im Schlaf zu regenerieren. Einmal trinken verhindert
                die Regeneration; ohne Trinken sinkt die Ausdauer um 30. In der Hölle
                sind viermal Trinken nötig; bei zweimal Trinken entfällt die Regeneration,
                ohne Trinken sinkt die Ausdauer um 60.
              </p>
            </details>
            <details>
              <summary>Regen und Sturm</summary>
              <ul>
                <li><strong>Regen · W20:</strong> +5 Ausdauerverbrauch bei allen Aktionen.</li>
                <li><strong>Gewittersturm · W20 + W12:</strong> +10 Ausdauerverbrauch bei allen Aktionen.</li>
                <li><strong>Apokalyptischer Orkanregen · 2 W20:</strong> +15 Ausdauerverbrauch bei allen Aktionen.</li>
              </ul>
              <p>
                Für die Regeneration von Vitalität, Ausdauer und Mana im Schlaf muss
                trocken geschlafen werden.
              </p>
            </details>
            <p className="inventory-protection-modal__note">
              Die App berechnet die Anwendung der Schutzwerte auf Schaden oder
              Wettereffekte nicht automatisch. Die Regeln für Magieresistenz werden
              hier nicht erläutert.
            </p>
          </section>
        </Modal.Body>
      </Modal>
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
                <motion.button
                  type="button"
                  className={`${getEquipmentTileClass()} inventory-equipment__slot-button${selectedSlot === name ? " is-selecting" : ""}`}
                  data-slot-label={`Slot: ${name}`}
                  key={name}
                  aria-label={`Leeren ${name}-Slot auswählen`}
                  aria-pressed={selectedSlot === name}
                  onClick={() => onSelectEmptySlot(name)}
                >
                  <ItemIcon
                    equippedItem={{ ...equippedItem }}
                    category={name}
                    delayValue={i}
                    setShowInfo={false}
                    isEmpty={true}
                  />
                </motion.button>
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
                <motion.button
                  type="button"
                  className={`${getEquipmentTileClass()} inventory-equipment__slot-button${selectedSlot === name ? " is-selecting" : ""}`}
                  data-slot-label={`Slot: ${name}`}
                  key={name}
                  aria-label={`Leeren ${name}-Slot auswählen`}
                  aria-pressed={selectedSlot === name}
                  onClick={() => onSelectEmptySlot(name)}
                >
                  <ItemIcon
                    equippedItem={{ ...equippedItem }}
                    category={name}
                    delayValue={i}
                    setShowInfo={false}
                    isEmpty={true}
                  />
                </motion.button>
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
                <motion.button
                  type="button"
                  className={`${getEquipmentTileClass()} inventory-equipment__slot-button${selectedSlot === name ? " is-selecting" : ""}`}
                  data-slot-label={`Slot: ${name}`}
                  key={keyFor}
                  aria-label={`Leeren ${name}-Slot auswählen`}
                  aria-pressed={selectedSlot === name}
                  onClick={() => onSelectEmptySlot(name)}
                >
                  <ItemIcon
                    item={equippedItem}
                    category={name}
                    delayValue={i}
                    setShowInfo={false}
                    isEmpty={true}
                  />
                </motion.button>
              );
            }
          })}
        </div>
      </section>
    </section>
  );
});

export default Equipment;
