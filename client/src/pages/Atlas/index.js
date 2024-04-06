import React, { useEffect, useState } from "react";
import "../../Styles/Atlas.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getKingdom } from "../../features/atlas/atlasSlice";
import { motion } from "framer-motion";
import { pageTransition } from "../../data/Animations";

import HabitatDetails from "./HabitatDetails";
import Kingdom from "./Kingdom";
import MapPopUp from "./MapPopUp";



const Atlas = () => {
  const { user } = useSelector((state) => state.auth);
  const { fractionTheme } = useSelector((state) => state.player);
  const { kingdom, habitatView,kingdomCategory, isError, message } = useSelector(
    (state) => state.atlas
  );
  const [showInfo, setShowInfo] = useState(false);
  const [habitatCategoryActive, setHabitatCategoryActive] = useState({
    kingdom: "",
    category: "",
    habitat: {},
  });

  const [activeKingdom, setActiveKingdom] = useState({
    name: "Beltamor",
    category: "general",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    if (isError) {
      console.log(message);
    } else {
      dispatch(getKingdom());
    }
  }, [user, navigate, isError, dispatch, message]);
  const showMap=(e)=>{
    console.log(e.currentTarget.name)
    setShowInfo(prev=>!prev)
  }
  return (
    <motion.div
      variants={pageTransition}
      initial="init"
      animate="animate"
      exit="exit"
    >
      {kingdomCategory === "map" && showInfo ? (      
         <MapPopUp hideInfo={setShowInfo}
          />
        ) : null}
      <div className={`${fractionTheme}-bg`}>
        <div className="dark-bg container-fluid g-5 atlas-page">
          {habitatView ? (
            <HabitatDetails categoryActive={setHabitatCategoryActive} />
          ) : (
            kingdom?.map((kingdom) => (
              <Kingdom key={kingdom._id} fractionTheme={fractionTheme} kingdom={kingdom}  showMap={showMap}/>
            ))
          )}
        </div>

        <div className="row justify-content-center m-0"></div>
      </div>
    </motion.div>
  );
};

export default Atlas;
