import React from "react";
import { itemNames } from "../data/ConstVariables";
import { motion } from "framer-motion";

function ItemIcon({ animationDelay, item, specialAmount, enchantment, large, isEmpty }) {
  const itemInfo = item?.item ?? item;
  const { genus, category, rarity } = itemInfo ?? {};
  const amount = item?.amount;

  const rarityColor = enchantment?.rarity
    ? itemNames?.rarity[enchantment.rarity]
    : itemNames?.rarity[rarity]
      ? itemNames?.rarity[rarity]
      : "common";

  const genusName = itemNames?.genus[genus];
  const categoryName = itemNames?.category[category];
  const iconSrc = isEmpty
    ? `/color_icons/empty.svg`
    : `/color_icons/${categoryName}/${genusName}/${itemInfo?._id}.svg`;

  const size = large ? 72 : 42;

  const handleImageError = (event) => {
    event.target.src = `/color_icons/${categoryName}/${genusName}/${genusName}.svg`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: Math.random() } }}
      className={large ? `large-icon ${rarityColor}-bg` : `small-icon ${rarityColor}-bg`}
      style={{
        width: size,
        height: size,
        aspectRatio: "1 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {amount && (
        <motion.div
          initial={{ y: -5 }}
          animate={{ y: 0, transition: { duration: 0.5, delay: Math.random() + 0.2 } }}
          className="badge-container"
        >
          <div className="number-badge">{specialAmount ? specialAmount : amount}</div>
        </motion.div>
      )}

      <motion.img
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { duration: 1, delay: Math.random() + 0.3 } }}
        alt="icon"
        name={itemInfo?._id}
        src={iconSrc}
        onError={handleImageError}
        className="icon-image"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}

export default ItemIcon;
