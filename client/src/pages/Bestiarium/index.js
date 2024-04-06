import React, { useEffect, useState } from "react";
import "../../Styles/Bestiaria.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset, getBestiaria } from "../../features/bestiaria/bestiariaSlice";
import BestienList from "./BestienList";
import ArtListComp from "./ArtListComp";
import { getHabitat } from "../../features/habitats/habitatSlice";
import { pageTransition } from "../../data/Animations";
import { motion } from "framer-motion";
import CompanionPopup from "./CompanionPopup";
import { addCompanion } from "../../features/companion/companionSlice";
const Bestiaria = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { fractionTheme, isSuccess } = useSelector((state) => state.player);
  const { bestiaria, artList } = useSelector((state) => state.bestiaria);
  const [art, setArtFilter] = useState("");
  const [companionId, setCompanionId] = useState("");
  const [onPopup, setOnPopup] = useState(false);
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

  const companionOnClick = (name) => {
    console.log(companionId, name);
    dispatch(
      addCompanion({
        id: companionId,
        name: name,
      })
    );
    if (isSuccess) {
      setOnPopup(false);
    }
  };
  console.log(art);
  return (
    <motion.div
      variants={pageTransition}
      initial="init"
      animate="animate"
      exit="exit"
    >
      <div className={`${fractionTheme}-bg`}>
        {onPopup && (
          <CompanionPopup
            companion={bestiaria?.find(
              (creature) => creature._id === companionId
            )}
            setOnPopup={setOnPopup}
            companionOnClick={companionOnClick}
          />
        )}
        <div className="dark-bg container-fluid g-5">
          <div className="row">
            <div className="col-2">
              <ArtListComp
                arts={artList}
                filter={setArtFilter}
                fractionTheme={fractionTheme}
              />
            </div>
            <div className="col-9">
              <BestienList
                creatures={bestiaria}
                artFilter={art}
                setOnPopup={setOnPopup}
                setCompanionId={setCompanionId}
                fractionTheme={fractionTheme}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Bestiaria;
