import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faRefresh} from '@fortawesome/free-solid-svg-icons'
import Container from 'react-bootstrap/Container'

import Bar from './Bar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useSelector, useDispatch} from 'react-redux';
import {decreaseBar, increaseBar, resetBars} from '../../features/player/playerSlice'
import {germanAttr} from '../../data/ConstVariables';


function BarList() {
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
    <Container className='mt-2'>
      {bar.map((name, i)=>(
        attributes && attributes[name]>0 && <Bar category={name} key={name}/>
      ))}
   
      <Row className="mb-2 mt-2">
        <Col className="col-auto pe-0">
        
          <select className="text-capitalize" value={damage.type} name="type"  onChange={onChange}>
            {bar.map((name)=>(
              attributes && attributes[name]>0 && <option id={name} key={name}>{germanAttr[name]}</option>
            ))}
            </select>

          </Col>
        <Col className="col-auto">
          <input type="number" value={damage.val} name="val" onChange={onChange}></input>
        </Col>
        <Col>
          <div className='button-group'>
            <button id="increase" className='btn-save' onClick={add}><FontAwesomeIcon icon={faPlus}/></button>
            <button id="decrease"  className='btn-edit' onClick={subtract}><FontAwesomeIcon icon={faMinus}/></button>
            <button className='btn-remove' onClick={onReset}><FontAwesomeIcon icon={faRefresh}/></button>
          </div>
        </Col>
      </Row>


    </Container>
  )
}

export default BarList