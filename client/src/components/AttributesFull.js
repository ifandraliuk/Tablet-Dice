import React, {useMemo} from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup'
import {useSelector} from 'react-redux';
import {allAttributes} from '../components/ConstVariables';
function AttributesFull() {
  const {player} = useSelector((state)=>state.player)
  const {attributes} = player
  const keys = Object.keys(allAttributes)
  const pointsUsed = useMemo(() => {
    let out = 0
    keys.forEach((key)=> (
       out = out + attributes[key]
    ))
    return out
  }, [attributes])
  const diff = player?.pointsLeft - pointsUsed
  if(diff === 0){
    return (
      <Container className='border-bottom border-top border-dark'>
      <h4>Attribute</h4>
      <ListGroup className="m-2">
      {keys.map((key)=>(
        <ListGroup.Item key = {key} name={allAttributes[key]}>{`${allAttributes[key]}: ${attributes[key]}`}</ListGroup.Item>
              ))
            }
          </ListGroup>
      </Container>
    
    )
  } else {
    return (
      <Container className='border-bottom border-top border-dark'>
      <Form>
      <h4>{`Attribute (${diff})`}</h4>
      <ListGroup>
      {keys.map((key)=>(
         <ListGroup.Item key={key}>{`${allAttributes[key]}: `}<Form.Control id={key} name={allAttributes[key]} type="number"  defaultValue={attributes[key]}></Form.Control></ListGroup.Item>
              ))
            }
            </ListGroup>
          </Form>
      </Container>
      
    )
  }

}

export default AttributesFull