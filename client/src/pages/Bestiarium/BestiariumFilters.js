import React, { memo } from "react";

const BestiariumFilters = memo(({
  gattungen,
  habitats,
  statuses,
  selectedArt,
  selectedGattung,
  selectedHabitat,
  selectedStatus,
  searchText,
  onArtChange,
  onGattungChange,
  onHabitatChange,
  onStatusChange,
  onSearchChange,
}) => {
  return (
    <div className="row g-3 align-items-end bestiaria-filters">
      <div className="col-12 col-md-6 col-xl">
        <label className="form-label mb-1" htmlFor="bestiariumSearch">
          Suche:
        </label>
        <input
          id="bestiariumSearch"
          className="form-control dark-filter-control w-100"
          type="search"
          placeholder="Tiere suchen..."
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="col-12 col-md-6 col-xl">
        <label className="form-label mb-1" htmlFor="bestiariumArt">
          Art:
        </label>
        <select
          id="bestiariumArt"
          className="form-select dark-filter-control w-100"
          value={selectedArt}
          onChange={(event) => onArtChange(event.target.value)}
          aria-label="Nach Art filtern"
        >
          <option value="creature">Kreatur</option>
          <option value="humanoid">Humanoid</option>
        </select>
      </div>
      <div className="col-12 col-md-6 col-xl">
        <label className="form-label mb-1" htmlFor="bestiariumGattung">
          Gattung:
        </label>
        <select
          id="bestiariumGattung"
          className="form-select dark-filter-control w-100"
          value={selectedGattung}
          onChange={(event) => onGattungChange(event.target.value)}
          aria-label="Nach Gattung filtern"
        >
          <option value="">Alle Gattungen</option>
          {gattungen.map((gattung) => (
            <option key={gattung} value={gattung}>
              {gattung}
            </option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-6 col-xl">
        <label className="form-label mb-1" htmlFor="bestiariumHabitat">
          Habitat:
        </label>
        <select
          id="bestiariumHabitat"
          className="form-select dark-filter-control w-100"
          value={selectedHabitat}
          onChange={(event) => onHabitatChange(event.target.value)}
          aria-label="Nach Habitat filtern"
        >
          <option value="">Alle Habitate</option>
          {habitats.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-6 col-xl">
        <label className="form-label mb-1" htmlFor="bestiariumStatus">
          Status:
        </label>
        <select
          id="bestiariumStatus"
          className="form-select dark-filter-control w-100"
          value={selectedStatus}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="Nach Status filtern"
        >
          <option value="">Alle Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});

export default BestiariumFilters;
