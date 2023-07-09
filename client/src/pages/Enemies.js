import React, {useState} from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { ListGroup } from 'react-bootstrap';
import CloseButton from 'react-bootstrap/CloseButton';
function Gegner() {
  const [count, setCount] = useState(0)
  let arr = Array(count).fill('Gegner')
  const onClick = e => {
    setCount(prev=>prev+1)
    console.log(count)
  }

  return (
    <Container fluid>

      <Button type="submit" onClick={onClick}>Hinzufügen</Button>
      <ListGroup>
      {arr.map((el, i)=>(
        <ListGroup.Item key={i}>
          {i+1}
          <Form.Group id={i} name="hp">
            <Form.Label>Leben</Form.Label>
            <Form.Control></Form.Control>
          </Form.Group>
          <Form.Group name="damage">
            <Form.Label>Schaden</Form.Label>
            <Form.Control></Form.Control>
          </Form.Group>
          <ProgressBar variant="danger" now={100}/>

          <CloseButton name={i}/>
        </ListGroup.Item>
      ))}</ListGroup>
    </Container>
  )
}

export default Gegner