import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import MotionButton from "../../components/MotionButton";

const AllTalentRow = React.memo(function AllTalentRow({
  talent,
  icons,
  existsPoints, // number | null (null = nicht gelernt)
  bonus, // number | null
  handleClick,
}) {
  const learned = existsPoints != null;

  return (
    <tr>
      <td>{talent.name}</td>

      <td className={`${talent.category}`}>
        <FontAwesomeIcon icon={icons[talent.category]} /> {talent.category}
      </td>

      <td>{talent.dice}</td>

      <td>
        {learned ? existsPoints : 0}
        {bonus != null ? (
          <>
            {talent.points}
            <strong className="green-text">{`+(${bonus})`}</strong>
          </>
        ) : (
          talent.points
        )}
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
