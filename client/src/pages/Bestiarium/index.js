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
import { getKingdom } from "../../features/atlas/atlasSlice";
import HabitatInfoModal from "./HabitatInfoModal";
const Bestiaria = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { fractionTheme, isSuccess } = useSelector((state) => state.player);
  const { bestiaria } = useSelector((state) => state.bestiaria);
  const { kingdom } = useSelector((state) => state.atlas);
  const [selectedArt, setSelectedArt] = useState("creature");
  const [gattung, setGattungFilter] = useState("");
  const [habitat, setHabitatFilter] = useState("");
  const [status, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [companionId, setCompanionId] = useState("");
  const [onPopup, setOnPopup] = useState(false);
  const [selectedHabitat, setSelectedHabitat] = useState(null);
  useEffect(() => {
    console.log("getting creatures...");
    dispatch(getBestiaria());
    dispatch(getKingdom());

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
  const onHabitatClick = (habitat) => {
    const habitatKingdom = kingdom.find((entry) =>
      entry.habitat?.some(
        (kingdomHabitat) => kingdomHabitat._id === habitat._id
      )
    );
    setSelectedHabitat({
      ...habitat,
      kingdomName: habitatKingdom?.name,
    });
  };
  const visibleCreatures = bestiaria.filter(
    (creature) => creature.register === selectedArt
  );
  const habitatList = [
    ...new Set(
      visibleCreatures.flatMap((creature) =>
        creature.habitat?.map((entry) => entry.name).filter(Boolean) || []
      )
    ),
  ].sort((first, second) => first.localeCompare(second, "de"));
  const statusList = [
    ...new Set(
      visibleCreatures.map((creature) => creature.status).filter(Boolean)
    ),
  ].sort((first, second) => first.localeCompare(second, "de"));
  const gattungList = [
    ...new Set(visibleCreatures.map((creature) => creature.art).filter(Boolean)),
  ].sort((first, second) => first.localeCompare(second, "de"));
  const resetFilters = () => {
    setSelectedArt("creature");
    setGattungFilter("");
    setHabitatFilter("");
    setStatusFilter("");
    setSearchText("");
  };

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
        {selectedHabitat && (
          <HabitatInfoModal
            habitat={selectedHabitat}
            onHide={() => setSelectedHabitat(null)}
          />
        )}
        <div className="dark-bg container-fluid g-5 bestiarium-page">
          <div className="row g-3">
            <div className="col-12">
              <BestiariumFilters
                gattungen={gattungList}
                habitats={habitatList}
                statuses={statusList}
                selectedArt={selectedArt}
                selectedGattung={gattung}
                selectedHabitat={habitat}
                selectedStatus={status}
                searchText={searchText}
                onArtChange={(nextArt) => {
                  setSelectedArt(nextArt);
                  setGattungFilter("");
                  setHabitatFilter("");
                  setStatusFilter("");
                }}
                onGattungChange={setGattungFilter}
                onHabitatChange={setHabitatFilter}
                onStatusChange={setStatusFilter}
                onSearchChange={setSearchText}
                onReset={resetFilters}
              />
              <BestienList
                creatures={bestiaria}
                artFilter={selectedArt}
                gattungFilter={gattung}
                habitatFilter={habitat}
                statusFilter={status}
                nameFilter={searchText}
                onHabitatClick={onHabitatClick}
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
