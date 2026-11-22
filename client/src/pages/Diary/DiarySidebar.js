import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleGroup,
  faBookAtlas,
  faTimeline,
  faCircleExclamation,
  faCircleQuestion,
  faFeather,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { diaryCategories } from "../../data/ConstVariables";
import { faFortAwesome } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { ALL_DIARY_CATEGORIES } from "./diaryView";

const DiarySidebar = React.memo(function DiarySidebar({
  diary,
  activeCategory,
  setCategory,
  fractionTheme,
  disabled,
}) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const icons = useMemo(
    () => ({
      [ALL_DIARY_CATEGORIES]: faLayerGroup,
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

  const categoryCounts = useMemo(() => {
    const counts = {};

    diary?.forEach((entry) => {
      const key = entry?.category || "Sonstiges";
      counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
  }, [diary]);

  return (
    <div className="filter-sidebar d-flex flex-column mt-2">
      {[ALL_DIARY_CATEGORIES, ...diaryCategories].map((category) => {
        const label = category === ALL_DIARY_CATEGORIES ? "Alle Kategorien" : category;
        const count = category === ALL_DIARY_CATEGORIES ? (diary?.length || 0) : (categoryCounts[category] || 0);
        const isExpanded =
          activeCategory === category || hoveredCategory === category;

        return (
          <motion.button
            key={category}
            type="button"
            disabled={disabled}
            aria-label={`${label} (${count})`}
            aria-pressed={activeCategory === category}
            title={`${label} (${count})`}
            className={`button diary-filter-btn mb-2 ${
              activeCategory === category ? `${fractionTheme}-active` : ""
            }`}
            name={category}
            onClick={(e) => setCategory(e.currentTarget.name)}
            onMouseEnter={() => setHoveredCategory(category)}
            onMouseLeave={() => setHoveredCategory(null)}
            initial={false}
            animate={isExpanded ? "open" : "closed"}
            whileHover="open"
            variants={{
              closed: { width: 44 },
              open: { width: category === ALL_DIARY_CATEGORIES ? 240 : 190 },
            }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          >
            <motion.span
              className="diary-filter-count"
              variants={{
                closed: { opacity: 1, width: "auto", marginRight: 6 },
                open: { opacity: 0, width: 0, marginRight: 0 },
              }}
              transition={{ duration: 0.15 }}
              style={{ overflow: "hidden", whiteSpace: "nowrap" }}
            >
              {count}
            </motion.span>

            <motion.span
              className="diary-filter-text"
              variants={{
                closed: { opacity: 0, width: 0, overflow: "hidden" },
                open: { opacity: 1, width: "auto" },
              }}
              transition={{ duration: 0.15 }}
              style={{ whiteSpace: "nowrap", overflow: "hidden" }}
            >
              {label} ({count})
            </motion.span>

            <span className="diary-filter-icon">
              <FontAwesomeIcon
                icon={icons[category]}
                className={`${activeCategory === category ? fractionTheme : ""}-text`}
              />
            </span>
          </motion.button>
        );
      })}
    </div>
  );
});

export default DiarySidebar;
