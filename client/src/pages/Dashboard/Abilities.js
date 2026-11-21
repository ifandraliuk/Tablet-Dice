import React, { useEffect, useState } from "react";
import { decreaseBar } from "../../features/player/playerSlice";
import { useSelector, useDispatch } from "react-redux";
import AbilityCard from "../../components/AbilityCard";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import MotionButton from "../../components/MotionButton";


function Abilities() {
  const { profession, fractionTheme } = useSelector((state) => state.player);
  const { user } = useSelector((state) => state.auth);
  const {_id, abilities} = profession
  const specializations = [
    ...new Set(abilities?.map((ability) => ability.specialization).filter(Boolean)),
  ];
  const storageKey =
    user?._id && _id
      ? `dashboardAbilitySpecialization:${user._id}:${_id}`
      : null;
  const [filterCategory, setCategory] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const availableSpecializations = [
      ...new Set(abilities?.map((ability) => ability.specialization).filter(Boolean)),
    ];
    if (availableSpecializations.length === 0) {
      setCategory("");
      return;
    }

    const savedCategory = storageKey
      ? localStorage.getItem(storageKey)
      : null;
    const selectedCategory = availableSpecializations.includes(savedCategory)
      ? savedCategory
      : availableSpecializations[0];

    setCategory(selectedCategory);
    if (storageKey && selectedCategory !== savedCategory) {
      localStorage.setItem(storageKey, selectedCategory);
    }
  }, [storageKey, abilities]);

  const useAbility = (e) => {
    console.log(e.target.name);
    const ability = abilities?.find((el) => el._id === e.target.name);
    console.log(ability);
    //const abilityIndex = e.target.name
    const category = ability.type;
    const value = ability.price;
    dispatch(decreaseBar({ category, value }));
  };

  const onCategory = (e) => {
    const selectedCategory = e.currentTarget.name;
    setCategory(selectedCategory);
    if (storageKey) {
      localStorage.setItem(storageKey, selectedCategory);
    }
  };
  return (
    <div className="container">
      <h2>Fertigkeiten</h2>
      <div className="row ">
        {specializations.map((el) => (
          <div key={el} className="col-auto m-0" >
            <MotionButton 
              name={el}
              content={el}
              onClick={onCategory}
              theme={filterCategory === el ? fractionTheme : ""}
            />
          </div>
        ))}     
        <div className="col-auto m-0">

          </div> 
      </div>
      <div className="row justify-content-center">
        <AnimatePresence>
          {abilities?.map((ability, ind) => {
            return (
              ability.specialization === filterCategory && (
                <motion.div className="col-auto col-3"
                key={ability._id}
                layout
                initial={{ translateY: -30, opacity: 0 }}
                animate={{
                  translateY: 0,
                  opacity: 1,
                  transition: { duration: 0.5, delay: ind * 0.2 },
                }}
                exit={{
                  scale: 0,
                }}
                >
                 
                  <AbilityCard
                    ability={ability}
                    userclass={_id}
                    useAbility={useAbility}
                    theme={fractionTheme}
                  />
                </motion.div>
              )
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Abilities;
