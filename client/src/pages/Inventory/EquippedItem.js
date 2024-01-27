import React from "react";
import { motion } from "framer-motion";
import ItemIcon from "../../components/ItemIcon";

function EquippedItem({ equippedItem, setShowInfo, delayValue }) {
      const {_id, item, enchantment} = equippedItem
      return (
        <motion.div
        id={_id}
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
        </motion.div>
      );
    
}

export default EquippedItem;
