import React, { useState, useMemo, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faFloppyDisk,
  faArrowRight,
  faSortUp,
  faSortDown,
  faX,
  faPlus,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { tableAnimation } from "../../data/Animations";

const ActiveTalentRow = React.memo(function TalentRow({
  el, bonus, edit, icons, draftValue, handleChange, handleRemove
}) {
  return (
    <motion.tr
      layout
      variants={tableAnimation}
      initial="init"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}   // <- kein delay mit index
    >
      <td>{el.talent.name}</td>
      <td className={`${el.talent.category}`}>
        <FontAwesomeIcon icon={icons[el.talent.category]} /> {el.talent.category}
      </td>
      <td>{el.talent.dice}</td>

      {edit ? (
        <td>
          {el.points} <FontAwesomeIcon icon={faArrowRight} />
          <input
            name={el._id}
            type="number"
            onChange={handleChange}
            value={draftValue}
          />
        </td>
      ) : (
        <td>
          {bonus != null ? (
            <>
              {el.points}
              <strong className="green-text">{`+(${bonus})`}</strong>
            </>
          ) : (
            el.points
          )}
        </td>
      )}

      <td>
        <button type="button" className="btn-remove" id={el._id} onClick={handleRemove}>
          <FontAwesomeIcon icon={faX} />
        </button>
      </td>
    </motion.tr>
  );
});

export default ActiveTalentRow;