import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import MotionButton from "../../components/MotionButton";
function ExtendedInfo({
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
  debugger;
  const { userList } = useSelector((state) => state.diaries); // get all users to share the item with
  const item = extendedItemInfo?.item
    ? extendedItemInfo.item
    : extendedItemInfo;
  const {
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

  const exitAnimation = {
    animate: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };
  const openAnimation = {
    initial: { x: -50, y: -60 },
    animate: { x: 0, y: 0, transition: { duration: 1 } },
  };
  const closeAnimation = {
    animate: {
      x: -50,
      y: -60,
      opacity: 0,
      transition: {
        duration: 1,
      },
    },
  };
  return (
    <motion.div
      variants={!isOpen ? exitAnimation : {}}
      animate="animate"
      className="blur-bg"
    >
      <motion.div
        variants={isOpen ? openAnimation : closeAnimation}
        initial="initial"
        animate="animate"
        onAnimationComplete={() => {
          // Callback triggered after animation completes
          if (!isOpen) {
            hideInfo(false);
          }
        }}
        key="extended-container"
        className="info-container container overflow-auto"
      >
        <motion.div key="form" className="row border ">
          <motion.div
            key="col1"
            id="col1"
            className="col-lg-4 col-md-12 col-xs-12 "
          >
            <motion.div key="row-col1" className="row">
              <motion.div key="large-icon" className="col-lg-12">
                <ItemIcon
                  item={extendedItemInfo}
                  enchantment={enchantment}
                  large={true}
                />
              </motion.div>
              {!minimized && (
                <div className="row">
                  <div className="col-lg-6 col-md-4 col-sm-6">
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
                  <div className="col-lg-6 col-md-4 col-sm-6 ">
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
                  <div className="col-lg-6 col-md-4 col-sm-6 ">
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
                  <div className="col-lg-6 col-md-4 col-sm-6 ">
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
                  <div className="col-lg-6 col-md-4 col-sm-6 ">
                    <motion.button
                      variants={buttonImpackt}
                      whileHover="whileHover"
                      whileTap="whileTap"
                      onClick={() => removeItem(extendedItemInfo?._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </motion.button>
                  </div>
                  <div className="col-lg-6 col-md-4 col-sm-6 ">
                    {category === "Ressource" && genus !== "Sattel" ? (
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
              {dbButtons && <MotionButton name={extendedItemInfo?._id} icon={faPlus} onClick={toPlayer} />}
            </motion.div>
          </motion.div>
          <div id="col2" className="col-lg-8 col-md-12 border-pattern left">
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
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>
                <div className="col-lg-6 col-md-12">
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
                        <strong>{value}</strong>
                      </li>
                    )}
                    <li>
                      Gattung: <strong>{genus}</strong>
                    </li>
                    <li>
                      Typ: <strong>{type}</strong>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-6 col-md-12  col-sm-12 ">
                  <ul>
                    <li>
                      Preis: <strong>{price}</strong>
                    </li>
                    <li>
                      Gewicht: <strong>{weight}</strong>
                    </li>
                    <li>
                      Wertigkeit: <strong>{rarity}</strong>
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
                        <strong>{dice}</strong>
                      </li>
                    </ul>
                  </div>
                )}

                {bonuses && (
                  <div className="col-lg-12 col-md-12 col-sm-12 ">
                    <ul>
                      <li>
                        Bonus: <strong>{bonuses}</strong>
                      </li>
                    </ul>
                  </div>
                )}

                {showMaterials && (
                  <h3>
                    {production ? `Herstellung (${production})` : "Materialen"}
                  </h3>
                )}

                {showMaterials &&
                  material.map((material) => {
                    console.log(material && typeof material[0] !== "string");
                    const item = material.element;
                    const amount = material.amount;
                    const name = item?.name;
                    console.log(item, amount, name);
                    return (
                      <div className="col col-lg-6 col-md-4" key={item?._id}>
                        <ItemIcon item={item} specialAmount={amount} />
                        <strong>{name}</strong>
                      </div>
                    );
                  })}
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
                <strong>Wähle eine Person zum Teilen aus:</strong>
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
                    <strong>
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
