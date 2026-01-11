import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleGroup,
  faPlus,
  faXmark,
  faBookAtlas,
  faTimeline,
  faCircleExclamation,
  faCircleQuestion,
  faFeather,
} from "@fortawesome/free-solid-svg-icons";
import { diaryCategories } from "../../data/ConstVariables";
import { faFortAwesome } from "@fortawesome/free-brands-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
const DiarySidebar = React.memo(function DiarySidebar({
  activeCategory,
  setCategory,
  fractionTheme,
}) {
  const icons = useMemo(
    () => ({
      Personen: faPeopleGroup,
      Orte: faFortAwesome,
      Wissen: faBookAtlas,
      Erlebtes: faTimeline,
      Aktiv: faCircleExclamation,
      Abgeschlossen: faCircleQuestion,
      Sonstiges: faFeather,
    }),
    []
  );
  return (
    <div className="filter-sidebar d-flex flex-column mt-2">
      {diaryCategories?.map((category) => (
        <motion.button
          key={category}
          type="button"
          className={`button diary-filter-btn mb-2 ${
            activeCategory === category ? `${fractionTheme}-active` : ""
          }`}
          name={category}
          onClick={(e) => setCategory(e.currentTarget.name)}
          text={category}
          initial={false}
          animate={ activeCategory === category ? "open" : "closed"}
          whileHover="open"
          variants={{
            closed: { width: 44 },
            open: { width: 190 },
          }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        >
          {/* Text links (erscheint beim Hover) */}
          <motion.span
            className="diary-filter-text"
            variants={{
              closed: { opacity: 0, x: 10 },
              open: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.15 }}
          >
            {category}
          </motion.span>

          {/* Icon rechtsbündig */}
          <span className="diary-filter-icon">
            <FontAwesomeIcon icon={icons[category]} className={`${activeCategory === category ? category: ''}-icon`}/>
          </span>
        </motion.button>
      ))}
    </div>
  );
});

export default DiarySidebar;
