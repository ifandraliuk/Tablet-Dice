import React, { useEffect, useState } from "react";
import "../../Styles/Atlas.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getKingdom } from "../../features/atlas/atlasSlice";
import { motion } from "framer-motion";
import { pageTransition } from "../../data/Animations";

import HabitatDetails from "./HabitatDetails";
import Kingdom from "./Kingdom";

const Atlas = () => {
  const { user } = useSelector((state) => state.auth);
  const { fractionTheme } = useSelector((state) => state.player);
  const { kingdom, isError, message } = useSelector((state) => state.atlas);
  const [activeHabitat, setActiveHabitat] = useState({}); //details component for habitat is active
  const [habitatCategoryActive, setHabitatCategoryActive] = useState({
    kingdom: "",
    category: "",
    habitat: {},
  });
  console.log(activeHabitat)

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

  return (
    <motion.div
      variants={pageTransition}
      initial="init"
      animate="animate"
      exit="exit"
    >
      <div className={`${fractionTheme}-bg`}>
        <div className="dark-bg container-fluid g-5 atlas-page">
          {activeHabitat ? (
            kingdom?.map((kingdom) => (
              <Kingdom
                fractionTheme={fractionTheme}
                kingdom={kingdom}
                setActiveHabitat={setActiveHabitat}
              />
            ))
          ) : (
            <HabitatDetails
              habitat={activeHabitat}
              kingdom={habitatCategoryActive?.kingdom}
              categoryActive={setHabitatCategoryActive}
              back={setActiveHabitat}
            /> 
          )}
        </div>

        <div className="row justify-content-center m-0"></div>
      </div>
    </motion.div>
  );
};

export default Atlas;
