import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { listAnimation } from "../../data/Animations";

function GenusList({ fraction, genus, setFilter, setId }) {

  return (
    <AnimatePresence>
      {genus?.map((type, i) => (
        <motion.div className="row"
          key={type}
          layout
          variants={listAnimation}
          initial="init"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, delay: i*0.2}}
        >
          <motion.button

            key={type}
            className={fraction}
            id={type}
            onClick={(e) => {setFilter(e.target.id); setId(-1)}}
          >
            {type}
          </motion.button>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

export default React.memo(GenusList);
