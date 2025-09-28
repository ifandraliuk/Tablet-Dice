import React from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus, faRefresh } from "@fortawesome/free-solid-svg-icons";
import MotionButton from "../../components/MotionButton";

function AllTalents({
  handleChange,
  handleClick,
  filter,
  setFilter,
  icons,
  categorizedTalents,
  fractionTheme,
}) {
  console.log("ALLTALENTS rerender")
  const { talentBoni } = useSelector((state) => state.inventory);
  const { allTalents, playerTalents } = useSelector((state) => state.talents);

  const getTalentBonusValue = (talentName) => {
    console.log(talentBoni);
    if (talentBoni.length > 0) {
      const foundBoni = talentBoni.find((el) => el.bonus.type === talentName);
      console.log(`Value for ${talentName}: ${foundBoni?.value}`);
      return foundBoni ? foundBoni.value : null;
    } else return null;
  };

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
              .map((talent, i) => {
                const talentExists = playerTalents.find(
                  (el) => el.talent.name === talent.name
                );
                return (
                  <tr key={talent._id}>
                    <td>{talent.name}</td>
                    <td className={`${talent.category}`}>
                      <FontAwesomeIcon icon={icons[talent.category]} />{" "}
                      {talent.category}
                    </td>
                    <td>{talent.dice}</td>

                    <td>
                      {talentExists ? talentExists["points"] : 0}
                      {getTalentBonusValue(talent.name) && (
                        <strong className="green-text">
                          {`+(${getTalentBonusValue(talent.name)})`}
                        </strong>
                      )}
                    </td>
                    <td>
                      <MotionButton
                        name={talent.name}
                        icon={faPlus}
                        onClick={handleClick}
                        enabled={`${talentExists}`}
                      />
                    </td>
                  </tr>
                );
                /* ); */
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default React.memo(AllTalents);
