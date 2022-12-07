import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import {setAttr, countTotal} from '../features/creation/creationSlice'
import {allAttributes} from '../components/ConstVariables';
function Attributes() {
  const keys = Object.keys(allAttributes)
  const [attr, setAttribute] = useState({strength: 0, dexterity:0, intelligent:0, vitality:0,stamina:0,charisma:0, mana:0, spirit: 0})
  const {attrTotal} = useSelector((state)=>state.creation)
  const dispatch = useDispatch()
  // updating used points
  useEffect(() => {
    dispatch(countTotal())
    //setPointsLeft(MAX - sumofAttr)

}, [attr]) 

  const onChange = (e) => {
    if(e.target.value){
      setAttribute((prev) =>({
          ...prev,
          [e.target.name]: parseInt(e.target.value)
      }
      ))
      const name = e.target.name
      const value = e.target.value
      console.log(name, value)
      dispatch(setAttr({name, value}))
      console.log(`is valid ${e.target.value}`)
    }else {
      console.log(`is not valid ${e.target.value}`)
    }
  }

  return (
    <Container>
        <h4>Attribute {`(${attrTotal})`}</h4>
        
          {
            keys.map((key)=>(
              <Form.Group controlId={key} key={key}>
                <Form.Label>{allAttributes[key]}</Form.Label>
                <Form.Control type="number" name={key} onChange={onChange}></Form.Control>
              </Form.Group>
            ))
          }       

    </Container>
  )
}

export default Attributes