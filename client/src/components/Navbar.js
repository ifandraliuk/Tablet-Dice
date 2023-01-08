import React from 'react'
import  '../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHouse, faDiceD20, faPadlet, faHome, faBoxOpen, faBookJournalWhills} from '@fortawesome/free-solid-svg-icons'
import { Container, Button } from 'react-bootstrap'
import {Link,} from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar'
import { useSelector, useDispatch} from 'react-redux';
import {logout, reset} from '../features/auth/AuthSlice'
import {reset as playerReset, playerLoaded} from '../features/player/playerSlice'
function NavbarComp() {
  const {user} = useSelector((state)=>state.auth)
  const {player} = useSelector((state)=>state.player)
  const dispatch = useDispatch()
  const origin = player?.general?.origin.split(" ")
  const id = origin?.length-1
  const variant = origin && ["Welles", "Ethelion"].includes(origin[id]) ? "light" : "dark"
  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    dispatch(playerReset())
    dispatch(playerLoaded({value: false}))
    localStorage.removeItem("user")
  }
  return (
          <Navbar collapseOnSelect expand="xl" variant="dark">
          <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/"><FontAwesomeIcon icon={faHome} /> </Nav.Link>
                <Nav.Link as={Link} to="/diary"><FontAwesomeIcon icon={faBookJournalWhills} />Tagebuch</Nav.Link>
                <Nav.Link as={Link} to="/inventory"><FontAwesomeIcon icon={faBoxOpen} /> Inventar</Nav.Link>
                <Nav.Link as={Link} to="/talents"><FontAwesomeIcon icon={faDiceD20} /> Talente</Nav.Link>
                
              </Nav>
              <Nav>
              <Nav.Link>Datenbank</Nav.Link>
              <Nav.Link as={Link} to ="/enemies">Gegner</Nav.Link>
              {user? (<Button as={Link} to="/" variant="outline-light" onClick= {onLogout}>Ausloggen</Button>):<></>}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
  )
}

export default NavbarComp