import React, { useEffect, useRef, useState } from "react";
import "../../Styles/Inventory.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRefresh,
  faShield,
  faHammer,
  faSeedling,
  faFloppyDisk,
  faArrowRight,
  faCoins,
  faPaw,
  faPlus,
  faMinus,
  faPen,
  faX,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getInventory,
  addToInventory,
  getCategoryBoni,
  addAmount,
  substractAmount,
  shareWith,
  reset,
  extendInfo,
  splitAmount,
  removeFromInventory,
  updateTotalWeight,
  updateEquipmentStats,
  equip,
  unequip,
  getUserMoney,
  updateMoney,
  getLoadCapacity,
  getArmor,
  getUserWeapons,
} from "../../features/inventory/inventorySlice";
import { reset as playerReset } from "../../features/player/playerSlice";
import Equipment from "./Equipment";
import { motion } from "framer-motion";
import { buttonImpackt, pageTransition } from "../../data/Animations";
import Slot from "./Slot";
import ExtendedInfo from "./ExtendedInfo";
import MotionButton from "../../components/MotionButton";
import ItemsView from "./ItemsView";

const INVENTORY_CATEGORY_KEY = "inventory-active-category";
const CATALOG_CATEGORY_KEY = "inventory-catalog-category";
const INVENTORY_CATEGORIES = ["Rüstung", "Waffe", "Ressource", "Begleiter"];

