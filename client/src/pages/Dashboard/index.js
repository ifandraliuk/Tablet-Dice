import React, { useEffect, useState } from "react";
import "../../Styles/Dashboard.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import EquippedItem from "../Inventory/EquippedItem";
import BarList from "./BarList";
import Abilities from "./Abilities";
import AttributeList from "./Attributes";
import { updateLevel } from "../../features/player/playerSlice";
import { AnimatePresence, motion } from "framer-motion";
import { pageTransition } from "../../data/Animations";
import Fraction from "../../components/Fraction";
import LevelUp from "./LevelUp";
import GeneralInfo from "./GeneralInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { extendInfo, getUserWeapons } from "../../features/inventoryPage/inventoryPageSlice";
import ExtendedInfo from "../Inventory/ExtendedInfo";
function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [showInfo, setShowInfo] = useState(false);
  const [activeButton, setActiveButton] = useState(null); // active button
  const { fractionTheme, player, armor, bonis, setboni } = useSelector(
    (state) => state.player
  );
  const { mainWeapon, secondWeapon, extendedId } = useSelector(
    (state) => state.inventoryPage
  );
  const navigate = useNavigate();
  const [showImage, setShowImage] = useState(true);
  const dispatch = useDispatch();

  const newLevel = () => {
    dispatch(updateLevel());
  };
  const setExtendedId = (id) => {
    setShowInfo((prevStatus) => !prevStatus);
    dispatch(extendInfo({ id: id }));
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);
  useEffect(() => {
    dispatch(getUserWeapons());
  }, []);
  return (
    <motion.div
      variants={pageTransition}
      initial="init"
      animate="animate"
      exit="exit"
    >
      {showInfo && (
        <ExtendedInfo
          customItemInfo={extendedId === mainWeapon._id ? mainWeapon : secondWeapon}
          key="extended-info"
          minimized={true}
          hideInfo={setShowInfo}
        />
      )}
      <div className="dashboard-page">
        <div className={`bg ${fractionTheme}-bg container-fluid`}>
          <div className="row dark-bg">
            <div className="col-lg-3 col-md-10 col-sm-12">
              <div className="row">
                <div
                  className="p-2 col-lg-7 col-md-8 col-sm-6 border-pattern p-0"
                  style={{ overflow: "hidden" }}
                >
                  <button
                    style={{ zIndex: 2, position: "absolute" }}
                    onClick={() => setShowImage(!showImage)}
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </button>

                  <AnimatePresence mode="wait">
                    {showImage ? (
                      <motion.img
                        key="img"
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        exit={{
                          opacity: 0,
                          transition: {
                            duration: 0.5,
                          },
                        }}
                        className="user-img"
                        src={`/user/${user?._id}.jpeg`}
                      ></motion.img>
                    ) : (
                      <GeneralInfo key="info" player={player} armor={armor} />
                    )}
                  </AnimatePresence>
                </div>
                <div className="col-lg-3 col-md-4 mt-3 col-sm-3 d-flex-column">
                  <div className="row  mb-2 justify-content-center">
                    <LevelUp
                      level={player?.level}
                      newLevel={newLevel}
                      fraction={fractionTheme}
                    />
                  </div>
                 {mainWeapon && (<div id={mainWeapon._id} className="row m-auto" >
                     
                      <EquippedItem
                        equippedItem={mainWeapon}
                        delayValue={0.3}
                        setShowInfo={setExtendedId}
                      />
                    
                  </div>)}
                  {secondWeapon && (<div className="row m-auto">
                    
                      <EquippedItem
                        equippedItem={secondWeapon}
                        delayValue={0.4}
                        setShowInfo={setExtendedId}
                      />
                    
                  </div>)}
                  <div className="row  justify-content-center">
                    <div className="armor ">
                      <strong>{armor}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  {/** <h3>
                    Stufe: <strong>{player?.level}</strong>
                  </h3>
                </div>
                <div className="col-auto  border">
                  <button className={fractionTheme} onClick={newLevel}>
                    <FontAwesomeIcon icon={faLevelUp} />
                        </button>*/}

                  <Fraction fraction={fractionTheme} />
                </div>
              </div>
              <div className="col-lg-7 col-md-7 col-sm-12 mt-3"></div>
            </div>
            {/*second column */}
            <div className="col-lg-9">
              <div className="row m-1">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    {player && player.attributes ? (
                      <AttributeList />
                    ) : (
                      <Spinner animation="border" />
                    )}
                  </div>
                </div>

                <BarList />
                {player && player.userclass ? (
                  <Abilities />
                ) : (
                  <Spinner animation="border" />
                )}
              </div>
              <div className="row">
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
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </motion.div>
  );
}

export default Dashboard;
