import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup';

function InfoListComponent(props) {
  return (
    <ListGroup variant="flush">
    <ListGroup.Item>{`Kategorie: ${props.item.category}`}</ListGroup.Item>
    <ListGroup.Item>{`Gattung: ${props.item.genus}`}</ListGroup.Item>
    <ListGroup.Item>{`Typ: ${props.item.type}`}</ListGroup.Item>
     <ListGroup.Item>{`Preis: ${props.item.price}`}</ListGroup.Item>
     {props.item.bonuses && <ListGroup.Item>{`Boni: ${props.item.bonuses}`}</ListGroup.Item>}
     {props.enchantment && <ListGroup.Item>{`Verzauberung: ${props.enchantment.bonuses}`}</ListGroup.Item>}
     <ListGroup.Item>{`Wertigkeit: ${props.enchantment? props.enchantment.rarity : props.item.rarity}`}</ListGroup.Item>
    {props.item.dice && <ListGroup.Item>{`${props.item.category === "Waffe" ? "Schaden" : "Widerstand"}: ${props.item.dice}`}</ListGroup.Item> }
    <ListGroup.Item>{`${props.item.category === "Waffe" ?  "Reichweite" : "Rütungswert"}: ${props.item.value}`}</ListGroup.Item>
    <ListGroup.Item>{`Gewicht: ${props.item.weight}`}</ListGroup.Item>
  </ListGroup>
  )
}

export default InfoListComponent