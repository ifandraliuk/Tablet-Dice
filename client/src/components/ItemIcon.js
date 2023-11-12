import React from "react";
import { itemNames } from "../data/ConstVariables";

function ItemIcon({ item, enchantment }) {
  const { _id, genus, category, rarity } = item;

  const rarityColor = enchantment?.rarity
    ? itemNames?.rarity[enchantment.rarity]
    : itemNames?.rarity[rarity];
  return (
   <div>
      {genus &&
      (genus === "Schwert" ||
        genus === "Axt" ||
        genus === "Dolch" ||
        genus === "Bogen" ||
        genus === "Ausrüstung" ||
        genus === "Wurfwaffe" ||
        genus === "Armbrust" ||
        category === "Begleiter" ||
        genus === "Zauberstab") ? (
        <div className={`icon-box ${rarityColor}-bg`}>
          <img
            alt="icon"
            name={_id}
            src={`/color_icons/${itemNames?.category[category]}/${itemNames?.genus[genus]}/${_id}.svg`}
          />{" "}
        </div>
      ) : (
        <img
          alt="icon"
          name={_id}
          src={`/icons/${rarityColor}/${itemNames?.genus[genus]}xhdpi.png`}
        />
      )}
   </div>
  );
}

export default ItemIcon;
