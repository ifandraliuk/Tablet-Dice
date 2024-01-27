import React from "react";
import ItemIcon from "../../components/ItemIcon";
import {  useSelector } from "react-redux";
import {  motion } from "framer-motion";
function Slot({ modus, setCustomInfo, filter, setShowInfo }) {
  const inventory = useSelector((state) =>
  state.inventoryPage.inventory
);
const items =  useSelector((state) =>
state.items.data
);
const data = modus ? items : inventory
  if(data?.length> 0){
    return (
    <motion.div className="row bag-div" key="inv" >
      {data?.map(
        (item, i) =>{
          let showItem = true
          if(filter && filter!=="all"){
              showItem = item.item.category === filter 
          }
         return showItem && item.status!=="Ausgerüstet" && (
            <motion.div
              layout
              key={item._id}
              className="col-auto mb-1"
              id={item?._id}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                delay: i * 1,
                transition: { duration: 0.3},
              }}
              whileHover={{ scale: 0.9, duration: 0.2 }}
              whileTap={{ scale: [0.8, 0.9, 1] }}
              onClick={(e) => {setShowInfo(e.currentTarget.id);if(setCustomInfo) {setCustomInfo(item); console.log(item)}} }
            >
              <ItemIcon
                animationDelay={i * 0.1}
                key={`img-${item._id}`}
                item={item}
                enchantment={item.enchantment}
              />
              {modus && item.name}
            </motion.div>
          
         )})}
    </motion.div>
  );} else {
    if(modus){
     return <div className="alert info">Wähle eine der Kategorien</div>
    } else 
    return(
      <div className="alert info">Mit + kannst du was in dein Inventar packen!</div>
    )
  }
}

export default Slot;
