import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { itemNames } from "../../data/ConstVariables";
import ItemIcon from "../../components/ItemIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faAnglesLeft,
  faAnglesRight,
  faCheck,
  faPlus,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import {
  setPagination,
  getItem,
  selectedGenus,
  getGenuses,
  searchInCategory,
  getProductions,
} from "../../features/item/itemSlice";
const ItemsView = ({
  setShowInfo,
  iFilter,
  setCustomInfo,
  addItemToInventory,
}) => {
  const dispatch = useDispatch();
  const {
    data,
    totalCount,
    isLoading,
    activeGenus,
    activeCategory,
    genuses,
    n,
    m,
    productionOptions,
    productionOptionsError,
  } = useSelector((state) => state.items);
  const inventory = useSelector((state) => state.inventory.inventory);
  const { fractionTheme } = useSelector((state) => state.player);
  const displayedCategory = iFilter || activeCategory || "Rüstung";
  const [rarity, serRarirtyFilter] = useState("none");
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const availableTypes = useMemo(
    () =>
      [...new Set(data
        .filter((item) => item.status !== "Ausgerüstet")
        .map((item) => item.type)
        .filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "de")),
    [data]
  );
  const [selectedProduction, setSelectedProduction] = useState("");
  const visibleItems = data
    .filter((item) => item.status !== "Ausgerüstet")
    .filter((item) => !selectedType || item.type === selectedType);
  const pageNumber = Math.floor(Number(n) / 10) + 1;
  const pageStart = data.length > 0 ? Number(n) + 1 : 0;
  const pageEnd = Math.min(Number(n) + data.length, totalCount);
  const hasPreviousPage = Number(n) > 0;
  const hasNextPage = Number(n) + data.length < totalCount;

  useEffect(() => {
    setSelectedType("");
    setSelectedProduction("");
  }, [iFilter, activeGenus]);
  const forward = () => {
    const nextN = parseInt(n) + 10;
    const nextM = parseInt(m) + 10;
    dispatch(setPagination({ n: nextN, m: nextM }));
  };

  const back = () => {
    const backN = parseInt(n) - 10;
    const backM = parseInt(m) - 10;
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
        rarity: rarity !== "" ? rarity : "none",
        production: selectedProduction,
      };
      dispatch(searchInCategory(data)); 
      
        dispatch(setPagination({ n: 0, m: 10 }));// Dispatch search action
    // Wenn du hier direkt neu laden willst:
    // fetchItems({ sort: e.target.value, n, m, search: searchTerm, ... })
  };

  const handleProductionChange = (e) => {
    setSelectedProduction(e.target.value);
    if (Number(n) !== 0) dispatch(setPagination({ n: 0, m: 10 }));
  };

  useEffect(() => {
    dispatch(getGenuses({ filter: iFilter }));
  }, [dispatch, iFilter]);

  useEffect(() => {
    if (activeGenus) {
      dispatch(
        getProductions({
          category: displayedCategory,
          genus: activeGenus,
        })
      );
    }
  }, [dispatch, displayedCategory, activeGenus]);


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
        rarity: rarity !== "" ? rarity : "none",
        production: selectedProduction,
      };

      dispatch(getItem(data));
    } else {
      const data = {
        category: activeCategory,
        genus: activeGenus,
        searchText: searchText,
        n: n,
        rarity: rarity !== "" ? rarity : "none",
        production: selectedProduction,
      };
      dispatch(searchInCategory(data)); // Dispatch search action
    }
  }, [
    dispatch,
    n,
    m,
    activeCategory,
    activeGenus,
    searchText,
    rarity,
    selectedProduction,
  ]);



  const handleSearch = (e) => {
    setSearchText(e.target.value);
    if (Number(n) !== 0) dispatch(setPagination({ n: 0, m: 10 }));
  };
  const resetFilters = () => {
    setSearchText("");
    serRarirtyFilter("none");
    setSelectedType("");
    setSelectedProduction("");
    dispatch(selectedGenus({ genus: genuses[0] || "Alle" }));
  };
  return (
    <div className="row items-view">
      {/*       <div className="col-lg-4" >
        <GenusList handleActiveGenus={handleActiveGenus} />
      </div> */}
      <div className="col-12">
        <div className="row g-3 align-items-end items-view__filters">
          <div className="col-12 col-md">
            <label className="form-label mb-1" htmlFor="itemSearch">
              Suche:
            </label>
            <input
              id="itemSearch"
              className="form-control dark-filter-control w-100"
              type="search"
              placeholder="Search items..."
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <div className="col-12 col-md">
            <label className="form-label mb-1" htmlFor="genusFilter">
              Gattung:
            </label>
            <select
              id="genusFilter"
              className="form-select dark-filter-control w-100"
              value={activeGenus}
              onChange={handleActiveGenus}
              aria-label="Sortierung nach Genus"
            >
              <option value="Alle">Alle</option>
              {genuses?.map((genus) => (
                <option key={genus} value={genus}>
                  {genus}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md">
            <label className="form-label mb-1" htmlFor="typeFilter">
              Typ:
            </label>
            <select
              id="typeFilter"
              className="form-select dark-filter-control w-100"
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              aria-label="Nach Typ filtern"
            >
              <option value="">Alle Typen</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md">
            <label className="form-label mb-1" htmlFor="rarityFilter">
              Wertigkeit:
            </label>
            <select
              id="rarityFilter"
              className="form-select dark-filter-control w-100"
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
          <div className="col-12 col-md">
            <label className="form-label mb-1" htmlFor="productionFilter">
              Herstellungsort:
            </label>
            <select
              id="productionFilter"
              className="form-select dark-filter-control w-100"
              value={selectedProduction}
              onChange={handleProductionChange}
              aria-label="Nach Herstellungsort filtern"
            >
              <option value="">Alle Herstellungsorte</option>
              {productionOptions.map((production) => (
                <option key={production} value={production}>
                  {production}
                </option>
              ))}
            </select>
            {productionOptionsError && (
              <small className="text-danger" role="alert">
                Herstellungsorte konnten nicht geladen werden.
              </small>
            )}
          </div>
          <div className="col-12 col-md-auto d-flex justify-content-end">
            <button
              type="button"
              className="filter-reset-button"
              aria-label="Filter zurücksetzen"
              title="Filter zurücksetzen"
              onClick={resetFilters}
            >
              <FontAwesomeIcon icon={faRefresh} aria-hidden="true" />
            </button>
          </div>
        </div>
        {visibleItems.length > 0 ? (
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
                {visibleItems.map((item) => (
                    <tr
                      key={item._id}
                      className={`inventory-items-table__row item-rarity-${
                        itemNames?.rarity?.[
                          item.enchantment?.rarity ?? item.rarity
                        ] || "unknown"
                      }`}
                      onClick={() => {
                        setShowInfo(item._id);
                        setCustomInfo(item);
                      }}
                    >
                      <td data-label="Item" className="inventory-items-table__item-cell">
                        <div className="inventory-items-table__item">
                          <ItemIcon item={item} enchantment={item.enchantment} />
                          <span>
                            <strong className="inventory-items-table__name">
                              {item.name}
                            </strong>
                            <span
                              className={`inventory-items-table__genus ${fractionTheme}-text`}
                            >
                              {item.genus}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td data-label="Typ">{item.type || "—"}</td>
                      <td data-label="Wertigkeit">
                        <span
                          className={`inventory-items-rarity ${
                            itemNames?.rarity?.[item.rarity] || "unknown"
                          }`}
                        >
                          {item.rarity || "—"}
                        </span>
                      </td>
                      <td data-label="Gewicht">{item.weight ?? "—"}</td>
                      <td data-label="Wert">{item.value ?? "—"}</td>
                      <td data-label="Aktion" className="inventory-items-table__action">
                        {inventory?.some(
                          (entry) =>
                            String(entry.item?._id ?? entry.item) ===
                            String(item._id),
                        ) ? (
                          <span
                            className="inventory-items-table__owned"
                            title="Bereits im Inventar"
                          >
                            <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
                            <span>Bereits im Inventar</span>
                          </span>
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
        <div className="items-view__pagination" aria-label="Katalogseitennavigation">
          <button
            type="button"
            className="items-view__pagination-button"
            onClick={back}
            disabled={!hasPreviousPage || isLoading}
            aria-label="Vorherige Ergebnisse"
          >
            <FontAwesomeIcon icon={faAnglesLeft} aria-hidden="true" />
            <span>Zurück</span>
          </button>
          <p className="items-view__pagination-status" aria-live="polite">
            {selectedType ? (
              <>
                Seite {pageNumber} · {visibleItems.length} passende Items auf
                dieser Seite
              </>
            ) : totalCount > 0 ? (
              <>
                Ergebnisse {pageStart}–{pageEnd} von {totalCount}
                <span className="items-view__pagination-page">
                  Seite {pageNumber} von {Math.ceil(totalCount / 10)}
                </span>
              </>
            ) : (
              "Keine Ergebnisse"
            )}
          </p>
          <button
            type="button"
            className="items-view__pagination-button"
            onClick={forward}
            disabled={!hasNextPage || isLoading}
            aria-label="Weitere Ergebnisse"
          >
            <span>Weiter</span>
            <FontAwesomeIcon icon={faAnglesRight} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ItemsView;
