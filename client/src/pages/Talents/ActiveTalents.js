import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faFloppyDisk,
  faArrowRight,
  faSortUp,
  faSortDown,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTalent,
  removeTalent,
  sortedTalents,
} from "../../features/player/playerSlice";
import { motion, AnimatePresence } from "framer-motion";
import { tableAnimation } from "../../data/Animations";

function ActiveTalents({ props }) {
  const { player } = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const [edit, toEdit] = useState(false);
  const [update, toUpdate] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [sortReverse, setSortReverse] = useState(true);
  const talentHeaders = [
    { name: "name", label: "Name" },
    { name: "category", label: "Kategorie" },
    { name: "dice", label: "Würfel" },
    { name: "points", label: "Werte" },
  ];
  const handleEdit = () => {
    toEdit((edit) => !edit);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = isNaN(parseInt(e.target.value)) ? 0 : e.target.value;
    console.log(name, typeof value);
    let el = [e.target.name, parseInt(value)];
    let flag = false;
    if (update.length > 0 && el[1] >= 0) {
      toUpdate(
        update.map((val) => {
          if (val[0] === el[0]) {
            flag = true;
          }
          return flag ? el : val;
        })
      );
      if (!flag) {
        toUpdate([...update, el]);
      }
    } else {
      toUpdate([...update, el]);
    }
  };
  const handleRemove = (e) => {
    console.log(e.currentTarget.name);
    dispatch(removeTalent(e.currentTarget.name));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    update.forEach((el, i) => {
      if (el[1] > 0)
        //sorting out null values
        dispatch(updateTalent({ id: el[0], point: el[1] }));
    });
    toEdit((edit) => !edit);
    toUpdate([]);
  };

  const sort = (e) => {
    setSortKey(e.currentTarget.name);
    console.log(sortKey === e.currentTarget.name);
    if (sortKey === e.currentTarget.name) {
      setSortReverse((sortReverse) => !sortReverse);
    }

    //sortedCallback()
    console.log(sortKey, sortReverse);
  };
  useEffect(() => {
    console.log("useffect");
    dispatch(sortedTalents({ sortKey: sortKey, reverse: sortReverse }));
  }, [dispatch, sortKey, sortReverse]);

  return (
    <div>
      {player?.talents?.length > 0 ? (
        <>
          <div>
            <h3>Erlernte Talente</h3>
          </div>
          <div className="button-group">
            <button className="btn-edit" onClick={handleEdit}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
            <button className="btn-save" onClick={handleSubmit}>
              <FontAwesomeIcon icon={faFloppyDisk} />
            </button>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                {talentHeaders.map((header) => (
                  <th key={header.name}>
                    {header.label}{" "}
                    <button
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
                {player?.talents?.map((el, i) => (
                  <motion.tr
                    key={el._id}
                    layout
                    variants={tableAnimation}
                    initial="init"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.5, delay: i*0.2}}
                  >
                    <td>{el.talent.name}</td>
                    <td className={`${el.talent.category}`}>
                      {el.talent.category}
                    </td>
                    <td>{el.talent.dice}</td>
                    {edit ? (
                      <td>
                        {`${el.points} `}{" "}
                        <FontAwesomeIcon icon={faArrowRight} />
                        <input
                          name={el._id}
                          type="number"
                          onChange={handleChange}
                          defaultValue={el.points}
                        />
                      </td>
                    ) : (
                      <td>{el.points}</td>
                    )}
                    <td>
                      <button
                        className="btn-remove"
                        name={el._id}
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
