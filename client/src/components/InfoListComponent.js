import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup';

function InfoListComponent(props) {
  const {item, enchantment} = props
  const {genus, type, set, price, bonuses, rarity, dice, category, value, weight, material} = item 
  return (
    <ul  style={{textAlign:"left", border:"solid 1px", listStylePosition:"inside"}}>
      <li >{`Kategorie: ${props.item.category}`}</li>
      <li>{`Gattung: ${genus}`}</li>
      <li>{`Typ: ${type}`}</li>
      {set && <li>{`Set: ${set}`}</li>}
      <li>{`Preis: ${price}`}</li>
      {bonuses && <li>{`Boni: ${bonuses}`}</li>}
 {enchantment && <li>{`Verzauberung: ${enchantment.bonuses}`}</li>}
 <li>{`Wertigkeit: ${enchantment? enchantment.rarity : rarity}`}</li>
{dice && <li>{`${category === "Waffe" ? "Schaden" : "Widerstand"}: ${dice}`}</li> }
<li>{`${category === "Waffe" ?  "Reichweite" : "Rütungswert"}: ${value}`}</li>
<li>{`Gewicht: ${weight}`}</li>
<li>{`Material: ${material}`}</li>
    </ul>
  )
}

export default InfoListComponent