import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus, faRefresh } from "@fortawesome/free-solid-svg-icons";

import AllTalentRow from "./AllTalentRow";

function AllTalents({
  handleChange,
  handleClick,
  filter,
  setFilter,
  icons,
  categorizedTalents,
  fractionTheme,
  bonusMap,
}) {
  console.log("ALLTALENTS rerender");

  const { allTalents, playerTalents } = useSelector((state) => state.talents);

  /*   const getTalentBonusValue = (talentName) => {
    console.log(talentBoni);
    if (talentBoni.length > 0) {
      const foundBoni = talentBoni.find((el) => el.bonus.type === talentName);
      console.log(`Value for ${talentName}: ${foundBoni?.value}`);
      return foundBoni ? foundBoni.value : null;
    } else return null;
  }; */
  const playerTalentPointsByName = useMemo(() => {
    const m = new Map();
    for (const el of playerTalents) {
      m.set(el.talent.name, el.points);
    }
    return m;
  }, [playerTalents]);
  return (
    <div className="row">
      <div className="col-md-1">
        <div className="filter-sidebar d-flex flex-column">
          {Object.keys(icons).map((name) => (
            <button
              key={name}
              className={`mb-2 ${
                filter === name ? `${fractionTheme}-active` : ""
              }`}
              name={name}
              onClick={(e) => setFilter(e.currentTarget.name)}
            >
              <FontAwesomeIcon icon={icons[name]} />
            </button>
          ))}
          <button
            className={`mt-2 ${filter === "" ? `${fractionTheme}-active` : ""}`}
            name="clear"
            onClick={() => setFilter("")}
          >
            <FontAwesomeIcon icon={faRefresh} />
          </button>
        </div>
      </div>
      <div className="col-md-11">
        <table className="custom-table h-100">
          <thead>
            <tr>
              <th>
                {/*  <FontAwesomeIcon icon={icons[categorizedTalents]} />
            {` ${categorizedTalents}`} */}
                Name
              </th>
              <th>Kategorie</th>
              <th>Würfel</th>
              <th>Werte</th>
              <th>+</th>
            </tr>
          </thead>
          <tbody>
            {allTalents
              ?.filter((talent) => !filter || talent.category === filter)
              .map((talent) => {
                const existsPoints =
                  playerTalentPointsByName.get(talent.name) ?? null;
                const bonus =
                  existsPoints != null
                    ? bonusMap.get(talent.name) ?? null
                    : null;

                return (
                  <AllTalentRow
                    key={talent._id}
                    talent={talent}
                    icons={icons}
                    existsPoints={existsPoints}
                    bonus={bonus}
                    handleClick={handleClick}
                  />
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllTalents;
