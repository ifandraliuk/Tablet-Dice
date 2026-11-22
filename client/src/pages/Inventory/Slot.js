import React from "react";
import ItemIcon from "../../components/ItemIcon";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { itemNames } from "../../data/ConstVariables";

const RANGED_WEAPON_GENUSES = ["Wurfwaffe", "Armbrust", "Bogen", "Schusswaffe"];

const matchesEquipmentSlot = (entry, slotName) => {
  const item = entry.item ?? entry;
  if (slotName === "Fernkampf") {
    return item.category === "Waffe" && RANGED_WEAPON_GENUSES.includes(item.genus);
  }
  if (slotName === "Haupthand") {
    return (
      item.category === "Waffe" &&
      !RANGED_WEAPON_GENUSES.includes(item.genus) &&
      item.genus !== "Werkzeug"
    );
  }
  if (slotName === "Nebenhand") {
    return (
      (item.category === "Rüstung" && item.genus === "Schild") ||
      (item.category === "Waffe" &&
        !RANGED_WEAPON_GENUSES.includes(item.genus) &&
        item.genus !== "Werkzeug" &&
        item.type !== "zweihändig")
    );
  }
  return item.category === "Rüstung" && item.genus === slotName;
};

function Slot({
  modus,
  setCustomInfo,
  filter,
  setShowInfo,
  viewMode = "compact",
  equipmentSlotSelection,
  onSelectEquipmentItem,
  equipmentSelectionLoading = false,
}) {
  const inventory = useSelector((state) => state.inventory.inventory);
  const items = useSelector((state) => state.items.data);
  const filteredData = useSelector((state) => state.items.filteredData);
  const { fractionTheme } = useSelector((state) => state.player);
  const data = modus ? items : inventory;
  const visibleItems = data.filter((entry) => {
    if (entry.status === "Ausgerüstet") {
      return false;
    }

    if (
      !equipmentSlotSelection &&
      filter &&
      filter !== "all" &&
      entry.item?.category !== filter
    ) {
      return false;
    }

    if (
      equipmentSlotSelection &&
      !matchesEquipmentSlot(entry, equipmentSlotSelection)
    ) {
      return false;
    }

    if (modus && filteredData?.length > 0) {
      return filteredData.some((filteredItem) => filteredItem._id === entry._id);
    }

    return true;
  });

  if (visibleItems.length === 0) {
    const hasItems = data.some((entry) => entry.status !== "Ausgerüstet");
    return (
      <p className="inventory-list-empty">
        {equipmentSlotSelection
          ? `Keine passenden Gegenstände für den Slot „${equipmentSlotSelection}“ im Rucksack.`
          : hasItems
          ? "Keine Gegenstände in dieser Kategorie."
          : "Dein Inventar ist noch leer. Über „Gegenstände hinzufügen“ kannst du Items aufnehmen."}
      </p>
    );
  }

  const openItem = (entry) => {
    if (equipmentSlotSelection) {
      onSelectEquipmentItem(entry);
      return;
    }
    setShowInfo(entry._id);
    setCustomInfo?.(entry);
  };

  return (
    <div
      className={`inventory-items inventory-items--${viewMode}`}
      aria-label="Gegenstände im Inventar"
    >
      {visibleItems.map((entry, index) => {
        const item = entry.item ?? entry;
        const amount = entry.amount ?? 1;
        const itemName = item.name ?? "Unbekannter Gegenstand";
        const rarityClass =
          itemNames?.rarity?.[entry.enchantment?.rarity ?? item.rarity] ??
          "unknown";

        return (
          <motion.button
            type="button"
            layout
            key={entry._id}
            className={`inventory-item item-rarity-${rarityClass}`}
            data-item-name={viewMode === "compact" ? itemName : undefined}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.025, 0.3) }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openItem(entry)}
            disabled={Boolean(equipmentSlotSelection && equipmentSelectionLoading)}
            aria-label={
              equipmentSlotSelection
                ? `${itemName}, für ${equipmentSlotSelection} ausrüsten`
                : `${itemName}, Menge ${amount}. Details öffnen`
            }
          >
            <ItemIcon
              animationDelay={index * 0.1}
              item={item}
              enchantment={entry.enchantment}
            />
            {viewMode === "compact" ? (
              <span className="inventory-item__amount" aria-hidden="true">
                ×{amount}
              </span>
            ) : (
              <>
                <span className="inventory-item__content">
                  <strong className="inventory-item__name">{itemName}</strong>
                  <span className={`inventory-item__meta ${fractionTheme}-text`}>
                    {item.type || item.genus || item.category || "Gegenstand"}
                  </span>
                </span>
                <span className="inventory-item__amount" aria-hidden="true">
                  ×{amount}
                </span>
                <span className="inventory-item__details">
                <span className="inventory-item__detail">
                  <span className="inventory-item__detail-label">Gattung</span>
                  <span>{item.genus || "—"}</span>
                </span>
                <span className="inventory-item__detail">
                  <span className="inventory-item__detail-label">Gewicht</span>
                  <span>{item.weight ?? "—"}</span>
                </span>
                <span className="inventory-item__detail">
                  <span className="inventory-item__detail-label">Wert</span>
                  <span>{item.value ?? item.price ?? "—"}</span>
                </span>
                </span>
              </>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export default Slot;
