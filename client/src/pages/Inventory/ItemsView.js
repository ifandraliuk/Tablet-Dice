import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { itemNames } from "../../data/ConstVariables";
import ItemIcon from "../../components/ItemIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faAnglesLeft,
  faAnglesRight,
  faCheck,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  setPagination,
  getItem,
  selectedGenus,
  getGenuses,
  searchInCategory,
} from "../../features/item/itemSlice";
import MotionButton from "../../components/MotionButton";
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
  const inventory = useSelector((state) => state.inventory.inventory);
  const { fractionTheme } = useSelector((state) => state.player);
  const displayedCategory = iFilter || activeCategory || "Rüstung";
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
    <div className="row items-view">
      {/*       <div className="col-lg-4" >
        <GenusList handleActiveGenus={handleActiveGenus} />
      </div> */}
      <div className="col-12">
        <h2 className="inventory-items-category">
          {displayedCategory}
        </h2>
        <div className="row g-3 align-items-end items-view__filters">
          <div className="col-12 col-md-4">
            <label className="form-label mb-1" htmlFor="itemSearch">
              Suche:
            </label>
            <input
              id="itemSearch"
              className="form-control w-100"
              type="search"
              placeholder="Search items..."
              onChange={handleSearch}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label mb-1" htmlFor="genusFilter">
              Gattung:
            </label>
            <select
              id="genusFilter"
              className="form-select w-100"
              value={activeGenus}
              onChange={handleActiveGenus}
              aria-label="Sortierung nach Genus"
            >
              {genuses?.map((genus) => (
                <option key={genus} value={genus}>
                  {genus}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label mb-1" htmlFor="rarityFilter">
              Wertigkeit:
            </label>
            <select
              id="rarityFilter"
              className="form-select w-100"
              value={rarity}
              onChange={handleSortChange}
              aria-label="Sortierung nach Rarity"
            >
              <option key="none"></option>
              {Object.keys(itemNames?.rarity).map((rarity) => (
                <option key={rarity} value={rarity}>
                  {rarity}
                </option>
              ))}
            </select>
          </div>
        </div>
        {data?.length > 0 ? (
          <div className="table-responsive mt-3">
            <table className="custom-table inventory-items-table">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Typ</th>
                  <th scope="col">Wertigkeit</th>
                  <th scope="col">Gewicht</th>
                  <th scope="col">Wert</th>
                  <th
                    scope="col"
                    className="inventory-items-table__action"
                    aria-label="Hinzufügen"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((item) => item.status !== "Ausgerüstet")
                  .map((item) => (
                    <tr
                      key={item._id}
                      className="inventory-items-table__row"
                      onClick={() => {
                        setShowInfo(item._id);
                        setCustomInfo(item);
                      }}
                    >
                      <td>
                        <div className="inventory-items-table__item">
                          <ItemIcon item={item} enchantment={item.enchantment} />
                          <span>
                            <span className="inventory-items-table__name">
                              {item.name}
                            </span>
                            <span
                              className={`inventory-items-table__genus ${fractionTheme}-text`}
                            >
                              {item.genus}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td>{item.type || "—"}</td>
                      <td>{item.rarity || "—"}</td>
                      <td>{item.weight ?? "—"}</td>
                      <td>{item.value ?? "—"}</td>
                      <td className="inventory-items-table__action">
                        {inventory?.some(
                          (entry) =>
                            String(entry.item?._id ?? entry.item) ===
                            String(item._id),
                        ) ? (
                          <FontAwesomeIcon
                            icon={faCheck}
                            aria-label={`${item.name} ist bereits im Inventar`}
                            title="Bereits im Inventar"
                          />
                        ) : (
                          <button
                            type="button"
                            className={`inventory-items-table__add ${fractionTheme}`}
                            aria-label={`${item.name} zum Inventar hinzufügen`}
                            title="Zum Inventar hinzufügen"
                            onClick={(event) => {
                              event.stopPropagation();
                              addItemToInventory(item._id);
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3">
            Keine Items in dieser Kategorie gefunden. Wähle eine andere aus.
          </p>
        )}
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
  );
};
export default ItemsView;
