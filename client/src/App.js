//import './App.css';
import React, {useState} from 'react';
//import 'react-toastify/dist/ReactTostify.css'
import Container from 'react-bootstrap/esm/Container';
import LoginPage from './pages/LoginPage';
import ShowPlayer from './pages/ShowPlayer';
import { Routes, Route} from 'react-router-dom';
import CreatePlayer from './pages/CreatePlayer';
import Talents from './pages/Talents';
import Enemies from './pages/Enemies';
import RegisterPage from './pages/RegisterPage';
import InventoryPage from './pages/InventoryPage';


function App() {

  return (
    <Container fluid className=""> 
      <Routes>
      <Route index element={<LoginPage/>}></Route>
        <Route path= "/" element={<LoginPage/>}></Route>
        <Route path="/register" element={<RegisterPage/>}></Route>     
        <Route path="/player" element={<ShowPlayer/>}></Route>
        <Route path="/create" element={<CreatePlayer/>}></Route>
        <Route path="/inventory" element={<InventoryPage/>}></Route>
        <Route path="/talents" element={<Talents/>}></Route>
        <Route path="/enemies" element={<Enemies/>}></Route>
      </Routes>
    </Container>
  );
}

export default App;
