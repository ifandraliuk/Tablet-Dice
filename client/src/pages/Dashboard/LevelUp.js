import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLevelUp, faPlus } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
const LevelUp = ({ level, newLevel, fraction }) => {
  const [animateOn, setAnimateOn] = useState(false);

  useEffect(()=>{

  })
  const variants = {
    active: {
      scale: [0.5, 1],
      borderRadius: "50%", 
      transition: {
        duration: 0.3,
        ease: [0, 0.71, 0.2, 1.01],
        repeat: Infinity,
        scale: {
          type: "spring",
          damping: 5,
          stiffness: 100,
          restDelta: 0.001,
        },
      },
    },
  };
  return (
    <motion.button
      className={`round-btn ${fraction}`}
      variants={variants}
      animate="active"
      onClick={() => {
        newLevel();
        setAnimateOn(true);
        setTimeout(() => {
          setAnimateOn(false);
        }, 1000);
      }}
    >
      {level}
      <motion.strong
      >
        <FontAwesomeIcon icon={faPlus} />
      </motion.strong>
    </motion.button>
  );
};

export default LevelUp;