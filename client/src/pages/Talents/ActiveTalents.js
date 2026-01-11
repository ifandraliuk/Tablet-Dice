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
import { useDispatch, useSelector } from "react-redux";
import {
  addToPlayer,
  updatePlayersTalent,
  removeFromPlayer,
  sortedTalents,
} from "../../features/talent/talentSlice";
import { motion, AnimatePresence } from "framer-motion";
import { tableAnimation } from "../../data/Animations";
import ActiveTalentRow from "./ActiveTalentsRow";

function ActiveTalents({
  filter,
  setFilter,
  icons,
  edit,
  handleChange,
  handleSubmit,
  fractionTheme,
  newTalents,
  bonusMap
}) {
  console.log("ACTIVETALENTS rerender");
  const { playerTalents } = useSelector((state) => state.talents);
  const dispatch = useDispatch();
  const [update, toUpdate] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [sortReverse, setSortReverse] = useState(true);
  const talentHeaders = useMemo(
    () => [
      { name: "name", label: "Name" },
      { name: "category", label: "Kategorie" },
      { name: "dice", label: "Würfel" },
      { name: "points", label: "Werte" },
    ],
    []
  );


  const handleRemove = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(removeFromPlayer({ id: e.currentTarget.id }));
    },
    [dispatch]
  );

  const draftMap = useMemo(
    () => Object.fromEntries(newTalents || []),
    [newTalents]
  );

  const sort = (e) => {
    setSortKey(e.currentTarget.name);

    if (sortKey === e.currentTarget.name) {
      setSortReverse((sortReverse) => !sortReverse);
    }
  };
  useEffect(() => {
    if (sortKey !== "") {
      dispatch(sortedTalents({ sortKey, reverse: sortReverse }));
    }
  }, [dispatch, sortKey, sortReverse]);

  return (
    <div class="row">
      {playerTalents.length > 0 ? (
        <>
          <div className="col-md-12">
            <table className="custom-table">
              <thead>
                <tr>
                  {talentHeaders.map((header) => (
                    <th key={header.name}>
                      {header.label}{" "}
                      <button
                        type="button"
                        className="sort-btn"
                        name={header.name}
                        onClick={sort}
                      >
                        {sortKey === header.name && sortReverse ? (
                          <FontAwesomeIcon icon={faSortDown} />
                        ) : (
                          <FontAwesomeIcon icon={faSortUp} />
                        )}
                      </button>{" "}
                    </th>
                  ))}
                  <th>X</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {playerTalents
                    ?.filter((el) => !filter || el.talent.category === filter)
                    .map((el) => {
                      const bonus = bonusMap.get(el.talent.name);

                      return (
                        <ActiveTalentRow
                          key={el._id}
                          el={el}
                          bonus={bonus}
                          edit={edit}
                          icons={icons}
                          draftValue={draftMap[el._id] ?? el.points}
                          handleChange={handleChange}
                          handleRemove={handleRemove}
                        />
                      );
                    })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <p>Keine Talente gefunden</p>
        </>
      )}
    </div>
  );
}

export default ActiveTalents;
