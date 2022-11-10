import React, {useState} from 'react'
import Button from 'react-bootstrap/Button'
import Figure from 'react-bootstrap/Figure';
import Collapse from 'react-bootstrap/Collapse';
import ListGroup from 'react-bootstrap/ListGroup';
function EquippedItem({equipment}) {
    const [toExpand, setExpand] = useState(false)
    console.log(equipment)
  return (
    <>
    {equipment?.name ? 
    (
    <>
        <Button  aria-controls={`${equipment.genus}-info`} aria-expanded={toExpand} variant="light" onClick={()=>setExpand(toExpand => !toExpand)}>
        <Figure ><Figure.Image className='mb-0' src={`/icons/${equipment.genus}xhdpi.png`}/></Figure>
        </Button>
        <Collapse in={toExpand}>
            <ListGroup id={`${equipment.genus}-info`}>
            <ListGroup.Item>{equipment.name}</ListGroup.Item>
            </ListGroup>
        </Collapse>
    </>
    ):(<><Figure><Figure.Image  className='mb-0' src="/icons/undefinedxhdpi.png"></Figure.Image></Figure></>)}


    </>
    
  )
}

export default EquippedItem