function InventoryPage() {
  const {
    inventory,
    armor,
    totalWeight,
    capacity,
    capacityDetails,
    money,
    isError,
    message,
  } = useSelector((state) => state.inventory);
  const { fractionTheme, player, equipmentError } = useSelector(
    (state) => state.player
  );
  const [showInfo, setShowInfo] = useState(false);
  const inventoryPageMounted = useRef(false);

  const { userclass } = player;
  const { user } = useSelector((state) => state.auth);
  const [inventoryCategory, setInventoryCategory] = useState(() => {
    const savedCategory = localStorage.getItem(INVENTORY_CATEGORY_KEY);
    return savedCategory === "all" || INVENTORY_CATEGORIES.includes(savedCategory)
      ? savedCategory
      : "all";
  });
  const [catalogCategory, setCatalogCategory] = useState(() => {
    const savedCatalogCategory = localStorage.getItem(CATALOG_CATEGORY_KEY);
    if (INVENTORY_CATEGORIES.includes(savedCatalogCategory)) {
      return savedCatalogCategory;
    }

    const savedInventoryCategory = localStorage.getItem(INVENTORY_CATEGORY_KEY);
    return INVENTORY_CATEGORIES.includes(savedInventoryCategory)
      ? savedInventoryCategory
      : "Rüstung";
  });
  const [activeDb, setActiveDb] = useState(false);
  const [customInfo, setCustomInfo] = useState({});
  const [newMoney, updateBalance] = useState(money);
  const [moneyError, setMoneyError] = useState("");
  const [goldInput, setGoldInput] = useState("");
  const [silverInput, setSilverInput] = useState("");
  const [copperInput, setCopperInput] = useState("");
  console.log(newMoney);
  const [activeEditMoney, setActiveEditMoney] = useState(false);
  const [showCapacityDetails, setShowCapacityDetails] = useState(false);
  // Local state to manage the input field for new money
  const [newMoneyInput, setNewMoneyInput] = useState("");
  const [inputError, setInputError] = useState(""); // For showing error message
  // Regex pattern to validate input
  const moneyInputPattern = /^-?\d+,\d+,\d+$/;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(customInfo);

  useEffect(() => {
    if (inventoryPageMounted.current && isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  useEffect(() => {
    localStorage.setItem(INVENTORY_CATEGORY_KEY, inventoryCategory);
  }, [inventoryCategory]);

  useEffect(() => {
    localStorage.setItem(CATALOG_CATEGORY_KEY, catalogCategory);
  }, [catalogCategory]);

  useEffect(() => {
    inventoryPageMounted.current = true;
    if (!user) {
      navigate("/");
      dispatch(reset());
    } else {
      dispatch(reset());
      dispatch(getInventory());
      dispatch(getUserMoney());
    }
    return () => {
      inventoryPageMounted.current = false;
      dispatch(reset());
      dispatch(playerReset());
    };
  }, [user, dispatch, navigate]);

  useEffect(() => {
    dispatch(updateTotalWeight());
    dispatch(getArmor());
    dispatch(getLoadCapacity());
    dispatch(getCategoryBoni("resistance"));
  }, [dispatch, inventory]);

  // Handle the input change
  const moneyChange = (e) => {
    const id = parseInt(e.target.id);
    const value = parseInt(e.target.value);

    // Create a new array with the updated value
    const updatedMoney = money.map((currency, i) =>
      i === id ? value : currency
    );

    // Dispatch updateMoney action to update Redux state and backend
    dispatch(updateMoney({ money: updatedMoney }));
  };
  const handleUpdateMoney = (isAdding) => {
    const goldValue = parseInt(goldInput) || 0;
    const silverValue = parseInt(silverInput) || 0;
    const copperValue = parseInt(copperInput) || 0;

    let updatedMoney = [...money]; // Create a copy of current money

    if (isAdding) {
      // Adding logic with overflow handling
      updatedMoney[0] += goldValue; // Add Gold
      updatedMoney[1] += silverValue; // Add Silver
      updatedMoney[2] += copperValue; // Add Copper

      // Handle overflow for Copper to Silver
      if (updatedMoney[2] >= 100) {
        const overflowSilver = Math.floor(updatedMoney[2] / 100);
        updatedMoney[2] %= 100; // Remainder copper
        updatedMoney[1] += overflowSilver; // Add overflow to Silver
      }

      // Handle overflow for Silver to Gold
      if (updatedMoney[1] >= 100) {
        const overflowGold = Math.floor(updatedMoney[1] / 100);
        updatedMoney[1] %= 100; // Remainder silver
        updatedMoney[0] += overflowGold; // Add overflow to Gold
      }
    } else {
      // Subtracting logic with borrowing
      // Subtract copper first
      // Subtracting logic with validation
      updatedMoney[2] -= copperValue;
      if (updatedMoney[2] < 0) {
        // Borrow from silver if necessary
        const borrowFromSilver = Math.ceil(Math.abs(updatedMoney[2]) / 100);
        updatedMoney[2] += borrowFromSilver * 100; // Borrow copper from silver
        updatedMoney[1] -= borrowFromSilver; // Adjust silver accordingly
      }

      // Subtract silver next
      updatedMoney[1] -= silverValue;
      if (updatedMoney[1] < 0) {
        // Borrow from gold if necessary
        const borrowFromGold = Math.ceil(Math.abs(updatedMoney[1]) / 100);
        updatedMoney[1] += borrowFromGold * 100; // Borrow silver from gold
        updatedMoney[0] -= borrowFromGold; // Adjust gold accordingly
      }

      // Finally subtract gold
      updatedMoney[0] -= goldValue;

      // If there are insufficient funds overall, alert the user
      if (updatedMoney[0] < 0 || updatedMoney[1] < 0 || updatedMoney[2] < 0) {
        setMoneyError("Insufficient funds for this operation.");
        return; // Exit early if validation fails
      }
    }

    // Ensure no negative values
    updatedMoney = updatedMoney.map((amount) => Math.max(amount, 0));

    dispatch(updateMoney({ money: updatedMoney }))
      .then(() => {
        console.log("Money updated successfully");
        setActiveEditMoney(false);
        setMoneyError("");
      })
      .catch((err) => {
        err = "Failed to update money:" + err;
        setMoneyError(err);
      });

    // Clear the inputs after dispatching
    setGoldInput("");
    setSilverInput("");
    setCopperInput("");
  };
  const show = (id) => {
    setShowInfo((prevStatus) => !prevStatus);
    dispatch(extendInfo({ id: id }));
  };

  const hideInfo = () => {
    setShowInfo((prevStatus) => !prevStatus);
    setCustomInfo({});
  };

  const selectedCategory = activeDb ? catalogCategory : inventoryCategory;
  const weightPercentage =
    capacity > 0
      ? Math.min(Math.max((totalWeight / capacity) * 100, 0), 100)
      : 0;

  const addOne = (id) => {
    const data = {
      invId: id,
    };
    dispatch(addAmount(data));
  };

  const removeOne = (id) => {
    const data = {
      invId: id,
    };
    dispatch(substractAmount(data));
  };

  const toPlayer = (e) => {
    const itemId = e.currentTarget.name;
    dispatch(addToInventory({ id: itemId }));
    setShowInfo((prev) => !prev);
  };

  const addItemToInventory = (itemId) => {
    dispatch(addToInventory({ id: itemId }));
  };

  const splitStack = (amount, id) => {
    const data = {
      amount: amount,
      id: id,
    };
    dispatch(splitAmount(data));
  };

  const shareItem = (itemId, userId) => {
    const data = {
      uid: userId,
      inv: itemId,
    };
    dispatch(shareWith(data));
    setShowInfo(false);
    setMoneyError("");
  };

  const removeItem = (id) => {
    dispatch(removeFromInventory(id));
    setShowInfo(false);
  };

  const equipItem = (itemId) => {
    dispatch(equip({ invId: itemId }));
    //dispatch(getUserWeapons())
  };

  const unEquipItem = (id) => {
    dispatch(unequip({ id: id }));
  //  dispatch(getUserWeapons())
  };

  const onClickFilter = (e) => {
    e.preventDefault();
    const filterName = e.currentTarget.name;
    if (filterName === "all") {
      setInventoryCategory("all");
    } else if (activeDb) {
      setCatalogCategory(filterName);
    } else {
      setInventoryCategory(filterName);
    }
  };
  return (
    <motion.div
      variants={pageTransition}
      initial="init"
      animate="animate"
      exit="exit"
    >
      {showInfo && !activeDb && (
        <ExtendedInfo
        setShowInfo={setShowInfo}
          key="extended-info"
          minimized={false}
          hideInfo={setShowInfo}
          addAmount={addOne}
          substractAmount={removeOne}
          splitStack={splitStack}
          shareItem={shareItem}
          equipItem={equipItem}
          unEquipItem={unEquipItem}
          removeItem={removeItem}
        />
      )}
      {activeDb && showInfo && (
        <ExtendedInfo
        setShowInfo={setShowInfo}
          key="extended-info"
          toPlayer={toPlayer}
          customItemInfo={customInfo}
          hideInfo={hideInfo}
          minimized={true}
          dbButtons={true}
        />
      )}
      <div className="inventory-page">
        <div className={`${fractionTheme}-bg`}>
          <div className="container-fluid dark-bg g-5">
            <div className="inventory-mode-switch" role="group" aria-label="Inventaransicht">
              <button
                type="button"
                className={`inventory-mode-switch__button${!activeDb ? ` is-active ${fractionTheme}-text` : ""}`}
                aria-pressed={!activeDb}
                onClick={() => setActiveDb(false)}
              >
                Mein Inventar
              </button>
              <button
                type="button"
                className={`inventory-mode-switch__button${activeDb ? ` is-active ${fractionTheme}-text` : ""}`}
                aria-pressed={activeDb}
                onClick={() => setActiveDb(true)}
              >
                <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
                Gegenstände hinzufügen
              </button>
            </div>
            <div className="row">
              <div
                className={activeDb ? "col-12" : "col-lg-5 col-md-12 col-sm-12"}
              >
                <div
                  className="inventory-category-switch"
                  role="group"
                  aria-label="Inventarkategorie"
                >
                  {INVENTORY_CATEGORIES.map(
                    (category, i) => (
                  <button
                    key={category}
                    type="button"
                    name={category}
                    className={`inventory-category-switch__button${selectedCategory === category ? " is-active" : ""}`}
                    aria-pressed={selectedCategory === category}
                    onClick={onClickFilter}
                  >
                    <FontAwesomeIcon
                      icon={
                        i === 0
                          ? faShield
                          : i === 1
                          ? faHammer
                          : i === 2
                          ? faSeedling
                          : faPaw
                      }
                      aria-hidden="true"
                    />
                    {category}
                  </button>
                    )
                  )}
                  {!activeDb && (
                    <button
                      type="button"
                      name="all"
                      className={`inventory-category-switch__button${inventoryCategory === "all" ? " is-active" : ""}`}
                      aria-pressed={inventoryCategory === "all"}
                      onClick={onClickFilter}
                    >
                      <FontAwesomeIcon icon={faRefresh} aria-hidden="true" />
                      Alle
                    </button>
                  )}
                </div>
                {!activeDb && (
                  <div className="inventory-weight">
                    <div
                      id="weight-progressbar"
                      role="progressbar"
                      aria-label="Traglast"
                      aria-valuemin={0}
                      aria-valuemax={capacity > 0 ? capacity : 1}
                      aria-valuenow={
                        capacity > 0
                          ? Math.min(Math.max(totalWeight, 0), capacity)
                          : 0
                      }
                      aria-valuetext={`${totalWeight.toFixed(2)} von ${capacity}`}
                    >
                      <motion.div
                        id="curr-weight"
                        aria-hidden="true"
                        initial={{ width: 0, backgroundColor: "rgb(22, 22, 20)" }}
                        animate={{
                          width: `${weightPercentage}%`,
                          backgroundColor:
                            weightPercentage < 50
                              ? "rgb(67, 170, 139)"
                              : weightPercentage < 75
                              ? ["rgb(67, 170, 139)", "rgb(243, 114, 44)"]
                              : [
                                  "rgb(67, 170, 139)",
                                  "rgb(243, 114, 44)",
                                  "rgb(249, 65, 68)",
                                ],
                        }}
                        transition={{ delay: 1, duration: 0.8 }}
                      />
                      <span className="inventory-weight__label">
                        Traglast: {totalWeight.toFixed(2)} / {capacity}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="inventory-weight__info"
                      aria-label="Zusammensetzung der Traglast anzeigen"
                      aria-expanded={showCapacityDetails}
                      aria-controls="inventory-weight-details"
                      onClick={() =>
                        setShowCapacityDetails((visible) => !visible)
                      }
                    >
                      <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
                    </button>
                    {showCapacityDetails && (
                      <div
                        className="inventory-weight-details"
                        id="inventory-weight-details"
                      >
                        <div className="inventory-weight-details__row">
                          <span>
                            Eigene Traglast ({capacityDetails.strength} Stärke
                            × {capacityDetails.multiplier})
                          </span>
                          <strong>{capacityDetails.personalCapacity}</strong>
                        </div>
                        {capacityDetails.companions.map((companion, index) => (
                          <div
                            className="inventory-weight-details__row"
                            key={`${companion.name}-${index}`}
                          >
                            <span>{companion.name}</span>
                            <strong>{companion.capacity}</strong>
                          </div>
                        ))}
                        <div className="inventory-weight-details__total">
                          <span>Gesamte Traglast</span>
                          <strong>{capacity}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {activeDb ? (
                  <ItemsView
                    iFilter={catalogCategory}
                    setCustomInfo={setCustomInfo}
                    setShowInfo={show}
                    addItemToInventory={addItemToInventory}
                  />
                ) : (
                  <>
                    <Slot
                      setShowInfo={show}
                      filter={inventoryCategory === "all" ? "" : inventoryCategory}
                    />
                    <div className="row ">
                      <div className="col-auto pe-1 mt-2">
                        <FontAwesomeIcon icon={faCoins} />
                      </div>
                      <div
                        className="col-auto p-0 mt-2"
                        style={{ color: "#FF9D00" }}
                      >{`${money ? money[0] : 0} Gold`}</div>
                      <div
                        className="col-auto p-0 mt-2"
                        style={{ color: "grey" }}
                      >{`, ${money ? money[1] : 0} Silber`}</div>
                      <div
                        className="col-auto p-0 mt-2"
                        style={{ color: "#B34219" }}
                      >
                        {`, ${money ? money[2] : 0} Kupfer`}
                      </div>
                      <div className="col">
                        <MotionButton
                          name="active-money"
                          icon={faPen}
                          onClick={() => setActiveEditMoney((prev) => !prev)}
                        />
                      </div>
                      {activeEditMoney && (
                        <div className="">
                          {moneyError?.length > 0 && (
                            <div className="alert alert-danger col-12 mt-2">
                              {moneyError}
                            </div>
                          )}
                          <div className="row p-0 align-items-center">
                            <div
                              className="col-lg-2 p-1"
                              style={{ color: "#FF9D00" }}
                            >
                              <input
                                type="number"
                                value={goldInput}
                                min="0"
                                onChange={(e) => setGoldInput(e.target.value)}
                                style={{
                                  width: "50%",
                                  marginLeft: "5px",
                                  padding: "2px",
                                }}
                              />
                              <FontAwesomeIcon icon={faCoins} />
                            </div>

                            <div
                              className="col-lg-2 p-1"
                              style={{ color: "grey" }}
                            >
                              <input
                                type="number"
                                value={silverInput}
                                min="0"
                                onChange={(e) => setSilverInput(e.target.value)}
                                style={{
                                  width: "50%",
                                  marginLeft: "5px",
                                  padding: "2px",
                                }}
                              />
                              <FontAwesomeIcon icon={faCoins} />
                            </div>

                            <div
                              className="col-lg-2 p-1"
                              style={{ color: "#B34219" }}
                            >
                              <input
                                type="number"
                                min="0"
                                value={copperInput}
                                onChange={(e) => setCopperInput(e.target.value)}
                                style={{
                                  width: "50%",
                                  marginLeft: "5px",
                                  padding: "2px",
                                }}
                              />
                              <FontAwesomeIcon icon={faCoins} />
                            </div>

                            <div className="col-auto p-1 d-flex align-items-center justify-content-around">
                              <button
                                onClick={() => handleUpdateMoney(true)}
                                aria-label="Add Money"
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </button>
                              <button
                                onClick={() => handleUpdateMoney(false)}
                                aria-label="Subtract Money"
                              >
                                <FontAwesomeIcon icon={faMinus} />
                              </button>
                              <button
                                onClick={() => setActiveEditMoney(false)}
                                aria-label="Cancel Edit"
                              >
                                <FontAwesomeIcon icon={faX} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              {!activeDb && (
                <div className="col-lg-5 col-md-12 col-sm-12 h-auto">
                  <Equipment
                    err={equipmentError}
                    armor={armor}
                    uclass={userclass?.name}
                    setShowInfo={show}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default InventoryPage;
