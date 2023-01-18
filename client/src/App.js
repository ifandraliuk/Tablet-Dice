//import './App.css';
import React, {useEffect, useCallback} from 'react';
import './App.css'
import './Styles/Main.css'
//import 'react-toastify/dist/ReactTostify.css'
import Container from 'react-bootstrap/esm/Container';
import LoginPage from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import { Routes, Route} from 'react-router-dom';
import CreateCharacter from './pages/CreateCharacter';
import Talents from './pages/Talents';
import Bestiaria from './pages/Bestiaria';
import Enemies from './pages/Enemies';
import InventoryPage from './pages/Inventory';
import {useDispatch, useSelector} from 'react-redux';
import { getPlayer, playerLoaded, getBonis, filterEquipment, getArmor, getWeight } from './features/player/playerSlice';
import Diary from './pages/Diary';
import Dashboard from './pages/Dashboard';



function App() {
const dispatch = useDispatch()
const {user} = useSelector((state)=>state.auth)
const {player,  armor, bonis, weight, playerDataLoaded, equipped} = useSelector((state)=>state.player)

const playerCallback = useCallback(()=>{
    //console.log("callback dispatch to get player info")
    dispatch(getPlayer())
    dispatch(playerLoaded({value: true}))
}, [dispatch])


// load player info
useEffect(()=>{
  if(user && !playerDataLoaded){
   // console.log("useffect data loading, player Data is false")
    playerCallback()
  }
}, [user, playerCallback,  playerDataLoaded])

//load equipped info 

useEffect(()=>{
  if( player?.inventory?.findIndex(el=>el.status==="Ausgerüstet")>=0){
    //players inventory includes et least 1 item with status "equipped"
    if(equipped?.length===0){
      // equipped items was not filtered
      dispatch(filterEquipment())
     // console.log("filter equipment...")
    }
  } 
  if(player?.inventory?.length>0 && weight===0){
    console.log("weight is 0")
    dispatch(getWeight())
  }
}, [player?.inventory, dispatch, weight,  equipped])

useEffect(()=>{
  //console.log(equipped.length, armor)
  // if player has equipped items 
  if(player && equipped.length>0 ){
    if(armor===0){
      //items were equipped but armor is still 0
      //console.log("smth is equipped")
      dispatch(getArmor())
    }
  }
}, [player, dispatch, armor, equipped])


useEffect(()=>{
  //if player has items in inventory which are equipped && has a boni or enchantment
  if(player){
    if(player.inventory?.findIndex(el=>el.status==="Ausgerüstet" && el.item.bonuses?.length>0)>=0 || player.inventory?.findIndex(el=>el.enchantment?.bonuses.length>0)>=0){
      dispatch(getBonis())
    }
}
},[player, dispatch])


  return (
    <Container fluid className="g-0"> 
      <Routes>
      <Route index element={<LoginPage/>}></Route>
        <Route path= "/" element={<LoginPage/>}></Route>
        <Route path="/register" element={<CreateCharacter/>}></Route>    
        <Route path="/diary" element={<Diary/>}></Route>   
        <Route path="/player" element={<Dashboard/>}></Route>
        <Route path="/inventory" element={<InventoryPage/>}></Route>
        <Route path="/talents" element={<Talents/>}></Route>
        <Route path="/bestiaria" element={<Bestiaria/>}></Route>
        <Route path="/enemies" element={<Enemies/>}></Route>
        <Route path="/error" element={<ErrorPage/>}></Route>  
      </Routes>
    </Container>
  );
}

export default App;
