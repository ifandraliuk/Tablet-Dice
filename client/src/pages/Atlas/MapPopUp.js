import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faX } from "@fortawesome/free-solid-svg-icons";
function MapPopUp({ hideInfo }) {
  const { activeKingdomName } = useSelector((state) => state.atlas);
  const [isOpen, setIsOpen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageMargin, setImageMargin] = useState(0);
  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => prevZoom + 0.1);
    setImageMargin((prevMargin) => prevMargin + 40);
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.1));
    setImageMargin((prevMargin) => Math.max(prevMargin - 40, 0));
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
  const exitAnimation = {
    animate: {
      opacity: 0,
      transition: { duration: 0.2 },
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
      
        
      >
        <motion.div
          name="info-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          className="info-container container overflow-auto"
         
        >
          <div className="col-lg-10 col-md-8">
            <h2>{activeKingdomName}</h2>
          </div>
          <div className="col-lg-2 col-md-4 d-flex" >
          <button onClick={handleZoomIn}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button onClick={handleZoomOut}>
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
          <div className="row"  style={{ marginTop: `${imageMargin}px` }}>
            <motion.img alt="" src={`/map/${activeKingdomName}.jpg`}  style={{ transform: `scale(${zoomLevel})` }}/>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default MapPopUp;
