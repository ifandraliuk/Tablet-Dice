import React from 'react'

function Info(props) {
  const {item, enchantment} = props
  const {genus, type, set, price, bonuses, rarity, dice, category, value, weight, material} = item 
  return (
    <ul  style={{textAlign:"left", border:"solid 1px", listStylePosition:"inside"}}>
      <li >{`Kategorie: `} <strong>{props.item.category}</strong></li>
      <li>{`Gattung: `}<strong>{genus}</strong></li>
      <li>{`Typ: `}<strong>{type}</strong></li>
      {set && <li>{`Set: `}<strong>{set}</strong></li>}
      <li>{`Preis: `}<strong>{price}</strong></li>
      {bonuses && <li>{`Boni: `}<strong>{bonuses}</strong></li>}
 {enchantment && <li>{`Verzauberung: `}<strong>{enchantment.bonuses}</strong></li>}
 <li>{`Wertigkeit: `}<strong>{enchantment? enchantment.rarity : rarity}</strong></li>
{dice && <li>{`${category === "Waffe" ? "Schaden" : "Widerstand"}: `}<strong>{dice}</strong></li> }
<li>{`${category === "Waffe" ?  "Reichweite" : "Rütungswert"}: `}<strong>{value}</strong></li>
<li>{`Gewicht: `}<strong>{weight}</strong></li>
<li>{`Material: `}<strong>{material}</strong></li>
    </ul>
  )
}

export default Info