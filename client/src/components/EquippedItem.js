import React, {useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button'
import Figure from 'react-bootstrap/Figure';
import {useSelector, useDispatch} from 'react-redux';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
function EquippedItem(props) {
  const {player, equipped, } = useSelector((state)=>state.player)
  if(equipped && player){
    const i = player &&  equipped?.findIndex(el=>el.category===props.category)
    const eqId = equipped[i]?.equipment
    const id = player?.inventory?.findIndex(el=>el._id===eqId)
    //console.log(player?.inventory[player?.inventory.findIndex(el=>el._id===equipped[id?.equipment])])
    if(id>=0){
      const equipment = player?.inventory[id]
      const {item, enchantment} = equipment
      const place = ["Kopf", "Rücken", "Brust", "Haupthand", "Beine", "Füße"].includes(equipment?.item.genus) ? "left" : "right"
      const fullInfo = (
        equipment &&
        <Popover id="full">
          <Popover.Header bg="success">{item.name}</Popover.Header>
          <Popover.Body>
            <ListGroup>
              {equipment.bonuses && <ListGroup.Item>{item?.bonuses && `Boni: ${item.bonuses}`}</ListGroup.Item>}
              {enchantment?.bonuses && <ListGroup.Item>{`Verzauberung:  ${enchantment.bonuses}`}</ListGroup.Item>}
              {equipment.dice &&<ListGroup.Item>{item?.dice &&`Widerstand: ${item.dice}`}</ListGroup.Item>}
              {item.dice && <ListGroup.Item>{`${item.category === "Waffe" ? "Schaden" : "Widerstand"}: ${item.dice}`}</ListGroup.Item> }
              <ListGroup.Item>{item?.value  &&`Rütungswert: ${item.value}`}</ListGroup.Item>
              <ListGroup.Item>{item?.weight &&`Gewicht: ${item.weight}`}</ListGroup.Item>
            </ListGroup>
          </Popover.Body>
        </Popover>
      )
      return (
        <>
    <OverlayTrigger trigger="click" placement={place} overlay={fullInfo}>
        <Button variant="light" >
          <Image className='mb-0' src={`/icons/${enchantment?.rarity ? enchantment.rarity : item.rarity}/${item.genus}xhdpi.png`}></Image>
        </Button>
    </OverlayTrigger>
    </>
    )
      
    } else return <Figure><Figure.Image src={`/icons/Undefinedxhdpi.png`}/></Figure>
  } else return (<h6>is Loading..</h6>)

}

export default EquippedItem