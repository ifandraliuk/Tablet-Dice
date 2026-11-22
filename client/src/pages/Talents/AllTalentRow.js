import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import MotionButton from "../../components/MotionButton";
import { TalentProbe } from "../../components/TalentProbe";

const AllTalentRow = React.memo(function AllTalentRow({
  talent,
  icons,
  existsPoints, // number | null (null = nicht gelernt)
  bonus, // number | null
  probeData,
  highlighted,
  handleClick,
}) {
  const learned = existsPoints != null;

  return (
    <tr id={highlighted ? "talent-progression-target" : undefined} className={highlighted ? "talent-progression-target" : undefined}>
      <td>{talent.name}</td>

      <td className={`${talent.category}`}>
        <span className="talent-category-label">
          <FontAwesomeIcon icon={icons[talent.category]} /> {talent.category}
        </span>
      </td>

      <td><TalentProbe dice={talent.dice} attributes={probeData.attributes} points={existsPoints ?? 0} loading={probeData.loading} compact /></td>

      <td>
        {learned ? existsPoints : 0}
        {bonus != null ? (
          <strong className="green-text">{`+(${bonus})`}</strong>
        ) : null}
      </td>

      <td>
        {learned ? (
          <FontAwesomeIcon icon={faCheck} />
        ) : (
          <MotionButton
            name={talent.name}
            icon={faPlus}
            onClick={handleClick}
            disabled={learned}
          />
        )}
      </td>
    </tr>
  );
});

export default AllTalentRow;
