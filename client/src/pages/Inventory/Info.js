import React from "react";
import {  motion } from "framer-motion";


function Info(props) {
  
  const { item, enchantment } = props;
  const {
    _id,
    genus,
    type,
    set,
    price,
    bonuses,
    rarity,
    dice,
    category,
    value,
    weight,
    material,
  } = item;
  return (
    <motion.ul
      exit={{
        scale: 0, 
        delay: 2,
        duration: 0.5,
      }}
    >
            <li>
        {`ID: `} <strong>{_id}</strong>
      </li>
      <li>
        {`Kategorie: `} <strong>{category}</strong>
      </li>
      <li>
        {`Gattung: `}
        <strong>{genus}</strong>
      </li>
      <li>
        {`Typ: `}
        <strong>{type}</strong>
      </li>
      {set && (
        <li>
          {`Set: `}
          <strong>{set}</strong>
        </li>
      )}
      <li>
        {`Preis: `}
        <strong>{price}</strong>
      </li>
      {bonuses && (
        <li>
          {`Boni: `}
          <strong>{bonuses}</strong>
        </li>
      )}
      {enchantment && (
        <li>
          {`Verzauberung: `}
          <strong>{enchantment?.bonuses}</strong>
        </li>
      )}
      <li>
        {`Wertigkeit: `}
        <strong>{enchantment ? enchantment?.rarity : rarity}</strong>
      </li>
      {dice && (
        <li>
          {`${category === "Waffe" ? "Schaden" : "Widerstand"}: `}
          <strong>{dice}</strong>
        </li>
      )}
      <li>
        {`${category === "Waffe" ? "Reichweite" : "Rütungswert"}: `}
        <strong>{value}</strong>
      </li>
      <li>
        {`Gewicht: `}
        <strong>{weight}</strong>
      </li>
      <li>
        {`Material: `}
        {typeof(material)==="String" ? 
        (
          <strong>{material}</strong>
        )  : 
        (
          <ul>
          {material?.map((m)=>(
            <li key={m._id}>{m.element?.name}: <strong>{m?.amount}</strong></li>
          ))}
        </ul>
        )
      }

      </li>
    </motion.ul>
  );
}

export default Info;
