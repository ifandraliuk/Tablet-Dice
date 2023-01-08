import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVenus, faMars, faAnglesUp, faLevelUp} from '@fortawesome/free-solid-svg-icons'
import { Container, Spinner, Row, Col, ListGroup } from 'react-bootstrap';
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
import { filterEquipment, getBonis, getPlayer, updateLevel} from '../features/player/playerSlice';

import EquippedItem from '../components/EquippedItem';
function ShowPlayer() {
  const {user, registered, isLoading, isError, message} = useSelector((state)=>state.auth)
  const {player, equipped, bonis} = useSelector((state)=>state.player)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const originName = player?.general?.origin.split(" ")
  useEffect(()=> {
    if(!user) {
      console.log("not user")
      navigate("/")
    }
    if(!player){
      dispatch(getPlayer())
    }
    if(registered){
      navigate("/register")
    }
    if(isError){
      console.log(message)
      if(!player || !user){
        dispatch(logout())
      }
      
    }
    if(!equipped){
      dispatch(filterEquipment())
    }
     return () => {
      console.log("reset")
      dispatch(reset())
    } 
  }, [user, player.isError, navigate, isError, dispatch, message])

  const newLevel = () => {
    dispatch(updateLevel())
   
  }
  if(isLoading || player.isLoading) {
    return <Spinner animation="border"/>
  }

  return (
    <div  style={{backgroundImage:"url(/wood.jpg)", backgroundSize:"cover", height: "100vh",
  }}>
      
      <NavbarComp />
      <Container fluid className='g-5'>
      <Row className="m-1" >
        <Col className="col-md-3 col-12">
          <Row>
            <Col><Image fluid src={`/user/${user?.name}.jpeg`}></Image></Col>
            <Col className="col-4">
              <Figure><Figure.Image src={`/origin/${originName && originName[originName.length-1]}ldpi.png`}/></Figure>
              <Row className="ms-2 border-bottom border-top justify-content-center">
                <h4>{originName && originName[originName.length-1]}</h4></Row>
                <Row>
                <EquippedItem category="Haupthand"/>
                </Row>
                <Row><EquippedItem category="Nebenhand"/></Row>
              </Col>
              <Row className="ms-2 border-bottom">
                <Col className="col-3"><h4>Stufe: {player?.level}</h4></Col><Col><Button variant="dark" onClick={newLevel}><FontAwesomeIcon icon={faLevelUp} /></Button></Col></Row>
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
      <Row><Col className="col-sm-12 col-md-6">Aktive Bonis
      <ListGroup>
        {bonis?.map((boni)=>{
          <ListGroup.Item>{boni}</ListGroup.Item>
        })}
      </ListGroup>
        </Col></Row>
    <Row>{player && player.general ? (<GeneralFull general={player.general}/>
    ) : (<Spinner animation="border"/>)}</Row>
   </Container>
   </div>
  )
}

export default ShowPlayer