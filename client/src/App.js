//import './App.css';
import React, {useEffect} from 'react';
import './App.css'
//import 'react-toastify/dist/ReactTostify.css'
import Container from 'react-bootstrap/esm/Container';
import LoginPage from './pages/LoginPage';
import ShowPlayer from './pages/ShowPlayer';
import { Routes, Route} from 'react-router-dom';
import CreateCharacter from './pages/CreateCharacter';
import Talents from './pages/Talents';
import Enemies from './pages/Enemies';
import InventoryPage from './pages/InventoryPage';
import {useDispatch, useSelector} from 'react-redux';
import { getPlayer } from './features/player/playerSlice';
function App() {
console.log("in app")
const dispatch = useDispatch()
const {user} = useSelector((state)=>state.auth)
useEffect(()=>{
  if(user){
    dispatch(getPlayer())
  }
  
}, [])
  return (
    <Container fluid className="g-0"> 
      <Routes>
      <Route index element={<LoginPage/>}></Route>
        <Route path= "/" element={<LoginPage/>}></Route>
        <Route path="/register" element={<CreateCharacter/>}></Route>     
        <Route path="/player" element={<ShowPlayer/>}></Route>
        <Route path="/inventory" element={<InventoryPage/>}></Route>
        <Route path="/talents" element={<Talents/>}></Route>
        <Route path="/enemies" element={<Enemies/>}></Route>
      </Routes>
    </Container>
  );
}

export default App;
