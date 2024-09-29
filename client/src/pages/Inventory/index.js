import React, { useEffect, useState } from "react";
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
} from "../../features/inventory/inventorySlice";
import { reset as playerReset } from "../../features/player/playerSlice";
import Equipment from "./Equipment";
import { motion } from "framer-motion";
import { buttonImpackt, pageTransition } from "../../data/Animations";
import Slot from "./Slot";
import ExtendedInfo from "./ExtendedInfo";
import MotionButton from "../../components/MotionButton";
import ItemsView from "./ItemsView";

function InventoryPage() {
  const { inventory, armor, totalWeight, capacity, money, isError, message } =
    useSelector((state) => state.inventory);
  const { fractionTheme, player, equipmentError } = useSelector(
    (state) => state.player
  );
  const [showInfo, setShowInfo] = useState(false);

  const { userclass } = player;
  const { user } = useSelector((state) => state.auth);
  const [iFilter, setInventoryFilter] = useState("");
  const [activeDb, setActiveDb] = useState(false);
  const [customInfo, setCustomInfo] = useState({});
  const [newMoney, updateBalance] = useState(money);
  const [moneyError, setMoneyError] = useState("");
  const [goldInput, setGoldInput] = useState("");
  const [silverInput, setSilverInput] = useState("");
  const [copperInput, setCopperInput] = useState("");
  console.log(newMoney);
  const [activeEditMoney, setActiveEditMoney] = useState(false);
  // Local state to manage the input field for new money
  const [newMoneyInput, setNewMoneyInput] = useState("");
  const [inputError, setInputError] = useState(""); // For showing error message
  // Regex pattern to validate input
  const moneyInputPattern = /^-?\d+,\d+,\d+$/;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(customInfo);

  useEffect(() => {
    if (!user || isError) {
      navigate("/");
      dispatch(reset());
    } else {
      //load users inventory for the first time
      dispatch(getInventory());
      dispatch(getUserMoney());
    }
    return () => {
      dispatch(reset());
      dispatch(playerReset());
    };
  }, [user, isError, dispatch, navigate, message]);

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

  const showDb = () => {
    setActiveDb((prev) => !prev);
  };

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
  };

  const unEquipItem = (id) => {
    dispatch(unequip({ id: id }));
  };

  const onClickFilter = (e) => {
    e.preventDefault();
    const filterName = e.currentTarget.name;
    if (filterName === "all") {
      setInventoryFilter("");
    } else {
      setInventoryFilter(filterName);
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
          key="extended-info"
          toPlayer={toPlayer}
          customItemInfo={customInfo}
          hideInfo={setShowInfo}
          minimized={true}
          dbButtons={true}
        />
      )}
      <div className="inventory-page">
        <div className={`${fractionTheme}-bg`}>
          <div className="container-fluid dark-bg g-5">
            <div className="row">
              <div className="col-lg-auto col-md-12 col-sm-12">
                {["Rüstung", "Waffe", "Ressource", "Begleiter", "all"].map(
                  (buttonName, i) => (
                    <div key={buttonName} className="row">
                      <MotionButton
                        name={buttonName}
                        onClick={onClickFilter}
                        icon={
                          i === 0
                            ? faShield
                            : i === 1
                            ? faHammer
                            : i === 2
                            ? faSeedling
                            : i === 3
                            ? faPaw
                            : faRefresh
                        }
                        theme={iFilter === buttonName ? `${fractionTheme}` : ""}
                      />
                    </div>
                  )
                )}

                <div className="row">
                  <div id="weight-progressbar">
                    <motion.div
                      id="curr-weight"
                      initial={{
                        height: 0,
                        backgroundColor: "rgb(22, 22, 20)",
                      }}
                      animate={{
                        height: (totalWeight / capacity) * 100 + "%",
                        backgroundColor:
                          parseInt((totalWeight / capacity) * 100) < 50
                            ? "rgb(67, 170, 139)"
                            : (totalWeight / capacity) * 100 > 50 &&
                              (totalWeight / capacity) * 100 < 75
                            ? ["rgb(67, 170, 139)", "rgb(243, 114, 44)"]
                            : [
                                "rgb(67, 170, 139)",
                                "rgb(243, 114, 44)",
                                "rgb(249, 65, 68)",
                              ],
                      }}
                      transition={{ delay: 1, duration: 0.8 }}
                    >
                      {`${totalWeight.toFixed(2)} / ${capacity}`}
                    </motion.div>
                  </div>
                </div>
                <div className="row mt-2">
                  <MotionButton
                    onClick={showDb}
                    icon={activeDb ? faMinus : faPlus}
                    theme={activeDb ? fractionTheme : ""}
                  />
                </div>
              </div>
              <div className="col-lg-5 col-md-12 col-sm-12 ">
                {activeDb ? (
                  <ItemsView
                    iFilter={iFilter}
                    setCustomInfo={setCustomInfo}
                    setShowInfo={show}
                    toPlayer={toPlayer}
                  />
                ) : (
                  <>
                    <Slot setShowInfo={show} filter={iFilter} />
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
                                }} // Reduced width and padding
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
                                }} // Reduced width and padding
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
                                }} // Reduced width and padding
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
              <div className="col-lg-5 col-md-12 col-sm-12  h-auto">
                <Equipment
                  err={equipmentError}
                  armor={armor}
                  uclass={userclass?.name}
                  setShowInfo={show}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default InventoryPage;
