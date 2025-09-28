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

function ActiveTalents({
  filter,
  setFilter,
  icons,
  edit,
  handleChange,
  handleSubmit,
  fractionTheme,
  newTalents
}) {
  console.log("ACTIVETALENTS rerender")
  const { playerTalents } = useSelector((state) => state.talents);
  const { talentBoni } = useSelector((state) => state.inventory);
  const dispatch = useDispatch();
  const [update, toUpdate] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [sortReverse, setSortReverse] = useState(true);
  const talentHeaders = useMemo(()=>(
     [
    { name: "name", label: "Name" },
    { name: "category", label: "Kategorie" },
    { name: "dice", label: "Würfel" },
    { name: "points", label: "Werte" },
  ]
  ), [])

  const getTalentBonusValue = (talentName) => {
    console.log(talentBoni);
    const foundBoni = talentBoni.find((el) => el.bonus.type === talentName);
    console.log(`Value for ${talentName}: ${foundBoni?.value}`);
    return foundBoni ? foundBoni.value : null;
  };

  const handleRemove= useCallback((e) => {
    //e.preventDefault();
    console.log(e.currentTarget.name);
    dispatch(removeFromPlayer({ id: e.currentTarget.id }));
  },[dispatch]);

const draftMap = useMemo(() => Object.fromEntries(newTalents || []), [newTalents]);


  const sort = (e) => {
    setSortKey(e.currentTarget.name);
    console.log(sortKey === e.currentTarget.name);
    if (sortKey === e.currentTarget.name) {
      setSortReverse((sortReverse) => !sortReverse);
    }
    console.log(sortKey, sortReverse);
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
                className={`mt-2 ${
                  filter === "" ? `${fractionTheme}-active` : ""
                }`}
                name="clear"
                onClick={() => setFilter("")}
              >
                <FontAwesomeIcon icon={faRefresh} />
              </button>
            </div>
          </div>
          <div className="col-md-11">
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
                    .map((el, i) => (
                      <motion.tr
                        key={el._id}
                        layout
                        variants={tableAnimation}
                        initial="init"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <td>{el.talent.name}</td>
                        <td className={`${el.talent.category}`}>
                          <FontAwesomeIcon icon={icons[el.talent.category]} />{" "}
                          {el.talent.category}
                        </td>
                        <td>{el.talent.dice}</td>
                        {edit ? (
                          <td>
                            {el.points}
                            <FontAwesomeIcon icon={faArrowRight} />
                            <input
                              name={el._id}
                              type="number"
                              onChange={handleChange}
                              value={draftMap[el._id] ?? el.points}
                            />
                          </td>
                        ) : (
                          <td>
                            {getTalentBonusValue(el.talent.name) ? (
                              <>
                                {el.points}
                                <strong className="green-text">
                                  {`+(${getTalentBonusValue(el.talent.name)})`}
                                </strong>
                              </>
                            ) : (
                              el.points
                            )}
                          </td>
                        )}
                        <td>
                          <button
                            type="button"
                            className="btn-remove"
                            id={el._id}
                            style={{ paddingBottom: "1px", paddingTop: "1px" }}
                            onClick={handleRemove}
                          >
                            <FontAwesomeIcon icon={faX} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
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

export default React.memo(ActiveTalents);
