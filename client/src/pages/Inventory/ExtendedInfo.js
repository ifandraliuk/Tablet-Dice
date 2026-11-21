import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ItemIcon from "../../components/ItemIcon";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import {
  faCoins,
  faLeftLong,
  faMinus,
  faPaste,
  faPerson,
  faPlus,
  faShareNodes,
  faSlash,
  faTrash,
  faUserSlash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { getUsers } from "../../features/diary/diarySlice";
import { buttonImpackt } from "../../data/Animations";
import { itemNames } from "../../data/ConstVariables";
import { getOriginAccentStyle } from "../../data/OriginColors";
import MotionButton from "../../components/MotionButton";

function ExtendedInfo({
  setShowInfo,
  minimized,
  dbButtons,
  customItemInfo,
  hideInfo,
  toPlayer,
  addAmount,
  substractAmount,
  splitStack,
  shareItem,
  equipItem,
  unEquipItem,
  removeItem,
}) {
  const userName = JSON.parse(localStorage.getItem("user"))?.name;
  const [contentToShow, setContentToShow] = useState("info");
  const [isOpen, setIsOpen] = useState(true);
  const [inputValue, setInputValue] = useState(0);
  const [equipmentActionError, setEquipmentActionError] = useState("");
  const [equipmentActionLoading, setEquipmentActionLoading] = useState(false);
  const closeButtonRef = useRef(null);
  const stateInfo = useSelector((state) =>
    state.inventory.inventory?.find(
      (el) => el._id.toString() === state.inventory.extendedId.toString()
    )
  );

  console.log(customItemInfo, stateInfo);
  const extendedItemInfo = customItemInfo ? customItemInfo : stateInfo;
  const { fractionTheme } = useSelector((state) => state.player); // get all users to share the item with
  const { userList } = useSelector((state) => state.diaries); // get all users to share the item with
  const item = extendedItemInfo?.item
    ? extendedItemInfo.item
    : extendedItemInfo;
  const {
    _id,
    category,
    value,
    rarity,
    genus,
    type,
    weight,
    name,
    price,
    dice,
    production,
    bonuses,
    material,
  } = item;
  const enchantment = extendedItemInfo.enchantment
    ? extendedItemInfo.enchantment
    : {};
  const showMaterials = material?.[0]?.amount !== undefined;
  const equippedItem = extendedItemInfo.status === "Ausgerüstet" ? true : false;
  const itemDetails = [
    ...(category !== "Ressource"
      ? [[category === "Rüstung" ? "Rüstwert" : "Reichweite", value]]
      : []),
    ["Gattung", genus],
    ["Typ", type],
    ["Preis", price],
    ["Gewicht", weight],
  ];
  const rarityColor = itemNames?.rarity?.[rarity] || "common";
  const detailColumns = [
    itemDetails.filter((_, index) => index % 2 === 0),
    itemDetails.filter((_, index) => index % 2 === 1),
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    if (contentToShow === "share" && userList.length === 0) {
      console.log("getting users");
      dispatch(getUsers());
    }
  }, [contentToShow, dispatch, userList.length]);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowInfo(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [setShowInfo]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const canEquip =
    !((category === "Ressource" && genus !== "Sattel") ||
      (category === "Waffe" && genus === "Werkzeug"));

  const handleEquipmentAction = async () => {
    setEquipmentActionError("");
    if (equippedItem) {
      setEquipmentActionLoading(true);
      try {
        await unEquipItem(extendedItemInfo._id);
        toast.success(`${name} wurde abgelegt.`);
        setShowInfo(false);
      } catch (error) {
        const message =
          typeof error === "string"
            ? error
            : error.message || "Ablegen ist fehlgeschlagen.";
        toast.error(message);
        setEquipmentActionError(
          message
        );
      } finally {
        setEquipmentActionLoading(false);
      }
      return;
    }

    setEquipmentActionLoading(true);
    try {
      const result = await equipItem(extendedItemInfo._id);
      const replacementCount =
        Number(Boolean(result.unequipItem)) +
        Number(Boolean(result.additionalUnequip));
      toast.success(
        replacementCount > 0
          ? `${name} ausgerüstet. ${replacementCount === 1 ? "Ein Gegenstand wurde" : "Gegenstände wurden"} in den Rucksack gelegt.`
          : `${name} wurde ausgerüstet.`
      );
      setShowInfo(false);
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error.message || "Ausrüsten ist fehlgeschlagen.";
      toast.error(message);
      setEquipmentActionError(
        message
      );
    } finally {
      setEquipmentActionLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="extended-info-backdrop"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        key="extended-container"
        className={`extended-info-modal overflow-auto${contentToShow === "info" ? " extended-info-modal--details" : ""}`}
        style={getOriginAccentStyle(fractionTheme)}
        role="dialog"
        aria-modal="true"
        aria-label={`Gegenstand: ${name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="extended-info-modal__close"
          aria-label="Fenster schließen"
          onClick={() => setShowInfo(false)}
        >
          <FontAwesomeIcon icon={faX} aria-hidden="true" />
        </button>
        <motion.div key="form" className="row extended-info-layout">
          <motion.div
            key="col1"
            id="col1"
            className="col-lg-3 col-md-4 col-12 extended-info-sidebar"
          >
            <motion.div key="row-col1" className="extended-info-sidebar__content">
              <motion.div key="large-icon" className="extended-info-sidebar__icon">
                <ItemIcon
                  item={extendedItemInfo}
                  enchantment={enchantment}
                  large={true}
                />
              </motion.div>
              {!minimized && (
                <div className="extended-info-actions">
                  <div className="extended-info-action">
                    <motion.button
                      variants={buttonImpackt}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      value={extendedItemInfo._id}
                      onClick={(e) => addAmount(e.currentTarget.value)}
                      aria-label="Gegenstand hinzufügen"
                      title="Gegenstand hinzufügen"
                    >
                      <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
                      <span>Hinzufügen</span>
                    </motion.button>
                  </div>
                  <div className="extended-info-action">
                    <motion.button
                      variants={buttonImpackt}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      value={extendedItemInfo._id}
                      onClick={(e) => substractAmount(e.currentTarget.value)}
                      aria-label="Gegenstand abziehen"
                      title="Gegenstand abziehen"
                    >
                      <FontAwesomeIcon icon={faMinus} aria-hidden="true" />
                      <span>Abziehen</span>
                    </motion.button>
                  </div>
                  <div
                    className={`extended-info-action${contentToShow === "share" ? " is-active" : ""}`}
                  >
                    <motion.button
                      variants={buttonImpackt}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      id="share"
                      onClick={(e) => setContentToShow(e.currentTarget.id)}
                      aria-label="Gegenstand teilen"
                      title="Gegenstand teilen"
                    >
                      <FontAwesomeIcon icon={faShareNodes} aria-hidden="true" />
                      <span>Teilen</span>
                    </motion.button>
                  </div>
                  <div className="extended-info-action">
                    <motion.button
                      variants={buttonImpackt}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      id="split"
                      onClick={(e) => setContentToShow(e.currentTarget.id)}
                      aria-label="Stapel aufteilen"
                      title="Stapel aufteilen"
                    >
                      <FontAwesomeIcon icon={faPaste} aria-hidden="true" />
                      <span>Aufteilen</span>
                    </motion.button>
                  </div>
                  <div className="extended-info-action">
                    <motion.button
                      variants={buttonImpackt}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      onClick={() => removeItem(extendedItemInfo?._id)}
                      aria-label="Gegenstand löschen"
                      title="Gegenstand löschen"
                    >
                      <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
                      <span>Löschen</span>
                    </motion.button>
                  </div>
                  <div className="extended-info-action extended-info-action--equipment">
                    <motion.button
                      type="button"
                      className="extended-info-equipment-button"
                      disabled={equipmentActionLoading || (!canEquip && !equippedItem)}
                      aria-label={equippedItem ? "Gegenstand ablegen" : canEquip ? "Gegenstand ausrüsten" : "Nicht ausrüstbar"}
                      title={canEquip || equippedItem ? undefined : "Dieser Gegenstand kann nicht ausgerüstet werden"}
                      onClick={handleEquipmentAction}
                      variants={buttonImpackt}
                      whileHover="whileHover"
                      whileTap="whileTap"
                    >
                      <FontAwesomeIcon
                        icon={equippedItem ? faUserSlash : faPerson}
                        aria-hidden="true"
                      />
                      <span>
                        {equipmentActionLoading
                          ? "Bitte warten …"
                          : equippedItem
                          ? "Ablegen"
                          : canEquip
                          ? "Ausrüsten"
                          : "Nicht ausrüstbar"}
                      </span>
                    </motion.button>
                  </div>
                </div>
              )}
              {dbButtons && (
                <div className="extended-info-add-action">
                  <MotionButton
                    name={extendedItemInfo?._id}
                    icon={faPlus}
                    onClick={toPlayer}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
          <div
            id="col2"
            className="col-lg-9 col-md-8 col-12 extended-info-content"
          >
            <>
              {equipmentActionError && (
                <p className="extended-info-equipment-error" role="alert">
                  {equipmentActionError}
                </p>
              )}
            {contentToShow === "info" && (
              <motion.div
                name="info-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5 } }}
                className="row"
              >
                <header className="col-12 extended-info-item-header">
                  <div className="extended-info-item-heading">
                    <span className="extended-info-mode-label">{category}</span>
                    <h2>{name}</h2>
                  </div>
                  <span className={`extended-info-rarity ${rarityColor}`}>
                    {rarity}
                  </span>
                </header>
                <div className="col-12 extended-info-detail-grid">
                  {detailColumns.map((column, columnIndex) => (
                    <dl className="extended-info-detail-column" key={columnIndex}>
                      {column.map(([label, detailValue]) => (
                        <div className="extended-info-detail" key={label}>
                          <dt>{label}</dt>
                          <dd className={`${fractionTheme}-text`}>{detailValue}</dd>
                        </div>
                      ))}
                    </dl>
                  ))}
                </div>
                {dice && (
                  <div className="col-12 extended-info-highlight">
                    <span>
                      {category === "Waffe"
                        ? "Schaden"
                        : category === "Ressource"
                        ? "Abbauen / Verarbeiten"
                        : "Widerstand"}
                    </span>
                    <strong className={`${fractionTheme}-text`}>{dice}</strong>
                  </div>
                )}

                {bonuses && (
                  <div className="col-12 extended-info-highlight">
                    <span>Bonus</span>
                    <strong className={`${fractionTheme}-text`}>{bonuses}</strong>
                  </div>
                )}

                <section
                  className="col-12 extended-info-materials-section"
                  hidden={!showMaterials}
                >
                  <h3 className="extended-info-materials-heading">
                    {production ? `Herstellung · ${production}` : "Materialien"}
                  </h3>
                  <div className="extended-info-materials">
                    {material.map((material) => {
                      const materialItem = material.element;
                      const amount = material.amount;
                      return (
                        <div
                          className="extended-info-material"
                          key={materialItem?._id}
                        >
                          <ItemIcon
                            item={materialItem}
                            specialAmount={amount}
                          />
                          <div className="extended-info-material__details">
                            <strong className={`${fractionTheme}-text`}>
                              {materialItem?.name}
                            </strong>
                            <span>Menge: {amount}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </motion.div>
            )}
            {contentToShow === "share" && (
              <div name="share-content" className="extended-info-share">
                <div className="extended-info-share-header">
                  <div>
                    <span className="extended-info-mode-label">Teilen</span>
                    <h2>{name}</h2>
                  </div>
                  <button
                    type="button"
                    id="info"
                    aria-label="Zurück zu den Item-Details"
                    onClick={(e) => setContentToShow(e.currentTarget.id)}
                  >
                    <FontAwesomeIcon icon={faLeftLong} />
                  </button>
                </div>
                <strong className={`${fractionTheme}-text extended-info-share-prompt`}>
                  Wähle eine Person zum Teilen aus:
                </strong>
                <div className="extended-info-share-list">
                  {userList &&
                    userList
                      .filter((user) => user.name !== userName)
                      .slice()
                      .sort((a, b) => a.name.localeCompare(b.name, "de"))
                      .map((user) => (
                        <motion.button
                          key={user.id}
                          type="button"
                          onClick={() =>
                            shareItem(extendedItemInfo._id, user.id)
                          }
                          variants={buttonImpackt}
                          whileHover="whileHover"
                          whileTap="whileTap"
                        >
                          {user.name}
                        </motion.button>
                      ))}
                </div>
              </div>
            )}
            {contentToShow === "split" && (
              <motion.div
                name="split-content"
                className="extended-info-share extended-info-share--split"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
              >
                <div className="extended-info-share-header">
                  <div>
                    <span className="extended-info-mode-label">Aufteilen</span>
                    <h2>{name}</h2>
                  </div>
                  <button
                    type="button"
                    id="info"
                    aria-label="Zurück zu den Item-Details"
                    onClick={(e) => setContentToShow(e.currentTarget.id)}
                  >
                    <FontAwesomeIcon icon={faLeftLong} />
                  </button>
                </div>
                {extendedItemInfo.amount > 1 ? (
                  <div className="extended-info-split-form">
                    <strong className={`${fractionTheme}-text extended-info-share-prompt`}>
                      Wie viele Gegenstände soll der neue Stapel enthalten?
                    </strong>
                    <div className="extended-info-split-controls">
                      <input
                        type="number"
                        value={inputValue}
                        onChange={handleInputChange}
                        aria-label="Anzahl der Gegenstände im neuen Stapel"
                      />
                      <button
                        type="button"
                        id={extendedItemInfo._id}
                        className="extended-info-split-submit"
                        onClick={(e) =>
                          splitStack(inputValue, e.currentTarget.id)
                        }
                      >
                        Aufteilen
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="extended-info-split-error">
                    Du kannst diese Stapel nicht aufteilen, die ist schon klein
                    genug.
                  </div>
                )}
              </motion.div>
            )}
              </>
          
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ExtendedInfo;
