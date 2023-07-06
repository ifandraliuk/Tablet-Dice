import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { tableAnimation } from "../data/Animations";
const Table = ({ items, addItem, itemSelected, getDetails }) => {
  return (
    <motion.table className="custom-table" 
    initial={{ opacity: 0 }}
    animate={{opacity: 1,
    }}
    transition={{
      duration: 0.5
    }}
    >
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Typ</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items?.map((item, ind) => {
          const r = rarity[item.rarity];
          const g = genus && genus[item.genus];

          return (
            <tr key={item._id}>
              <td>
                <img
                  alt="icon"
                  name={item._id}
                  src={`/icons/${r}/${g}xhdpi.png`}
                  onClick={itemSelected}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td className="inline-td">
                <div className="button-group ">
                  <button className="btn-small" name={ind} onClick={getDetails}>
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </button>
                  <button className="btn-small" name={ind} onClick={addItem}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </motion.table>
  );
};

export default Table;
