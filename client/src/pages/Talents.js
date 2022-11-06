import React, {useEffect, useState} from 'react'
import NavbarComp from '../components/Navbar'
import { Button, Container, Spinner, } from 'react-bootstrap'
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTalent, reset } from '../features/talent/talentSlice';
import { putTalent } from '../features/player/playerSlice';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import TalentsList from '../components/TalentsList';

function Talents() {
  const {user} = useSelector((state)=>state.auth)
  const {player} = useSelector((state)=>state.player)
  const {talent, isLoading, isError, message} = useSelector((state)=>state.talents)
  const [update, toUpdate] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const categories = []
  const els = {}
  //find all categories from dB
  Object.keys(talent).map((ind) => {
    return categories.push(talent[ind].category)})  
  // count amount of els in each category
  categories.forEach(function (x) { els[x] = (els[x] || 0) + 1; }); 
  const sorted = Object.fromEntries(
    Object.entries(els).sort(([,a],[,b]) => parseInt(b)-parseInt(a))
);
  useEffect(()=> {
    if(!user) {
      navigate("/")
    }
    if(isError){
      console.log(message)
    }
    dispatch(getTalent())
    // Dismount general info
     return () => {
      dispatch(reset())
    } 
  }, [user, navigate, isError, dispatch, message])


  const handleChange = (e) => {
    console.log(e.target.value, e.target.name)
    let el = [e.target.name, parseInt(e.target.value)]
    let flag = false
    if(update.length > 0 && el[1] > 0){
        toUpdate(update.map((val)=>{
          if(val[0] === el[0]){
            flag = true
          }
          return flag ? el : val
        }))
      if(!flag){
        toUpdate([...update, el])
      }
    } else {
      toUpdate([...update, el])
    }

  }

  const handleSubmit = (e) => {
    e.preventDefault()
    update.forEach((el, i)=>{
      dispatch(putTalent({"name": el[0], "point": el[1]}))
    })
  }

  if(isLoading){
    return <Spinner animation="border"/>
  }
  return (
    <Container fluid>
        <NavbarComp/>
        {update}
        <Row>
          {player.talents ? (
            <TalentsList props={player.talents}/>
          ) : (<>Du hast noch keine Talente...</>)}
        </Row>
        <Form>
          <h5>Alle Tallente</h5>
          <Button variant="dark" type="submit" onClick={handleSubmit}>Speichern</Button>
        <Row>    
          {Object.keys(sorted).map((el)=>(
            <Col className="col-md-4 col-12" key={el}>
              <Table striped>
                <thead>
                  <tr>
                    <th>{el}</th>
                    <th>Würfel</th>
                    <th>Werte</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(talent).map((ind)=>{
                    return talent[ind].category === el && (
                  <tr key={ind}>
                    <td>{talent[ind].name}</td>
                    <td>{talent[ind].dice}</td>
                    <td> <Form.Control name={talent[ind].name} type="number" placeholder="0" onChange={handleChange}/></td>
                  </tr>
                  )})}
                </tbody>
              </Table>
              </Col>
          ))}
        </Row>
        </Form>
    </Container>
    
  )
}

export default Talents