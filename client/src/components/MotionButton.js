import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
const MotionButton = ({ name, onClick, content, icon, theme, onRepeat }) => {

  const buttonVariants = {
    init: {
        opacity: 0
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
         delay: Math.random()
      }
    },
    repeatAnimation: {
      scale: [0.5, 0.8, 1.2],
      transition: {
        repeat: Infinity,
        duration: 2,
      },
    },
    whileHover: {
      scale: 0.8,
    },
    whileTap: {
      scale: [0.8, 1, 0.9],
    },
    whileFocus: {
      // Your focus animation properties
      scale: 1.2, // Example: Increase scale on focus
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)", // Example: Add a box shadow on focus
    },
  };

  return (
    <motion.button
      name={name}
      onClick={onClick}
      variants={buttonVariants}
      initial="init"
      animate={onRepeat ? "repeatAnimation" : "animate"}
      whileHover="whileHover"
      whileFocus=""
      className={`${theme}-active border-btn`}
    //  className={"btn-light"}
    
    >
      {icon && <FontAwesomeIcon icon={icon}  />} {/* Render icon if provided */}
      {content  && content} {/* Render text if provided and no icon */}
    </motion.button>
  );
};

export default MotionButton;
