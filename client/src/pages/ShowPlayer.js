import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVenus, faMars, faAnglesUp} from '@fortawesome/free-solid-svg-icons'
import { Container, Spinner, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Figure from 'react-bootstrap/Figure'
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GeneralFull from '../components/GeneralFull';
import AttributesFull from '../components/AttributesFull';
import NavbarComp from '../components/Navbar';
import {logout, reset} from '../features/auth/AuthSlice'
import ClassList from '../components/ClassList';
import TalentsList from '../components/TalentsList';
import BarListComponent from '../components/BarListComponent';
import { filterEquipment } from '../features/player/playerSlice';
import EquippedItem from '../components/EquippedItem';
function ShowPlayer() {
  const {user, registered, isLoading, isError, message} = useSelector((state)=>state.auth)
  const {player, equipped} = useSelector((state)=>state.player)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const originName = player?.general?.origin.split(" ")
  useEffect(()=> {
    if(!user) {
      console.log("not user")
      navigate("/")
    }
    if(registered){
      navigate("/register")
    }
    if(isError){
      console.log(message)
      dispatch(logout())
    }
    if(!equipped){
      dispatch(filterEquipment())
    }
    //dispatch(getPlayer())
     return () => {
      dispatch(reset())
    } 
  }, [user, player.isError, navigate, isError, dispatch, message])

  if(isLoading || player.isLoading) {
    return <Spinner animation="border"/>
  }

  return (
    <Container className="g-5" fluid>
      <NavbarComp />
      <Row className="m-1" >
        <Col className="col-md-3 col-12">
          <Row>
            <Col><Image fluid src={`/user/${user?.name}.jpeg`}></Image></Col>
            <Col className="col-4">
              <Figure><Figure.Image src={`/origin/${originName && originName[originName.length-1]}ldpi.png`}/></Figure>
              <Row className="ms-2 border-bottom border-top">
                <h4>{originName && originName[originName.length-1]}</h4></Row>
                <Row>
                <EquippedItem category="Haupthand"/>
                </Row>
                <Row><EquippedItem category="Nebenhand"/></Row>
              </Col>
              <Row className="ms-2 border-bottom">
                <Col className="col-3"><h4>Stufe: {player?.level}</h4></Col><Col><Button><FontAwesomeIcon icon={faAnglesUp} /></Button></Col></Row>
              <Row className="ms-2 border-bottom"><h4>Klasse: {player?.userclass?.name}</h4></Row>
              <Row className="ms-2 border-bottom"><h4>Species: {player?.general?.kind}{" "}{player?.general?.sex === "männlich"? (<FontAwesomeIcon icon={faMars} />):(<FontAwesomeIcon icon={faVenus} />)}</h4></Row>
          </Row>
          
        </Col>
        <Col className="col-12 col-md-9 ">{
          player && player.userclass ? (<ClassList/>) : (<Spinner animation="border"/>)}
          <BarListComponent/>
        </Col>
      </Row>
    {/**<Row className="">{player && player.attributes && <Bars attr={player.attributes}/>}</Row>**/}
    <Row>
      <Col xxl={3}>{player && player.attributes ? (<AttributesFull/>): (<Spinner animation="border"/>) }</Col>
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
    
    ) : (<Spinner animation="border"/>)}</Row>
   
  </Container>
  )
}

export default ShowPlayer