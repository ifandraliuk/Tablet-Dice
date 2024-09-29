import React, { useEffect, useState } from "react";
import "../../Styles/Inventory.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRefresh,
  faShield,
  faHammer,
  faSeedling,
  faFloppyDisk,
  faCoins,
  faPaw,
  faPlus,
  faMinus,
  faPen,
  faX
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
  const {
    fractionTheme,
    player,
    equipmentError,
  } = useSelector((state) => state.player);
  const [showInfo, setShowInfo] = useState(false);

  const { userclass } = player;
  const { user } = useSelector((state) => state.auth);
  const [iFilter, setInventoryFilter] = useState("");
  const [activeDb, setActiveDb] = useState(false);
  const [customInfo, setCustomInfo] = useState({});
  const [newMoney, updateBalance] = useState(money);
  console.log(newMoney)
  const [activeEditMoney, setActiveEditMoney] = useState(false);
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
    return () =>{
      dispatch(reset())
      dispatch(playerReset())
    }
  }, [user, isError, dispatch, navigate, message]);
  useEffect(() => {
    dispatch(updateTotalWeight());
    dispatch(getArmor());
    dispatch(getLoadCapacity())
    dispatch(getCategoryBoni("resistance"))
  }, [dispatch, inventory]);

  // Handle the input change
  const moneyChange = (e) => {
    const id = parseInt(e.target.id);
    const value = parseInt(e.target.value);

    // Create a new array with the updated value
    const updatedMoney = money.map((currency, i) => (i === id ? value : currency));

    // Dispatch updateMoney action to update Redux state and backend
    dispatch(updateMoney({ money: updatedMoney }));
  };

  const updateUserMoney = () => {
    console.log(newMoney)
    dispatch(updateMoney(newMoney));
    setActiveEditMoney(false)
  }
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
                        height: totalWeight/capacity*100 + "%",
                        backgroundColor:
                          parseInt(totalWeight/capacity*100 ) < 50
                            ? "rgb(67, 170, 139)"
                            : totalWeight/capacity*100  > 50 && totalWeight/capacity*100  < 75
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
                      {activeEditMoney ? (
                        <>
                        <h4>{newMoney}</h4>
                          <div className="col col-auto border border-2">
                            <div className="row p-0">
                              <div className="col col p-0">
                                <input
                                  id="0"
                                  name="gold"
                                  type="number"
                                  onChange={moneyChange}
                                  defaultValue={money[0]}
                                  style={{width: "80%"}}
                                />
                              </div>
                              <div className="col" style={{ color: "#FF9D00", textAlign: "left"}}>
                                Gold
                              </div>
                              <div className="col col p-0">
                                <input
                                  id="1"
                                  name="gold"
                                  type="number"
                                  onChange={moneyChange}
                                  defaultValue={money[1]}
                                  style={{width: "80%"}}
                                />
                              </div>
                              <div className="col" style={{ color: "grey" , textAlign: "left"}}>
                                Silber
                              </div>
                              <div className="col col p-0">
                                <input
                                  id="2"
                                  name="gold"
                                  style={{width: "80%"}}
                                  type="number"
                                  onChange={moneyChange}
                                  defaultValue={money[2]}
                                />
                              </div>
                              <div className="col" style={{ color: "#B34219", textAlign: "left" }}>
                                Kupfer
                              </div>
                              <div className="col">
                                <MotionButton name="active-money" icon={faX} onClick={(e) => setActiveEditMoney(state=>!state)}/>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
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
                                <MotionButton name="active-money" icon={faPen} onClick={()=>setActiveEditMoney(prev=>!prev)}/>
                              </div>
                        </>
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
