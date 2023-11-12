import React from "react";
import { useSelector } from "react-redux";
import Info from "./Info";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faSuitcase,
  faPerson,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { itemNames } from "../../data/ConstVariables";
import { AnimatePresence, motion } from "framer-motion";
import { tableAnimation } from "../../data/Animations";
const { genus, rarity } = itemNames;

function InventoryTable({
  iFilter,
  onMultiSelect,
  itemSelected,
  showInfo,
  edit,
  handleChange,
  toDelete,
}) {
  const { user } = useSelector((state) => state.auth);
  const { player } = useSelector((state) => state.player);
  const { inventory } = player;
  return (
    <table className="w-100 text-align-left custom-table">
      <thead>
        <tr className="border-bottom">
          <th>Name</th>
          <th>Anzahl</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <AnimatePresence>
          {inventory?.map((invElement, i) => {
            const r = invElement.enchantment
              ? rarity[invElement.enchantment.rarity]
              : rarity[invElement.item.rarity];
            const g = genus && genus[invElement.item.genus];
            const filterCheck =
              iFilter?.length > 0 && invElement.status === iFilter
                ? true
                : iFilter === ""
                ? true
                : false;
            const categoryCheck =
              iFilter === "Rüstung" && iFilter === invElement.item.category
                ? true
                : iFilter === "Waffe" && iFilter === invElement.item.category
                ? true
                : iFilter === "Ressource" && iFilter === invElement.item.category
                ? true
                : iFilter === "Begleiter" && iFilter === invElement.item.category
                ? true
                : false
          
            const showElement = filterCheck || categoryCheck;
            return (
              r &&
              g &&
              showElement && (
                <motion.tr
                  key={invElement._id}
                  layout
                  name={invElement._id}
                  variants={tableAnimation}
                  initial="init"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                >
                  <td style={{ textAlign: "left" }}>
                    <input
                      type="checkbox"
                      name="multichoice"
                      id={invElement._id}
                      onChange={onMultiSelect}
                    />
                     <img
                      name={invElement.item.name}
                      alt="icon"
                      src={`/icons/${r}/${g}xhdpi.png`}
                      onClick={itemSelected}
                      onError={event => {
                        console.log(g)
                        event.target.src = "/icons/common/" + g + "xhdpi.png"
                        event.onerror = null
                      }}
                    />
                    <label htmlFor={invElement._id}>
                      <h4> {invElement.item.name}</h4>
                    </label>
                    {showInfo?.state &&
                      showInfo.item === invElement.item.name && (
                        <Info
                          item={invElement.item}
                          enchantment={invElement.enchantment}
                        />
                      )}
                  </td>
                  {edit ? (
                    <td>
                      <input
                        id="amount"
                        name={invElement._id}
                        type="number"
                        onChange={handleChange}
                        defaultValue={invElement.amount}
                      />
                    </td>
                  ) : (
                    <td>{invElement.amount}</td>
                  )}
                  {edit ? (
                    <td>
                      <select
                        id="status"
                        name={invElement._id}
                        defaultValue={invElement.status}
                        onChange={handleChange}
                      >
                        <option>{user.name}</option>
                        <option>Ausgerüstet</option>
                        <option>Begleiter</option>
                      </select>
                    </td>
                  ) : (
                    <td>
                      {invElement.status === user.name ? (
                        <FontAwesomeIcon icon={faSuitcase} />
                      ) : invElement.status === "Ausgerüstet" ? (
                        <FontAwesomeIcon icon={faPerson} />
                      ) : (
                        <FontAwesomeIcon icon={faPaw} />
                      )}
                    </td>
                  )}
                  <td>
                    <button
                      className="btn-remove"
                      id={invElement._id}
                      onClick={toDelete}
                    >
                      <FontAwesomeIcon icon={faX} />
                    </button>
                  </td>
                </motion.tr>
              )
            );
          })}
        </AnimatePresence>
      </tbody>
    </table>
  );
}

export default InventoryTable;
