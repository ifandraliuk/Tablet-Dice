import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

const TalentFilterSidebar = React.memo(function TalentFilterSidebar({
  icons,
  filter,
  setFilter,
  fractionTheme,
}) {
  return (
    <div className="filter-sidebar d-flex flex-column">
      {Object.keys(icons).map((name) => (
        <button
          key={name}
          type="button"
          className={`mb-2 ${filter === name ? `${fractionTheme}-active` : ""}`}
          name={name}
          onClick={(e) => setFilter(e.currentTarget.name)}
        >
          <FontAwesomeIcon icon={icons[name]} />
        </button>
      ))}

      <button
        type="button"
        className={`mt-2 ${filter === "" ? `${fractionTheme}-active` : ""}`}
        name="clear"
        onClick={() => setFilter("")}
      >
        <FontAwesomeIcon icon={faRefresh} />
      </button>
    </div>
  );
});

export default TalentFilterSidebar;
