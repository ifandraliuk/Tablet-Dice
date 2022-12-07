import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import {Link, useNavigate,  redirect} from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar'
import { useSelector, useDispatch} from 'react-redux';
import {logout, reset} from '../features/auth/AuthSlice'
import {reset as playerReset} from '../features/player/playerSlice'
function NavbarComp() {
  const {user} = useSelector((state)=>state.auth)
  const dispatch = useDispatch()

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    dispatch(playerReset())
  }
  return (
          <Navbar collapseOnSelect expand="xl" style={{backgroundColor:"#285C9F", color:"white"}}>
          <Container>
            <Navbar.Brand as={Link} to="/player">{user ? user.name: 'Neuer Charakter'}</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/register">Tagebuch</Nav.Link>
                <Nav.Link as={Link} to="/inventory">Inventar</Nav.Link>
                <Nav.Link as={Link} to="/talents">Alle Talente</Nav.Link>
                
              </Nav>
              <Nav>
              <Nav.Link>Datenbank</Nav.Link>
              <Nav.Link as={Link} to ="/enemies">Gegner</Nav.Link>
              {user? (<Button as={Link} to="/" variant="light" onClick= {onLogout}>Ausloggen</Button>):<></>}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
  )
}

export default NavbarComp