import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faRefresh} from '@fortawesome/free-solid-svg-icons'
import Container from 'react-bootstrap/Container'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Bar from './Bar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useSelector, useDispatch} from 'react-redux';
import {decreaseBar, increaseBar, resetBars} from '../features/player/playerSlice'
import {germanAttr} from './ConstVariables'
function BarListComponent() {
    const {player} = useSelector((state)=>state.player) 
    const dispatch = useDispatch()
    const {attributes} = player
    const [damage, setDamage] = useState({type: 'Vitalität', val: 0})
    const bar = Object.keys(germanAttr)
    
    const add = e => {
      const category = Object.keys(germanAttr).find(el=>germanAttr[el]===damage.type)
      const value = parseInt(damage.val)
      dispatch(increaseBar({category, value}))
    }
    const subtract = e => {
      const category = Object.keys(germanAttr).find(el=>germanAttr[el]===damage.type)
      const value = parseInt(damage.val)
      dispatch(decreaseBar({category, value}))
    }
    const onChange = e => {
        setDamage((prev)=> ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const onReset = e => {
        dispatch(resetBars())
    }
  return (
    <Container>
    <Form >
    <Form.Label as="h6">Werteeingabe</Form.Label>
      <Row className="mb-2">
        <Col>
          <Form.Group>
          <Form.Select className="text-capitalize" value={damage.type} name="type"  onChange={onChange}>
            {bar.map((name)=>(
              attributes && attributes[name]>0 && <option id={name} key={name}>{germanAttr[name]}</option>
            ))}
            </Form.Select>
          </Form.Group>
          </Col>
        <Col>
          <Form.Control type="number" value={damage.val} name="val" onChange={onChange}></Form.Control>
        </Col>
        <Col>
          <ButtonGroup>
            <Button id="increase" variant="secondary"  onClick={add}><FontAwesomeIcon icon={faPlus}/></Button>
            <Button id="decrease" variant="secondary" onClick={subtract}><FontAwesomeIcon icon={faMinus}/></Button>
            <Button variant="outline-secondary" type="reset" onClick={onReset}><FontAwesomeIcon icon={faRefresh}/></Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form>
      {bar.map((name, i)=>(
        attributes && attributes[name]>0 && <Bar category={name} key={name}/>
      ))}
    </Container>
  )
}

export default BarListComponent