import React, {useState, useMemo, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  {faPlus } from '@fortawesome/free-solid-svg-icons'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup'
import {useSelector, useDispatch} from 'react-redux';
import {allAttributes} from '../components/ConstVariables';
import { updateAttribute } from '../features/player/playerSlice';

function AttributesFull() {
  console.log("im component")
  const {player, pointsLeft} = useSelector((state)=>state.player)
  const {attributes} = player
  const [difference, setDifference] = useState(0)
  const dispatch = useDispatch()
  const keys = Object.keys(allAttributes)
  useEffect(()=>{
    console.log("new level!")
    console.log("counting points used...")
    let out = 0 
    keys.forEach((key)=> (
      out = out + attributes[key]
   ))
   console.log(`points used: ${out}, difference: ${player?.pointsLeft - out}, points left by user: ${player?.pointsLeft}`)
   const diff = player?.pointsLeft - out 
   console.log("new difference:", diff)
   setDifference(diff)
  }, [player?.pointsLeft, attributes])
   console.log(player?.pointsLeft, difference)
   const onClick = e => {
    dispatch(updateAttribute(e.currentTarget.id))
    
   }
    return (
      <Container className='border-bottom border-top border-dark'>
        <Row style={{textTransform:"uppercase", fontSize:"50px", letterSpacing:"7px"}}>{difference!==0 ? <h3>{`Du hast freie Attributspunkte: ${difference}`}</h3> : <h3>Attribute</h3>}</Row>
      
      <ListGroup className="m-2 d-flex" style={{backgroundColor:"black"}}>
      {keys.map((key)=>(
        <ListGroup.Item key={key} name={allAttributes[key]}>{`${allAttributes[key]}: ${attributes[key]}`}
        {difference!==0 && <Button id={key} className="" onClick={onClick}><FontAwesomeIcon icon={faPlus}/></Button>}
      
        </ListGroup.Item>
              ))
            }
          </ListGroup>
      </Container>
    
    )
}

export default AttributesFull