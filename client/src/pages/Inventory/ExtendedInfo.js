import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ItemIcon from "../../components/ItemIcon";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const showMaterials =
    material && material[0].amount !== undefined ? true : false;
  const equippedItem = extendedItemInfo.status === "Ausgerüstet" ? true : false;
  const dispatch = useDispatch();
  useEffect(() => {
    if (contentToShow === "share" && userList.length === 0) {
      console.log("getting users");
      dispatch(getUsers());
    }
  }, [contentToShow, dispatch, userList.length]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="extended-info-backdrop"
      onClick={() => setShowInfo(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        key="extended-container"
        className="extended-info-modal container overflow-auto"
        style={getOriginAccentStyle(fractionTheme)}
        onClick={(e) => e.stopPropagation()}
      >
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
                    >
                      <FontAwesomeIcon icon={faPlus} />{" "}
                    </motion.button>
                  </div>
                  <div className="extended-info-action">
                    <motion.button
                      variants={buttonImpackt}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      value={extendedItemInfo._id}
                      onClick={(e) => substractAmount(e.currentTarget.value)}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </motion.button>
                  </div>
                  <div className="extended-info-action">
                    <motion.button
                      variants={buttonImpackt}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      id="share"
                      onClick={(e) => setContentToShow(e.currentTarget.id)}
                    >
                      <FontAwesomeIcon icon={faShareNodes} />
                    </motion.button>
                  </div>
                  <div className="extended-info-action">
                    <motion.button
                      variants={buttonImpackt}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      id="split"
                      onClick={(e) => setContentToShow(e.currentTarget.id)}
                    >
                      <FontAwesomeIcon icon={faPaste} />
                    </motion.button>
                  </div>
                  <div className="extended-info-action">
                    <motion.button
                      variants={buttonImpackt}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      onClick={() => removeItem(extendedItemInfo?._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </motion.button>
                  </div>
                  <div className="extended-info-action">
                    {(category === "Ressource" && genus !== "Sattel") || (category === "Waffe" && genus === "Werkzeug") ? (
                      <button disabled>
                        <FontAwesomeIcon icon={faPerson} />
                      </button>
                    ) : equippedItem ? (
                      <motion.button
                        onClick={() => unEquipItem(extendedItemInfo?._id)}
                        variants={buttonImpackt}
                        whileHover="whileHover"
                        whileTap="whileTap"
                      >
                        <FontAwesomeIcon icon={faUserSlash} />
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => equipItem(extendedItemInfo?._id)}
                        variants={buttonImpackt}
                        whileHover="whileHover"
                        whileTap="whileTap"
                      >
                        <FontAwesomeIcon icon={faPerson} />
                      </motion.button>
                    )}
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
            className="col-lg-9 col-md-8 col-12 border-pattern left extended-info-content"
          >
            {contentToShow === "info" && (
              <motion.div
                name="info-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5 } }}
                className="row"
              >
                <div className="col-lg-10 col-md-8">
                  <h2>{name}</h2>
                </div>
                <div className="col-lg-2 col-md-4">
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowInfo(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: "1.5rem",
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="col-12 col-md-auto extended-info-info-column">
                  <ul>
                    {category !== "Ressource" && (
                      <li>
                        {`${
                          category === "Rüstung"
                            ? "Rüstwert: "
                            : category === "Ressource"
                            ? ""
                            : "Reichweite: "
                        } `}
                        <strong className={`${fractionTheme}-text`}>{value}</strong>
                      </li>
                    )}
                    <li>
                      Gattung: <strong className={`${fractionTheme}-text`}>{genus}</strong>
                    </li>
                    <li>
                      Typ: <strong className={`${fractionTheme}-text`}>{type}</strong>
                    </li>
                  </ul>
                </div>
                <div className="col-12 col-md-auto extended-info-info-column">
                  <ul>
                    <li>
                      Preis: <strong className={`${fractionTheme}-text`}>{price}</strong>
                    </li>
                    <li>
                      Gewicht: <strong className={`${fractionTheme}-text`}>{weight}</strong>
                    </li>
                    <li>
                      Wertigkeit: <strong className={`${fractionTheme}-text`}>{rarity}</strong>
                    </li>
                  </ul>
                </div>

                <br />
                {dice && (
                  <div className="col-lg-12 col-md-12 col-sm-12 ">
                    <ul>
                      <li>
                        {category === "Waffe"
                          ? "Schaden: "
                          : category === "Ressource"
                          ? "Abbauen/Verarbeiten: "
                          : "Widerstand:"}
                        <strong className={`${fractionTheme}-text`}>{dice}</strong>
                      </li>
                    </ul>
                  </div>
                )}

                {bonuses && (
                  <div className="col-lg-12 col-md-12 col-sm-12 ">
                    <ul>
                      <li>
                        Bonus: <strong className={`${fractionTheme}-text`}>{bonuses}</strong>
                      </li>
                    </ul>
                  </div>
                )}

                {showMaterials && (
                  <>
                    <h3 className="col-12 extended-info-materials-heading">
                      {production ? `Herstellung (${production})` : "Materialen"}
                    </h3>
                    <div className="col-12 extended-info-materials">
                      {material.map((material) => {
                        const item = material.element;
                        const amount = material.amount;
                        const name = item?.name;
                        return (
                          <div
                            className="extended-info-material"
                            key={item?._id}
                          >
                            <ItemIcon item={item} specialAmount={amount} />
                            <strong className={`${fractionTheme}-text`}>
                              {name}
                            </strong>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            )}
            {contentToShow === "share" && (
              <div name="share-content" className="row">
                <div className="col-lg-10 col-md-8">
                  <h2>{name}</h2>
                </div>
                <div className="col-lg-2 col-md-4">
                  <button
                    id="info"
                    onClick={(e) => setContentToShow(e.currentTarget.id)}
                  >
                    <FontAwesomeIcon icon={faLeftLong} />
                  </button>
                </div>
                <strong className={`${fractionTheme}-text`}>Wähle eine Person zum Teilen aus:</strong>
                {userList &&
                  userList.map(
                    (user) =>
                      user.name !== userName && (
                        <div key={user.id} className="col-4">
                          <motion.button
                            id={user.id}
                            onClick={(e) =>
                              shareItem(extendedItemInfo._id, e.target.id)
                            }
                            variants={buttonImpackt}
                            whileHover="whileHover"
                            whileTap="whileTap"
                          >
                            {user.name}
                          </motion.button>
                        </div>
                      )
                  )}
              </div>
            )}
            {contentToShow === "split" && (
              <motion.div
                name="share-content"
                className="row"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
              >
                <div className="col-lg-10 col-md-8">
                  <h2>{name}</h2>
                </div>
                <div className="col-lg-2 col-md-4">
                  <button
                    id="info"
                    onClick={(e) => setContentToShow(e.currentTarget.id)}
                  >
                    <FontAwesomeIcon icon={faLeftLong} />
                  </button>
                </div>
                {extendedItemInfo.amount > 1 ? (
                  <div>
                    <strong className={`${fractionTheme}-text`}>
                      Wie viele Gegegnstände soll die neue Stapel haben?
                    </strong>
                    <input
                      type="number"
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                    <button
                      id={extendedItemInfo._id}
                      className="btn-save ms-1"
                      onClick={(e) => splitStack(inputValue, e.target.id)}
                    >
                      Aufteilen
                    </button>
                  </div>
                ) : (
                  <div className="alert error">
                    Du kannst diese Stapel nicht aufteilen, die ist schon klein
                    genug.
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ExtendedInfo;
