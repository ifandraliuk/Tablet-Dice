import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ItemIcon from "../../components/ItemIcon";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
function MinimizedInfo({
    itemToShow
}) {
  const userName = JSON.parse(localStorage.getItem("user"))?.name;
  const [contentToShow, setContentToShow] = useState("info");
  const [isOpen, setIsOpen] = useState(true);
  const [inputValue, setInputValue] = useState(0);
  const stateInfo = useSelector((state) =>
    state.inventoryPage.inventory?.find(
      (el) => el._id.toString() === state.inventoryPage.extendedId.toString()
    )
  );

  console.log(customItemInfo, stateInfo);

  const { userList } = useSelector((state) => state.diaries); // get all users to share the item with
  const { item } = itemToShow;
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
  const enchantment = itemToShow.enchantment
    ? itemToShow.enchantment
    : {};
  const showMaterials =
    material && material[0].amount !== undefined ? true : false;
  const equippedItem = itemToShow.status === "Ausgerüstet" ? true : false;
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
                  item={itemToShow}
                  enchantment={enchantment}
                  large={true}
                />
              </motion.div>

            </motion.div>
          </motion.div>
          <div id="col2" className="col-lg-8 col-md-12 border-pattern left">
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
            
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default MinimizedInfo;
