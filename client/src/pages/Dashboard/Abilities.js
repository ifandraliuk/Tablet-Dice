import React from "react";
import { useState } from "react";
import { decreaseBar } from "../../features/player/playerSlice";
import { useSelector, useDispatch } from "react-redux";
import AbilityCard from "./AbilityCard";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import MotionButton from "../../components/MotionButton";


function Abilities() {
  const { fractionTheme, player } = useSelector((state) => state.player);
  const abilities = player?.userclass.abilities;
  const spec = [];
  const counts = {};
  // count the amount of cards for each specialization
  Object.keys(abilities).map((ind) => {
    return spec.push(abilities[ind].specialization);
  });
  spec.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  const [filterCategory, setCategory] = useState(spec ? spec[0] : "");
  const dispatch = useDispatch();

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
    setCategory(e.currentTarget.name);
  };
  return (
    <div className="container">
      <div className="row ">
        {Object.keys(counts).map((el) => (
          <div className="col-auto m-0" key={el._id}>
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
          {Object.keys(abilities).map((ind) => {
            return (
              abilities[ind].specialization === filterCategory && (
                <motion.div className="col-auto col-3"
                key={ind}
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
                    ability={abilities[ind]}
                    userclass={player?.userclass?._id}
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
