import React, { useEffect, useState } from "react";
import "../../Styles/Bestiaria.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset, getBestiaria } from "../../features/bestiaria/bestiariaSlice";
import BestienList from "./BestienList";
import HabitatList from "./HabitatList";
import { getHabitat } from "../../features/habitats/habitatSlice";
import { pageTransition } from "../../data/Animations";
import { motion } from "framer-motion";
const Bestiaria = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { fractionTheme } = useSelector((state) => state.player);
  const { bestiaria } = useSelector((state) => state.bestiaria);
  const { habitat } = useSelector((state) => state.habitat);
  const [habitatId, setHabitatFilter] = useState("");

  useEffect(() => {
    console.log("getting creatures...");
    dispatch(getBestiaria());
    dispatch(getHabitat());
    if (!user) {
      navigate("/");
    }
    return () => {
      console.log("reset");
      dispatch(reset());
    };
  }, [user, dispatch, navigate]);

  return (     
     <motion.div
          variants={pageTransition}
          initial="init"
          animate="animate"
          exit="exit">
    <div className={`${fractionTheme}-bg`}>
    <div className="dark-bg container-fluid g-5">

        <div className="row">
          <div className="col-2">
            <HabitatList habitats={habitat} filter={setHabitatFilter} />
          </div>
          <div className="col-9">
            <BestienList creatures={bestiaria} habitatFilter={habitatId} />
          </div>
        </div>
      </div>
    </div></motion.div>
  );
};

export default Bestiaria;
