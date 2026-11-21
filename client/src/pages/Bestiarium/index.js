import React, { useEffect, useState } from "react";
import "../../Styles/Bestiaria.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset, getBestiaria } from "../../features/bestiaria/bestiariaSlice";
import BestienList from "./BestienList";
import BestiariumFilters from "./BestiariumFilters";
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
  const [gattung, setGattungFilter] = useState("");
  const [habitat, setHabitatFilter] = useState("");
  const [status, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [companionId, setCompanionId] = useState("");
  const [onPopup, setOnPopup] = useState(false);
  useEffect(() => {
    console.log("getting creatures...");
    dispatch(getBestiaria());

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
  const habitatList = [
    ...new Set(
      bestiaria.flatMap((creature) =>
        creature.habitat?.map((entry) => entry.name).filter(Boolean) || []
      )
    ),
  ].sort((first, second) => first.localeCompare(second, "de"));
  const statusList = [
    ...new Set(bestiaria.map((creature) => creature.status).filter(Boolean)),
  ].sort((first, second) => first.localeCompare(second, "de"));

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
        <div className="dark-bg container-fluid g-5 bestiarium-page">
          <div className="row g-3">
            <div className="col-12">
              <BestiariumFilters
                arts={artList}
                habitats={habitatList}
                statuses={statusList}
                selectedGattung={gattung}
                selectedHabitat={habitat}
                selectedStatus={status}
                searchText={searchText}
                onGattungChange={setGattungFilter}
                onHabitatChange={setHabitatFilter}
                onStatusChange={setStatusFilter}
                onSearchChange={setSearchText}
              />
              <BestienList
                creatures={bestiaria}
                gattungFilter={gattung}
                habitatFilter={habitat}
                statusFilter={status}
                nameFilter={searchText}
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
