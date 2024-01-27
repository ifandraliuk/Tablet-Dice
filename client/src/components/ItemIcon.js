import React from "react";
import { itemNames } from "../data/ConstVariables";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

function ItemIcon({ animationDelay, item, specialAmount, enchantment, large }) {
  const itemInfo = item?.item ?? item;
  const { genus, category, rarity } = itemInfo ?? {};
  const amount = item?.amount;

  if (!genus || !category || !rarity) {
    // Handle the case where essential properties are undefined
    return <FontAwesomeIcon icon={faX} />;
  }

  const rarityColor = enchantment?.rarity
    ? itemNames?.rarity[enchantment.rarity]
    : itemNames?.rarity[rarity];

  const genusName = itemNames?.genus[genus];
  const categoryName = itemNames?.category[category];
  let iconSrc = `/color_icons/${categoryName}/${genusName}/${itemInfo?._id}.svg`;

  const handleImageError = (event) => {
    event.target.src = `/color_icons/${categoryName}/${genusName}/${genusName}.svg`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.3, delay: Math.random() },
      }}
      className={
        large ? `large-icon  ${rarityColor}-bg` : `small-icon ${rarityColor}-bg`
      }
    >
      <motion.div
        initial={{ y: -5 }}
        animate={{
          y: 0,
          transition: { duration: 0.5, delay: Math.random() + 0.2 },
        }}
        className="badge-container"
      >
        <div className="number-badge">
          {specialAmount ? specialAmount : amount}
        </div>
      </motion.div>
      <motion.img
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          transition: { duration: 1, delay: Math.random() + 0.3 },
        }}
        alt="icon"
        name={itemInfo?._id}
        src={iconSrc}
        onError={handleImageError}
        className="icon-image"
      />
    </motion.div>
  );
}

export default ItemIcon;
