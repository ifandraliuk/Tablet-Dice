import React from 'react'
import {useSelector} from 'react-redux';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import {itemNames} from '../../data/ConstVariables';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faRectangleXmark} from '@fortawesome/free-solid-svg-icons'
function EquippedItem({category}) {
  const {player, equipped, } = useSelector((state)=>state.player)
  const {genus, rarity} = itemNames

  if(equipped && player){
    const i = player &&  equipped?.findIndex(el=>el.category===category)
    const eqId = equipped[i]?.equipment
    const id = player?.inventory?.findIndex(el=>el._id===eqId)
    //console.log(player?.inventory[player?.inventory.findIndex(el=>el._id===equipped[id?.equipment])])
    if(id>=0){
      const equipment = player?.inventory[id]
      const {item, enchantment} = equipment
      const place = ["Kopf", "Rücken", "Brust", "Haupthand", "Beine", "Füße"].includes(equipment?.item.genus) ? "left" : "right"
      const r = enchantment?.rarity ? rarity[enchantment.rarity] : rarity[item.rarity]
      const g = genus[item.genus]
      const fullInfo = (
        equipment &&
        <Popover id="full">
          <Popover.Header bg="success">{item.name}</Popover.Header>
          <Popover.Body>
            <ListGroup>
              {item.bonuses && <ListGroup.Item>{item?.bonuses && `Boni: ${item.bonuses}`}</ListGroup.Item>}
              {enchantment?.bonuses && <ListGroup.Item>{`Verzauberung:  ${enchantment.bonuses}`}</ListGroup.Item>}
              {equipment.dice &&<ListGroup.Item>{item?.dice &&`Widerstand: ${item.dice}`}</ListGroup.Item>}
              {item.dice && <ListGroup.Item>{`${item.category === "Waffe" ? "Schaden" : "Widerstand"}: ${item.dice}`}</ListGroup.Item> }
              <ListGroup.Item>{`${item.category === "Waffe" ?  "Reichweite" : "Rütungswert"}: ${item.value}`}</ListGroup.Item>
              <ListGroup.Item>{item?.weight &&`Gewicht: ${item.weight}`}</ListGroup.Item>
            </ListGroup>
          </Popover.Body>
        </Popover>
      )
      return (
        <>
    <OverlayTrigger trigger="click" placement={place} overlay={fullInfo}>
        <button className="items-btn" >
          <Image className='mb-0' src={`/icons/${r}/${g}xhdpi.png`}></Image>
        </button>
    </OverlayTrigger>
    </>
    )
      
    } else return <div className="align-items-center col-3"><FontAwesomeIcon icon={faRectangleXmark}/></div>
  } else return (<h6>is Loading..</h6>)

}

export default EquippedItem