import React from "react";
import { motion } from "framer-motion";
import ItemIcon from "../../components/ItemIcon";

function EquippedItem({ equippedItem, setShowInfo, delayValue, category }) {
      const {_id, item, enchantment} = equippedItem
      return (
        <motion.button
        type="button"
        className="inventory-equipment__item-button"
        id={_id}
        aria-label={`${category}: ${item?.name ?? "Gegenstand"}. Details öffnen`}
        title={`${category}: ${item?.name ?? "Gegenstand"}`}
          initial={{ translateY: -90 }}
          animate={{ translateY: 0 }}
          transition={{
            duration: 2,
            type: "spring",
            bounce: 0.5,
            delay: delayValue ? delayValue * 0.1 : 0.1,
          }}
          whileHover={{ scale: 0.9, duration: 0.2 }}
          whileTap={{ scale: [0.8, 0.9, 1] }}
          onClick={(e) => setShowInfo(e.currentTarget?.id)}
        >
          <ItemIcon
            animationDelay={delayValue * 0.1}
            key={`img-${item?._id}`}
            item={item}
            enchantment={enchantment}
          />
        </motion.button>
      );
    
}

export default EquippedItem;
