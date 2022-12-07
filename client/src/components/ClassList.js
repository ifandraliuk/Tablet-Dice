import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandFist,} from '@fortawesome/free-solid-svg-icons'
import { Button, Container } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {decreaseBar} from '../features/player/playerSlice'
import {useSelector, useDispatch} from 'react-redux';



function ClassList() {
  const {player} = useSelector((state)=>state.player)
  const abilities = player?.userclass.abilities
  const spec=[]
  const counts = {};
    // count the amount of cards for each specialization
    Object.keys(abilities).map((ind) => {
      return spec.push(abilities[ind].specialization)})
    spec.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });  

  const dispatch = useDispatch()

  const useAbility = e => {
    const abilityIndex = e.target.name
    const category = abilities[abilityIndex]?.type
    const value = abilities[abilityIndex]?.price
    dispatch(decreaseBar({category,value}))
  }
  return (
    <Container>
        <Tabs justify>
          {Object.keys(counts).map((el)=>(
            <Tab eventKey={el} title={el} key={el}>
              <Row className="mt-3 mb-2">
                {Object.keys(abilities).map((ind)=>{                
                  return abilities[ind].specialization === el && (            
                <Col className={counts[el] > 3 ? 'col-md-3 col-12': 'col-md-4 col-12'} key={abilities[ind].name}>
                  <Card className='h-100' >
                    <Card.Header as="h6">{abilities[ind].name}</Card.Header>
                    <Card.Body className="d-flex-column">
                      <Row className="border-bottom p-2">{abilities[ind].description}</Row>
                      <Row className=""><Col><FontAwesomeIcon icon={faHandFist} /> {`${abilities[ind].price} ${abilities[ind].type}`}</Col><Col></Col></Row>
                      <Row className="justify-content-end"><Button size="sm" variant="outline-dark" name={ind} onClick={useAbility}>Verwenden</Button></Row>
                    </Card.Body>    
                  </Card>
                </Col>
                )})}
            </Row>
            </Tab>
          ))}        
        </Tabs>
    </Container>
  )
}

export default ClassList