import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MotionButton from "../../components/MotionButton";
import { useSelector, useDispatch } from "react-redux";
import { originList, countries } from "../../data/ConstVariables";
import {
  isOriginComplete,
  setActiveOrigin,
} from "../../features/creation/creationSlice";
import Fraction from "../../components/Fraction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
export default function Origin() {
  const { activeOrigin, cuttedOrigin } = useSelector((state) => state.creation);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(isOriginComplete());
  }, [activeOrigin, dispatch]);
  return (
    <div className="container">
      <div className="row mt-2">
        <div className="alert info">
          Du schreitest ans Fenster und denkst dabei an deine Heimat:
        </div>
        <div className="row">
          {originList?.map((originName) => (
            <div className="col-auto" key={originName}>
              <MotionButton
                name={originName}
                content={originName}
                theme={activeOrigin === originName ? "Thornheim" : ""}
                onClick={(e) => dispatch(setActiveOrigin(originName))}
              />
            </div>
          ))}
        </div>
        <div className="row ">
          {activeOrigin?.length > 0 ? (
            <div className="col-4 d-flex flex-column align-items-center">
              <Fraction fraction={cuttedOrigin} />
              <button
                className="mt-2 worldmap-button"
                onClick={() =>
                  window.open(
                    `/map/Dragonlands.jpg`,
                    "_blank",
                    "noopener noreferrer"
                  )
                }
              >
                Zu Weltkarte 
                <FontAwesomeIcon className=" ms-2" icon={faGlobe} />
              </button>
            </div>
          ) : (
            <></>
          )}

          {activeOrigin?.length > 0 ? (
            <div className="col-8">
              <h4>Beschreibung</h4>
              <p className="ms-2">{countries[activeOrigin]?.descr}</p>
              <h4>Karte</h4>
              <a
              className="ms-2"
                href={`/map/${cuttedOrigin}.jpg`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AnimatePresence wait>
                <motion.img
                 key={cuttedOrigin}
                  className="kingdom-map"
                  initial={{ opacity: 0,scale: 1 }}
                  animate={{opacity: 1, duration: 0.5}}
                  exit={{opacity:0}}
                  whileHover={{ scale: 1.2 }}
                  alt={activeOrigin}
                  src={`/map/small/${cuttedOrigin}.jpg`}
                /></AnimatePresence>
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
