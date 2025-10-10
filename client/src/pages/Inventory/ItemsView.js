import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { itemNames } from "../../data/ConstVariables";

import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import {
  setPagination,
  getItem,
  searchQuery,
  selectedGenus,
  getGenuses,
} from "../../features/item/itemSlice";
import MotionButton from "../../components/MotionButton";
import GenusList from "./GenusList";
import Slot from "./Slot";
const ItemsView = ({
  setShowInfo,
  iFilter,
  setCustomInfo,
  addItemToInventory,
}) => {
  const dispatch = useDispatch();
  const { data, activeGenus, n, m } = useSelector((state) => state.items);
  const [sortBy, setSortBy] = useState("none");
  const forward = () => {
    const nextN = parseInt(n) + 10;
    const nextM = parseInt(m) + 10;
    console.log("next pages", nextN, nextM);

    dispatch(setPagination({ n: nextN, m: nextM }));
  };

  const back = () => {
    const backN = parseInt(n) - 10;
    const backM = parseInt(m) - 10;
    console.log("back pages", backN, backM);

    dispatch(setPagination({ n: backN, m: backM }));
  };

  const handleActiveGenus = (e) => {
    const genus = e.currentTarget.name;
    console.log(genus);
    dispatch(selectedGenus({ genus: genus }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // Wenn du hier direkt neu laden willst:
    // fetchItems({ sort: e.target.value, n, m, search: searchTerm, ... })
  };

  useEffect(() => {
    dispatch(getGenuses({ filter: iFilter }));
  }, [dispatch, iFilter]);
  useEffect(() => {
    console.log("useEffect request");
    console.log(iFilter, activeGenus);
    const data = {
      category: iFilter ? iFilter : "Rüstung", //iFilter
      genus: activeGenus ? activeGenus : "Kopf",
      n: n,
      m: m,
    };

    dispatch(getItem(data));
  }, [dispatch, n, m, iFilter, activeGenus]);
  const handleSearch = (e) => {
    dispatch(searchQuery(e.target.value)); // Dispatch search action
  };
  return (
    <div className="row ">
      <div className="col-lg-4">
        <GenusList handleActiveGenus={handleActiveGenus} />
      </div>
      <div className="col-lg-10">
        {<div className="row"></div>}
        <div className="row">
          <div className="col-auto mt-2">
            <div className="row">
              <div className="col">
                {" "}
                <input
                  type="text"
                  placeholder="Search items..."
                  onChange={handleSearch} // Call the handler when input changes
                />
              </div>
              <div className="col">
                <label className="form-label mb-0">Kategorie</label>
                <select
                  id="genusFilter"
                  className="form-select"
                  value={sortBy}
                  onChange={handleSortChange}
                  aria-label="Sortierung nach Rarity"
                  style={{ minWidth: 180 }}
                  label="Rarity"
                >
                  <option key="none"></option>
                  {Object.keys(itemNames?.rarity).map((rarity) => {
                    return (
                      <option key={rarity} value={rarity}>
                        {rarity}
                      </option>
                    );
                  })}
                </select>
              </div>
                            <div className="col">
                <label className="form-label mb-0">Wertigkeit</label>
                <select
                  id="rarityFilter"
                  className="form-select"
                  value={sortBy}
                  onChange={handleSortChange}
                  aria-label="Sortierung nach Rarity"
                  style={{ minWidth: 180 }}
                  label="Rarity"
                >
                  <option key="none"></option>
                  {Object.keys(itemNames?.rarity).map((rarity) => {
                    return (
                      <option key={rarity} value={rarity}>
                        {rarity}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <Slot
              modus={true}
              setShowInfo={setShowInfo}
              setCustomInfo={setCustomInfo}
            />
          </div>

          <div className="row mt-3">
            <div className="col-6">
              {n > 0 && (
                <MotionButton
                  icon={faAnglesLeft}
                  text={n}
                  onClick={back}
                  theme=""
                />
              )}
              <MotionButton
                icon={faAnglesRight}
                text={m}
                onClick={forward}
                theme=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ItemsView;
