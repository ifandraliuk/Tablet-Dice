import React, { useEffect, useState } from "react";
import "../../Styles/Dashboard.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import EquippedItem from "../Inventory/EquippedItem";
import BarList from "./BarList";
import Abilities from "./Abilities";
import AttributeList from "./Attributes";
import {
  generateBar,
  updateActions,
  getAttributes,
  getGeneral,
  getLevel,
  getProfession,
  reset,
  updateLevel,
} from "../../features/player/playerSlice";
import { AnimatePresence, motion } from "framer-motion";
import { pageTransition } from "../../data/Animations";
import Fraction from "../../components/Fraction";
import LevelUp from "./LevelUp";
import GeneralInfo from "./GeneralInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faShield,
  faShieldHalved,
  faCircle,
  faPersonWalking,
  faSquare,
  faDiamond,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import {
  getArmor,
  getCategoryBoni,
  getUserWeapons,
  updateEquipmentStats,
} from "../../features/inventory/inventorySlice";
import ExtendedInfo from "../Inventory/ExtendedInfo";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [selectedWeaponId, setSelectedWeaponId] = useState(null);
  const [activeButton, setActiveButton] = useState(null); // active button
  const [isBonusActionVisible, setBonusActionVisible] = useState(false);
  const [isReactionVisible, setReactionVisible] = useState(false);
  const {
    fractionTheme,
    bonusActionCounter,
    reactionCounter,
    profession,
    attributes,
    level,
    bonis,
    setboni,
  } = useSelector((state) => state.player);
  const { actionBoni } = useSelector((state) => state.inventory);
  const {
    mainWeapon,
    secondWeapon,
    rangedWeapon,
    armorCategory,
    armor,
    armorBoni,
  } = useSelector((state) => state.inventory);
  const navigate = useNavigate();
  const [showImage, setShowImage] = useState(true);
  const dispatch = useDispatch();

  const newLevel = () => {
    dispatch(updateLevel());
  };
  const selectedWeapon = [mainWeapon, secondWeapon, rangedWeapon].find(
    (weapon) => weapon?._id === selectedWeaponId
  );
  const getArmorBonusValue = (armorType) => {
    console.log(armorType);
    if (armorBoni?.length > 0) {
      const foundBoni = armorBoni.find((el) => el.bonus.type === armorType);
      console.log(`Value for ${armorType}: ${foundBoni?.value}`);
      return foundBoni ? foundBoni.value : null;
    } else return null;
  };
  useEffect(() => {
    checkActionVisibility();
  }, [armorCategory, actionBoni]);
  useEffect(() => {
    // Dispatch actions only when the component mounts
    if (user) {
      dispatch(getUserWeapons());
      dispatch(getAttributes());
      dispatch(getArmor());
      dispatch(getLevel());
      dispatch(getProfession());
      dispatch(getGeneral());
      dispatch(getCategoryBoni("resistance"));
      dispatch(getCategoryBoni("action"));
    } else {
      // Redirect to "/" if user is not logged in
      navigate("/");
      dispatch(reset());
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, user, navigate]);
  const checkActionVisibility = () => {
    console.log("check visibility ", armorCategory);
    let isBonusActionVisible = true;
    let isReactionVisible = true;
    let disatvantage = false;
    if (
      armorCategory === "schwer (Platte)" ||
      armorCategory === "schwer (Kette)"
    ) {
      isReactionVisible = false;
      isBonusActionVisible = false;
      disatvantage = true;
    } else if (armorCategory === "mittel") {
      isBonusActionVisible = true;
      disatvantage = true;
    }
    dispatch(updateActions({ actionBoni, armorCategory }));
    setBonusActionVisible(isBonusActionVisible);
    setReactionVisible(isReactionVisible);
  };
  return (
    <motion.div
      variants={pageTransition}
      initial="init"
      animate="animate"
      exit="exit"
    >
      {selectedWeapon && (
        <ExtendedInfo
          customItemInfo={selectedWeapon}
          key="extended-info"
          minimized={true}
          compactWeapon={true}
          setShowInfo={setSelectedWeaponId}
        />
      )}
      <div className="dashboard-page">
        <div className={`bg ${fractionTheme}-bg`}>
          <div className="container-fluid dark-bg dashboard-layout">
            <aside className="dashboard-sidebar">
              <div className="row">
                <div className="dashboard-profile">
                  <div className="dashboard-profile__identity">
                    <h2>{user?.name}</h2>
                    <span>{profession?.name}</span>
                    <LevelUp
                      level={level}
                      newLevel={newLevel}
                      fraction={fractionTheme}
                    />
                  </div>
                  <div className="dashboard-profile__visual">
                    <AnimatePresence mode="wait">
                      {showImage ? (
                        <motion.img
                          key="img"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, transition: { duration: 0.25 } }}
                          className="user-img"
                          src={`/user/${user?._id}.jpeg`}
                          alt={`Charakterbild von ${user?.name || "deinem Charakter"}`}
                        />
                      ) : (
                        <GeneralInfo key="info" />
                      )}
                    </AnimatePresence>
{/*                     <button
                      type="button"
                      className="dashboard-profile__toggle"
                      aria-label={
                        showImage
                          ? "Charakterinformationen anzeigen"
                          : "Charakterbild anzeigen"
                      }
                      title={
                        showImage
                          ? "Charakterinformationen anzeigen"
                          : "Charakterbild anzeigen"
                      }
                      onClick={() => setShowImage(!showImage)}
                      
                    >
                      <FontAwesomeIcon icon={faBars} />
                    </button> */}
                  </div>
                </div>
                <section className="dashboard-sidebar__equipment" aria-label="Ausrüstung">
                  <h3>Ausrüstung</h3>
                  <div className="dashboard-sidebar__equipment-items">
                  {mainWeapon && (
                    <div id={mainWeapon._id}>
                      <EquippedItem
                        equippedItem={mainWeapon}
                        category="Haupthand"
                        delayValue={0.3}
                        setShowInfo={setSelectedWeaponId}
                      />
                    </div>
                  )}
                  {secondWeapon && (
                    <div>
                      <EquippedItem
                        equippedItem={secondWeapon}
                        category="Nebenhand"
                        delayValue={0.4}
                        setShowInfo={setSelectedWeaponId}
                      />
                    </div>
                  )}
                  {rangedWeapon && (
                    <div>
                      <EquippedItem
                        equippedItem={rangedWeapon}
                        category="Fernkampf"
                        delayValue={0.4}
                        setShowInfo={setSelectedWeaponId}
                      />
                    </div>
                  )}
                  </div>
                  <div className="dashboard-sidebar__defenses">
                    <div>
                      <FontAwesomeIcon icon={faShield} />
                      <span>Rüstung</span>
                      <strong>{armor || 0}</strong>
                    </div>
                    <div className="violet-text">
                      <FontAwesomeIcon icon={faShieldHalved} />
                      <span>Magie</span>
                      <strong>{getArmorBonusValue("Magie") || 0}</strong>
                    </div>
                  </div>
                </section>
              </div>

              <div className="dashboard-sidebar__fraction">
                <span>Fraktion</span>
                <strong>{fractionTheme}</strong>
                <Fraction fraction={fractionTheme} />
              </div>
            </aside>
            {/*second column */}
            <main className="dashboard-main">
              <div className="row m-1">
                <div className="dashboard-attributes px-0">
                  {attributes ? (
                    <AttributeList />
                  ) : (
                    <Spinner animation="border" />
                  )}
                </div>
                <ul className="dashboard-action-economy" aria-label="Aktionen">
                  <li className="is-action">
                    <FontAwesomeIcon icon={faCircle} aria-hidden="true" />
                    <span>Aktion</span>
                  </li>
                  {reactionCounter > 0 && (
                    <li className="is-reaction">
                      <FontAwesomeIcon icon={faSquare} aria-hidden="true" />
                      <span>Reaktion</span>
                      <strong>{reactionCounter}</strong>
                    </li>
                  )}
                  {bonusActionCounter > 0 && (
                    <li className="is-bonus-action">
                      <FontAwesomeIcon icon={faDiamond} aria-hidden="true" />
                      <span>Bonusaktion</span>
                      <strong>{bonusActionCounter}</strong>
                    </li>
                  )}
                  <li className="is-movement">
                    <FontAwesomeIcon icon={faPlay} aria-hidden="true" />
                    <span>Bewegung</span>
                  </li>
                </ul>

                <BarList />
                {profession ? <Abilities /> : <Spinner animation="border" />}
              </div>
{/*               <div className="row dashboard-bonuses" visible="false">
                <div className="col-lg-7 col-md-12">
                  <h3>Aktive Boni</h3>
                  {bonis?.length === 0 ? (
                    <p>Hast noch keine...</p>
                  ) : (
                    bonis.map((boni, ind) => <h5 key={ind}>{boni}</h5>)
                  )}
                </div>
                {setboni?.length > 0 && (
                  <div className="col-lg-4 col-md-12">
                    <h3>Set bonus</h3>
                    <h5>{setboni}</h5>
                  </div>
                )}
              </div> */}
            </main>
          </div>
        </div>
      </div>{" "}
    </motion.div>
  );
}

export default Dashboard;
