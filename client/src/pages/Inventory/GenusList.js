import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {  useDispatch, useSelector } from "react-redux";
import { listAnimation } from "../../data/Animations";
import MotionButton from "../../components/MotionButton";

function GenusList({handleActiveGenus }) {
  const { genuses, activeGenus} = useSelector((state) => state.items);
  const fraction = localStorage.getItem("fraction");
  return (
    <AnimatePresence>
      {genuses?.map((type, i) => (
        <motion.div className="row"
          key={type}
          layout
          variants={listAnimation}
          initial="init"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, delay: i*0.2}}
        >
          <MotionButton name={type} content={type} onClick={handleActiveGenus} theme={activeGenus===type? fraction : ""}/>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

export default React.memo(GenusList);
