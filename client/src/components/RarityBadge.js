import React from "react";
import { itemNames } from "../data/ConstVariables";

export default function RarityBadge({ rarity }) {
  const rarityColor = itemNames?.rarity?.[rarity] || "common";
  return <span className={`extended-info-rarity ${rarityColor}`}>{rarity}</span>;
}
