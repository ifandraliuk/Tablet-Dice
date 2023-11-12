import React, { useEffect, useCallback, useState } from "react";
import "../../Styles/Inventory.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faFloppyDisk,
  faRefresh,
  faSearch,
  faShield,
  faSuitcase,
  faHammer,
  faSeedling,
  faPerson,
  faHandSparkles,
  faCoins,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import {
  loadPercentage,
  newBalance,
  toInventory,
  setEnchantment,
  updateInventory,
  deleteItem,
  filterEquipment,
  equipItem,
} from "../../features/player/playerSlice";
import Equipment from "./Equipment";
import Info from "./Info";
import { toFloat, floatToArray } from "./CurrencyConverters.js";
import SalePopup from "./SalePopup";
import EnchantmentPopup from "./EnchantmentPopup";
import { motion } from "framer-motion";
import { buttonActive, pageTransition } from "../../data/Animations";
import InventoryTable from "./InventoryTable";
import { getItem, getGenus } from "../../features/item/itemSlice";
import Items from "./Items";
import GenusList from "./GenusList";

function InventoryPage() {
  const { items, isLoading, activeCategory, activeGenus, isError, message } =
    useSelector((state) => state.items);
  const {
    fractionTheme,
    player,
    isSuccess,
    armor,
    equipmentError,
    weight,
    currPercentage,
    loadCapacity,
  } = useSelector((state) => state.player);
  const { talents, attributes, userclass, inventory } = player;
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // multi selector state
  const [multi, setMulti] = useState([]);

  const [showInfo, showInfoActive] = useState({ state: false, item: "" }); // show additional info in the inventory
  // selling states
  const [trigger, setTrigger] = useState(false); //popup trigger
  const [sellPrice, setSellprice] = useState(0); // sum of selected items to sell
  const [haggle, setHaggle] = useState(1); // haggle percent

  // enchantment states
  const [enchantmentTrigger, showEnchantment] = useState(false);

  const [toUpdate, setUpdate] = useState([]);
  const [newMoney, updateMoney] = useState(player?.money);

  // dB items
  const [isLoad, setLoad] = useState(false);
  const [searchName, setSearch] = useState("");
  const [filter, setFilter] = useState(""); //db filter
  const [edit, activeEdit] = useState(false);
  const [detailsId, setId] = useState(-1);
  const [iFilter, setInventoryFilter] = useState("");

  const onClickFilter = (e) => {
    e.preventDefault();
    const filterName = e.currentTarget.name;
    console.log(filterName);
    if (filterName === "all") {
      setInventoryFilter("");
    } else {
      setInventoryFilter(filterName);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    if (isError) {
      console.log(message);
    }
    if (isLoad && items.length === 0) {
      dispatch(getItem());
    }
  }, [user, items.length, message, isError, isLoad, navigate, dispatch]);

  useEffect(() => {
    if (weight / (loadCapacity / 100) !== currPercentage) {
      console.log("percentage changed");
      dispatch(loadPercentage());
    }

    console.log("frame func && percentage func were called");
  }, [weight, loadCapacity, currPercentage, dispatch]);


  useEffect(()=>{
    console.log("filter quippment")
    dispatch(filterEquipment())
  }, [player?.inventory])
  const getDetails = (e) => {
    console.log(e.currentTarget.name);
    setId(parseInt(e.currentTarget.name));
  };

  const addItem = (e) => {
    let id = e.currentTarget.name;
    const item = filteredItems()[id].name;
    console.log(item);
    dispatch(
      toInventory({
        item: filteredItems()[id].name,
        amount: 1,
        status: user.name,
      })
    );
  };
  const toDelete = (e) => {
    let id;

    if (typeof e === "object") {
      id = e.currentTarget.id;
    } else id = e;
    console.log(id, typeof id);
    //dispatch(deleteItem(player.inventory[id]._id))
    dispatch(deleteItem(id));
    //dispatch(getPlayer())
  };

  const handleEdit = (e) => {
    activeEdit((edit) => !edit);
    updateMoney(player?.money);
    console.log(newMoney);
  };


  const handleSave = (e) => {
    e.preventDefault();
    console.log(toUpdate);
    if (toUpdate?.length > 0) {
      toUpdate.forEach((item) => { 
        const id = item.item
        let equipFlag = false
        let unequipFlag = false
        const oldStatus = player?.inventory.find(el=>el._id == id)?.status
        console.log(item.item)
        console.log("old status: ", oldStatus, " new status: ", item.status)
        if(oldStatus !== item.status){
          if(oldStatus === "Ausgerüstet"){
            console.log("newly uneqipped item")
            unequipFlag = true

          } else if(item.status==="Ausgerüstet"){
            console.log("newly equipped item")
            equipFlag = true
          }
        }
        dispatch(updateInventory(item));
        console.log(item)
      });
    }
    //console.log("filter equipment")
    //dispatch(filterEquipment())
    console.log(localStorage.getItem("equippedItems"))
    console.log(newMoney, player.money);
    if (
      newMoney[0] !== player?.money[0] ||
      newMoney[1] !== player?.money[1] ||
      newMoney[2] !== player?.money[2]
    ) {
      //console.log("update money")
      dispatch(newBalance(newMoney));
    }
    if (!player.isError) activeEdit((edit) => !edit);
    setLoad(false);
  };

  /* Enchant element and remove used gem from users inventory */
  const handleEnchant = (data, removeGemId) => {
    console.log(data, removeGemId);
    dispatch(setEnchantment(data));
    dispatch(deleteItem(removeGemId));
  };

  const handleChange = (e) => {
    console.log(
      `id: ${e.target.id} value: ${e.target.value} name: ${e.target.name}`
    );
    let flag = false;
    if (toUpdate.length > 0) {
      console.log("searching for an item...");
      let id = toUpdate.findIndex((item) => item.item === e.target.name);
      console.log(id);
      console.log(toUpdate[id]);
      if (id >= 0) {
        setUpdate(
          toUpdate.map((item, i) => {
            if (i === id) {
              console.log("found! ", item);
              flag = true;
              const newAmount =  e.target.id === "amount" ? e.target.value : item.amount
              const newStatus =  e.target.id === "status" ? e.target.value : item.status
              let newItem = {
                item: e.target.name,
                amount: newAmount,
                status:newStatus,
              };

              console.log(`new item: ${newItem}`);
              console.log(newItem);
              return newItem;
            } else return item;
          })
        );
      }
      if (!flag) {
        setUpdate((toUpdate) => [
          ...toUpdate,
          { item: e.target.name, [e.target.id]: e.target.value },
        ]);
        console.log("new element...");
      }
    } else {
      setUpdate([{ item: e.target.name, [e.target.id]: e.target.value }]);
    }
    if (isLoading || player.isLoading) {
      return <Spinner animation="border" />;
    }
  };

  const itemSelected = (e) => {
    console.log(e.target.name);
    if (e.target.name) {
      showInfoActive({ state: !showInfo.state, item: e.target.name });
    }
  };
  const onMultiSelect = (e) => {
    const id = e.target?.id;
    if (multi.includes(id)) {
      setMulti(multi.filter((el) => el !== id));
    } else {
      setMulti([...multi, id]);
    }
    console.log(multi);
  };
  const showItems = (e) => {
    e.preventDefault();
    setLoad((isLoad) => !isLoad);
  };

  const moneyChange = (e) => {
    console.log(e.target.id, e.target.value);
    const id = parseInt(e.target.id);
    const value = parseInt(e.target.value);
    updateMoney(newMoney?.map((currency, i) => (i === id ? value : currency)));
    console.log(newMoney);
  };

  const handleSearch = (e) => {
    console.log(e.target.value);
    //setSearch(e.target.value)
  };
  const onClickSearch = (e) => {
    const searchbar = document.getElementById("searchbar");
    if (searchbar.value.length > 0) {
      setSearch(searchbar.value);
    }
  };


  const clearSearch = () => {
    document.getElementById("searchbar").value = "";
    dispatch(getItem());
    setSearch("");
  };


  const offerCounter = () => {
    /**
     counts sum of selected elements & opens popup window
     */
    if (multi?.length > 0) {
      let sum = 0.0;
      multi.forEach((el) => {
        //find selected element
        const toSell = player?.inventory.find((item) => item._id === el);
        if (toSell) {
          // convert string money type & count its cost
          sum += toFloat(toSell.item.price) * toSell.amount;
        }
      });
      setSellprice(sum);
      setTrigger(true);
    }
  };

  const balanceToUpdate = useCallback(() => {
    const userBalance = toFloat(player?.money);
    console.log(userBalance);
    const toUpdate = userBalance + sellPrice * haggle;
    console.log(floatToArray(toUpdate));
    dispatch(newBalance(floatToArray(toUpdate))); // update user balance
    multi?.forEach((id) => dispatch(deleteItem(id)));
    setTrigger(false);
    setSellprice(0);
  }, [multi.length]);

  /// Animations

  const filteredItems = useCallback(() => {
    const filterCheck = filter?.length > 0 ? true : false;
    const searchCheck = searchName?.length > 0 ? true : false;
    console.log(filter, searchName, activeCategory);
    const categorized = activeCategory
      ? items.filter((it) => it.category === activeCategory)
      : items;
    console.log(categorized);
    if (filterCheck && !searchCheck) {
      // only genus filter checked
      const res = categorized.filter((item) => item.genus === filter);

      return res;
    } else if (filterCheck && searchCheck) {
      // genus filter & search used
      const res = categorized.filter(
        (item) => item.genus === filter && item.name.includes(searchName)
      );

      return res;
    } else if (!filterCheck && searchName) {
      // only search filter
      const res = categorized.filter((item) => item.name.includes(searchName));

      return res;
    } else if (categorized.length === 0) {
      dispatch(getItem());
      return items;
    } else {
      return categorized;
    }
  }, [filter, searchName, items, activeCategory]);

  return (
    <motion.div
      variants={pageTransition}
      initial="init"
      animate="animate"
      exit="exit"
    >
      <div className="inventory-page">
        <div className={`${fractionTheme}-bg`}>
          {trigger && (
            <SalePopup
              multi={multi}
              inventory={player?.inventory}
              sellPrice={sellPrice * haggle}
              setHaggle={setHaggle}
              setTrigger={() => setTrigger((trigger) => !trigger)}
              balanceToUpdate={balanceToUpdate}
            />
          )}
          {enchantmentTrigger && (
            <EnchantmentPopup
              setTrigger={() =>
                showEnchantment((enchantmentTrigger) => !enchantmentTrigger)
              }
              selector={multi}
              inventory={player?.inventory}
              attr={attributes}
              talent={talents?.find((el) => el.talent.name === "Verzaubern")}
              enchant={handleEnchant}
              remove={toDelete}
            />
          )}
          <div className="container-fluid dark-bg g-5">
            <div className="row mt-3 ">
              <div className="col-lg-auto col-md-12 col-sm-12 h-auto">
                <div className="row mt-5">
                  <button
                    name={user?.name}
                    className={fractionTheme}
                    onClick={onClickFilter}
                  >
                    <FontAwesomeIcon icon={faSuitcase} />
                  </button>
                </div>
                <div className="row">
                  <button
                    name="Ausgerüstet"
                    className={fractionTheme}
                    onClick={onClickFilter}
                  >
                    <FontAwesomeIcon icon={faPerson} />
                  </button>
                </div>
                <div className="row">
                  <button
                    name="Rüstung"
                    className={fractionTheme}
                    onClick={onClickFilter}
                  >
                    <FontAwesomeIcon icon={faShield} />
                  </button>
                </div>
                <div className="row">
                  <button
                    name="Waffe"
                    className={fractionTheme}
                    onClick={onClickFilter}
                  >
                    <FontAwesomeIcon icon={faHammer} />
                  </button>
                </div>
                <div className="row">
                  <button
                    name="Ressource"
                    className={fractionTheme}
                    onClick={onClickFilter}
                  >
                    <FontAwesomeIcon icon={faSeedling} />
                  </button>
                </div>
                <div className="row">
                  <button
                    name="Begleiter"
                    className={fractionTheme}
                    onClick={onClickFilter}
                  >
                    <FontAwesomeIcon icon={faPaw} />
                  </button>
                </div>
                <div className="row">
                  <button
                    name="all"
                    className={fractionTheme}
                    onClick={onClickFilter}
                  >
                    <FontAwesomeIcon icon={faRefresh} />
                  </button>
                </div>
                <div className="row">
                  <div id="weight-progressbar">
                    <motion.div
                      id="curr-weight"
                      initial={{
                        height: 0,
                        backgroundColor: "rgb(22, 22, 20)",
                      }}
                      animate={{
                        height: currPercentage + "%",
                        backgroundColor:
                          parseInt(currPercentage) < 50
                            ? "rgb(67, 170, 139)"
                            :  (currPercentage > 50 && currPercentage < 75) ?
                             ["rgb(67, 170, 139)","rgb(243, 114, 44)"] : ["rgb(67, 170, 139)","rgb(243, 114, 44)","rgb(249, 65, 68)"],
                      }}
                      transition={{ delay: 1, duration: 0.8 }}
                    >
                      {`${weight.toFixed(2)} / ${loadCapacity}`}
                    </motion.div>
                  </div>
                </div>
                <div className="row mt-2">
                <button onClick={showItems} className={fractionTheme}>
              {isLoad ? "X" : "+"}
            </button>
                </div>
              </div>
              <div className="col-lg-5 col-md-12 col-sm-12  h-auto">
                {inventory?.length === 0 ? (
                  <Card>
                    <Card.Header>Inventar</Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>...</ListGroup.Item>
                    </ListGroup>
                  </Card>
                ) : (
                  <div>
                    <div className="row">
                      <div className="button-group col-auto">
                        <button className="btn-edit" onClick={handleEdit}>
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        {edit ? (
                          <button className="btn-enchantment" disabled>
                            <FontAwesomeIcon icon={faHandSparkles} />
                          </button>
                        ) : (
                          <button
                            className="btn-enchantment"
                            onClick={() =>
                              showEnchantment(
                                (enchantmentTrigger) => !enchantmentTrigger
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faHandSparkles} />
                          </button>
                        )}
                        {edit ? (
                          <button
                            className="btn-save"
                            variant="outline-secondary"
                            onClick={handleSave}
                            type="submit"
                          >
                            <FontAwesomeIcon icon={faFloppyDisk} />
                          </button>
                        ) : (
                          <button
                            className="btn-save"
                            variant="outline-secondary"
                            disabled
                          >
                            <FontAwesomeIcon icon={faFloppyDisk} />
                          </button>
                        )}
                        <button className="btn-edit" onClick={offerCounter}>
                          <FontAwesomeIcon icon={faCoins} />
                        </button>
                      </div>
                      <div
                        id="sell-info"
                        style={{ left: 0, display: "visible", color: "yellow" }}
                        className="col-auto"
                      ></div>
                    </div>
                    <InventoryTable
                      iFilter={iFilter}
                      onMultiSelect={onMultiSelect}
                      itemSelected={itemSelected}
                      showInfo={showInfo}
                      edit={edit}
                      handleChange={handleChange}
                      toDelete={toDelete}
                    />
                    <div className="row justify-content-end mb-2 col-12">
                      {edit ? (
                        <div className="col col-auto border border-2">
                          <div className="row p-2">
                            <div className="col col-2 p-0">
                              <input
                                id="0"
                                name="gold"
                                type="number"
                                onChange={moneyChange}
                                defaultValue={player?.money[0]}
                              />
                            </div>
                            <div className="col" style={{ color: "#FF9D00" }}>
                              Gold
                            </div>
                            <div className="col col-2 p-0">
                              <input
                                id="1"
                                name="gold"
                                type="number"
                                onChange={moneyChange}
                                defaultValue={player?.money[1]}
                              />
                            </div>
                            <div className="col" style={{ color: "grey" }}>
                              Silber
                            </div>
                            <div className="col col-2 p-0">
                              <input
                                id="2"
                                name="gold"
                                type="number"
                                onChange={moneyChange}
                                defaultValue={player?.money[2]}
                              />
                            </div>
                            <div className="col" style={{ color: "#B34219" }}>
                              Kupfer
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="col col-auto me-0 ">
                          <div className="row p-2">
                            <div className="col-auto pe-1">
                              <FontAwesomeIcon icon={faCoins} />
                            </div>
                            <div
                              className="col-auto p-0"
                              style={{ color: "#FF9D00" }}
                            >{`${
                              player?.money ? player.money[0] : 0
                            } Gold`}</div>
                            <div
                              className="col-auto p-0"
                              style={{ color: "grey" }}
                            >{`, ${
                              player?.money ? player.money[1] : 0
                            } Silber`}</div>
                            <div
                              className="col-auto p-0"
                              style={{ color: "#B34219" }}
                            >
                              {`, ${
                                player?.money ? player.money[2] : 0
                              } Kupfer`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="col-lg-5 col-md-12 col-sm-12  h-auto">
                <Equipment
                  armor={armor}
                  err={equipmentError}
                  uclass={userclass?.name}
                />
              </div>
            </div>

            {isLoad ? (
              <div className="row ">
                <div className="col-12 ">
                  <input
                    id="searchbar"
                    name="search"
                    type="text"
                    defaultValue=""
                    onChange={handleSearch}
                  />
                  <button className={fractionTheme} onClick={onClickSearch}>
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                  <button className={fractionTheme} onClick={clearSearch}>
                    <FontAwesomeIcon icon={faRefresh} />
                  </button>
                </div>
                <div className="col-12 ">
                  <motion.button
                    variants={buttonActive}
                    animate={
                      activeCategory === "Rüstung" ? "active" : "inactive"
                    }
                    id="armor"
                    onClick={(e) => {
                      dispatch(getGenus({ category: "Rüstung" }));
                      setFilter("");
                      setId(-1);
                    }}
                  >
                    <FontAwesomeIcon icon={faShield} />
                  </motion.button>
                  <motion.button
                    id="weapon"
                    variants={buttonActive}
                    animate={activeCategory === "Waffe" ? "active" : "inactive"}
                    onClick={(e) => {
                      dispatch(getGenus({ category: "Waffe" }));
                      setFilter("");
                      setId(-1);
                    }}
                  >
                    <FontAwesomeIcon icon={faHammer} />
                  </motion.button>
                  <motion.button
                    variants={buttonActive}
                    animate={
                      activeCategory === "Ressource" ? "active" : "inactive"
                    }
                    id="ressource"
                    onClick={(e) => {
                      dispatch(getGenus({ category: "Ressource" }));
                      setFilter("");
                      setId(-1);
                    }}
                  >
                    <FontAwesomeIcon icon={faSeedling} />
                  </motion.button>
                  <motion.button
                    variants={buttonActive}
                    animate={
                      activeCategory === "Begleiter" ? "active" : "inactive"
                    }
                    id="companion"
                    onClick={(e) => {
                      dispatch(getGenus({ category: "Begleiter" }));
                      setFilter("");
                      setId(-1);
                    }}
                  >
                    <FontAwesomeIcon icon={faPaw} />
                  </motion.button>
                </div>
                {isLoad && (
                  <div className="row">
                    {activeCategory && (
                      <div className="col-1">
                        <GenusList
                          genus={activeGenus}
                          setFilter={setFilter}
                          setId={setId}
                          fraction={fractionTheme}
                        />
                      </div>
                    )}
                    <div className="col-lg-5 col-sm-12 ">
                      <Items
                        items={filteredItems}
                        addItem={addItem}
                        itemSelected={itemSelected}
                        getDetails={getDetails}
                      />
                    </div>
                    {items && detailsId >= 0 ? (
                      <div className="col-3">
                        <Info item={filteredItems()[detailsId]} />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="row"></div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default InventoryPage;
