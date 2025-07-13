import React from "react";
import ItemIcon from "../../components/ItemIcon";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
function Slot({ modus, setCustomInfo, filter, setShowInfo }) {
  const inventory = useSelector((state) => state.inventory.inventory);
  const items = useSelector((state) => state.items.data);
  const filteredData = useSelector((state) => state.items.filteredData);
  const { fractionTheme } = useSelector((state) => state.player);
  const data = modus ? items : inventory;

  if (data?.length > 0) {
    return (
      <motion.div className="row bag-div" key="inv">
        {data?.map((item, i) => {
          let showItem = true;
          if (filter && filter !== "all") {
            showItem = item.item?.category === filter;
          }
          if(modus && filteredData?.length>0){
            showItem = filteredData.findIndex(filteredItem=>filteredItem._id === item._id) >= 0 ? true : false
          }
          return (
            showItem &&
            item.status !== "Ausgerüstet" && (
                <>
                {modus ? (
                  <motion.div
                    layout
                    key={item._id}
                    className="mb-1 slot-element"
                    id={item?._id}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      delay: i * 1,
                      transition: { duration: 0.3 },
                    }}
                    whileHover={{ scale: 0.9, duration: 0.2 }}
                    whileTap={{ scale: [0.8, 0.9, 1] }}
                    onClick={(e) => {
                      setShowInfo(e.currentTarget.id);
                      if (setCustomInfo) {
                        setCustomInfo(item);
                        console.log(item);
                      }
                    }}
                  >
                    <div className="row">
                      <div className="col-auto">
                        <ItemIcon
                          animationDelay={i * 0.1}
                          key={`img-${item._id}`}
                          item={item}
                          enchantment={item.enchantment}
                        />
                      </div>
                      <div className="col-8">
                        <h2>{item.name}</h2>
                        <p>Typ: <strong className={`${fractionTheme}-text`}>{item.type}</strong></p>
                        </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    layout
                    key={item._id}
                    className="col-auto mb-1 slot-element"
                    id={item?._id}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      delay: i * 1,
                      transition: { duration: 0.3 },
                    }}
                    whileHover={{ scale: 0.9, duration: 0.2 }}
                    whileTap={{ scale: [0.8, 0.9, 1] }}
                    onClick={(e) => {
                      setShowInfo(e.currentTarget.id);
                      if (setCustomInfo) {
                        setCustomInfo(item);
                        console.log(item);
                      }
                    }}
                  >
                    <ItemIcon
                      animationDelay={i * 0.1}
                      key={`img-${item._id}`}
                      item={item}
                      enchantment={item.enchantment}
                    />
                  </motion.div>
                )}
              </>
            )
          );
        })}
      </motion.div>
    );
  } else {
    if (modus) {
      return <div className="alert info">Wähle eine der Kategorien</div>;
    } else
      return (
        <div className="alert info">
          Mit + kannst du was in dein Inventar packen!
        </div>
      );
  }
}

export default Slot;
