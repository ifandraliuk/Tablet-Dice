import React from "react";
import { motion } from "framer-motion";
function ProgressBar({ color, name, current, max }) {
  return (
    <div>
      <div className="horizontall-bar">
        <motion.div
          className={`${color}`}
          initial={{
            width: 0,
           
          }}
          animate={{
            width: current/max*100 + "%",
            color: current/max*100 < 20 ? "#fff" : "#fff"
          }}
          transition={{ delay: 1, duration: 0.8 }}
        >{`${name ? name : ""} ${current}/${max}`}</motion.div>
      </div>
    </div>
  );
}

export default ProgressBar;
