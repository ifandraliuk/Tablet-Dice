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
  searchInCategory,
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
  const { data, activeGenus, activeCategory, genuses, n, m } = useSelector(
    (state) => state.items
  );
  const [rarity, serRarirtyFilter] = useState("none");
  const [searchText, setSearchText] = useState("");
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
    const genus = e.currentTarget.value;
    console.log(genus);
    dispatch(selectedGenus({ genus: genus }));
  };

  const handleSortChange = (e) => {
    serRarirtyFilter(e.target.value);

    const data = {
        category: activeCategory,
        genus: activeGenus,
        searchText: searchText,
        n: n,
        rarity:  rarity !== "" ? rarity : "none"
      };
      dispatch(searchInCategory(data)); 
      
        dispatch(setPagination({ n: 0, m: 10 }));// Dispatch search action
    // Wenn du hier direkt neu laden willst:
    // fetchItems({ sort: e.target.value, n, m, search: searchTerm, ... })
  };

  useEffect(() => {
    dispatch(getGenuses({ filter: iFilter }));
  }, [dispatch, iFilter]);


  useEffect(() => {
    console.log("useEffect request");
    console.log(activeCategory, activeGenus, rarity);
    if (searchText === "") {
      console.log("get all items - search is empty");
      const data = {
        category: iFilter ? iFilter : "Rüstung", //iFilter
        genus: activeGenus ? activeGenus : "Kopf",
        n: n,
        m: m,
        rarity: rarity !== "" ? rarity : "none"
      };

      dispatch(getItem(data));
    } else {
      const data = {
        category: activeCategory,
        genus: activeGenus,
        searchText: searchText,
        n: n,
        rarity: rarity !== "" ? rarity : "none"
      };
      dispatch(searchInCategory(data)); // Dispatch search action
    }
  }, [dispatch, n, m, activeCategory, activeGenus, searchText, rarity]);



  const handleSearch = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    if (searchText?.length > 0) {
      const data = {
        category: activeCategory,
        genus: activeGenus,
        searchText: e.target.value,
        n: n,
      };
      dispatch(searchInCategory(data)); // Dispatch search action
    } else {
      // reset search
      const data = {
        category: activeCategory, //iFilter
        genus: activeGenus,
        n: n,
        m: m,
      };
      setSearchText("");
      dispatch(getItem(data));
    }
  };
  return (
    <div className="row ">
      {/*       <div className="col-lg-4" >
        <GenusList handleActiveGenus={handleActiveGenus} />
      </div> */}
      <div className="col-lg-10">
        {<div className="row"></div>}
        <div className="row">
          <div className="col-auto mt-2">
            <div className="row">
              <div className="col">
                <label className="form-label mb-0">Suche:</label>
                <input
                  type="search"
                  placeholder="Search items..."
                  onChange={handleSearch} // Call the handler when input changes
                />
              </div>
              <div className="col">
                <label className="form-label mb-0">Gattung:</label>
                <select
                  id="genusFilter"
                  className="form-select"
                  value={activeGenus}
                  onChange={handleActiveGenus}
                  aria-label="Sortierung nach Genus"
                  style={{ minWidth: 180 }}
                  label="Rarity"
                >
                  {genuses?.map((genus) => {
                    return (
                      <option key={genus} value={genus}>
                        {genus}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col">
                <label className="form-label mb-0">Wertigkeit:</label>
                <select
                  id="rarityFilter"
                  className="form-select"
                  value={rarity}
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
              {(
                <MotionButton
                  icon={faAnglesRight}
                  text={m}
                  onClick={forward}
                  theme=""
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ItemsView;
