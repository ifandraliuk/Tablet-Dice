import React, { useEffect } from 'react';
import { Container, Spinner, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GeneralItem from '../components/GeneralItem';
import GeneralFull from '../components/GeneralFull';
import AttributesFull from '../components/AttributesFull';
import Attributes from '../components/Attributes';
import NavbarComp from '../components/Navbar';
import { getPlayer } from '../features/player/playerSlice';
import {logout, reset} from '../features/auth/AuthSlice'
import ClassList from '../components/ClassList';
import ChooseClass from '../components/ChooseClass';
import TalentsList from '../components/TalentsList';

function ShowPlayer() {
  const {user, isLoading, isError, message} = useSelector((state)=>state.auth)
  const {player} = useSelector((state)=>state.player)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(()=> {
    if(!user) {
      navigate("/")
    }
    if(isError){
      console.log(message)
      dispatch(logout())
    }
    if(player.isError){
      dispatch(logout())
    }
    dispatch(getPlayer())
     return () => {
      dispatch(reset())
    } 
  }, [user, player.isError, navigate, isError, dispatch, message])

  if(isLoading || player.isLoading) {
    return <Spinner animation="border"/>
  }

  return (
    <Container fluid>
      <NavbarComp />
      <Row className="m-1" >
        <Col className="col-md-3 col-12">
          <Row className=""><Image fluid src="rogue-f.jpg"></Image></Row>
        </Col>
        <Col className="col-12 col-md-9 ">{
          player && player.userclass ? (<><ClassList userclass={player.userclass} attr={player.attributes}/></>) : (<ChooseClass/>)}
        </Col>
      </Row>
    {/**<Row className="">{player && player.attributes && <Bars attr={player.attributes}/>}</Row>**/}
    <Row>
      <Col xxl={3}>{player && player.attributes ? (<AttributesFull attr={player.attributes}/>): (<Attributes/>) }</Col>
     {player.talents &&  <Col><TalentsList props={player.talents}/></Col>}
      </Row>
    <Row className="m-2">
      <Col className="bg-light">Waffen</Col>
      <Col>Talente</Col>
    </Row>
    <Row className="m-2">
      <Col>Ausgerüstete Gegenstände</Col>
      <Col>Inventar</Col>
    </Row>
    <Row>{player && player.general ? (<GeneralFull general={player.general}/>
    
    ) : (<GeneralItem/>)}</Row>
    
  </Container>
  )
}

export default ShowPlayer