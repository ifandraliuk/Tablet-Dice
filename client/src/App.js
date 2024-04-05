//import './App.css';
import React, { useEffect, useCallback , useMemo} from "react";
import "./App.css";
import "./Styles/Main.css";
//import 'react-toastify/dist/ReactTostify.css'
import LoginPage from "./pages/Login/index";
import ErrorPage from "./pages/ErrorPage";
import { Routes, Route, useLocation } from "react-router-dom";
import CreateCharacter from "./pages/Create/index";
import Talents from "./pages/Talents/index";
import Bestiaria from "./pages/Bestiarium/index";
import Enemies from "./pages/Enemies";
import InventoryPage from "./pages/Inventory/index";
import { useDispatch, useSelector } from "react-redux";
import {
  getPlayer,
  playerLoaded,
  getBonis,
  filterEquipment,
  getArmor,
  getWeight,
} from "./features/player/playerSlice";
import Diary from "./pages/Diary/index";
import Companions from './pages/Companions/index';
import Dashboard from "./pages/Dashboard/index";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Nav";
import Atlas from "./pages/Atlas";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const { fractionTheme, player, armor, weight, playerDataLoaded, equipped } =
    useSelector((state) => state.player);

/*   const playerCallback = useCallback(() => {
    //console.log("callback dispatch to get player info")
    //dispatch(getPlayer());
    //dispatch(playerLoaded({ value: true }));
  }, [dispatch]);

  // load player info
  useEffect(() => {
    if (user && !playerDataLoaded) {
      // console.log("useffect data loading, player Data is false")
      playerCallback();
    }
  }, [user, playerCallback, playerDataLoaded]);

  //load equipped info

  useEffect(() => {
    if (
      player?.inventory?.findIndex((el) => el.status === "Ausgerüstet") >= 0
    ) {
      //players inventory includes et least 1 item with status "equipped"
      if (equipped?.length === 0) {
        // equipped items was not filtered
       // dispatch(filterEquipment());
        console.log("filter equipment...")
      }
    }
    if (player?.inventory?.length > 0 && weight === 0) {
      console.log("weight is 0");
      dispatch(getWeight());
    }
  }, [player?.inventory, dispatch, weight, equipped]);

  useEffect(() => {
    //console.log(equipped.length, armor)
    // if player has equipped items
    if (player && equipped.length > 0) {
      if (armor === 0) {
        //items were equipped but armor is still 0
        //console.log("smth is equipped")
        dispatch(getArmor());
      }
    }
  }, [player, dispatch, armor, equipped]);

  useEffect(() => {
    //if player has items in inventory which are equipped && has a boni or enchantment
    if (player ) {
      if (
        player.inventory?.findIndex(
          (el) => el.status === "Ausgerüstet" && el.item.bonuses?.length > 0
        ) >= 0 ||
        player.inventory?.findIndex(
          (el) => el.enchantment?.bonuses.length > 0
        ) >= 0
      ) {
        dispatch(getBonis());
      }
    }
  }, [player, dispatch]); */

  return (
    <div className="g-0">
      {localStorage.user && <Navbar />}

      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route index element={<LoginPage />}></Route>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/register" element={<CreateCharacter />}></Route>
          <Route exact path="/diary" element={<Diary />}></Route>
          <Route exact path="/player" element={<Dashboard />}></Route>
          <Route exact path="/inventory" element={<InventoryPage />}></Route>
          <Route exact path="/talents" element={<Talents />}></Route>
          <Route exact path="/bestiaria" element={<Bestiaria />}></Route>
          <Route path="/companions" element={<Companions origin={fractionTheme}/>}></Route>
        <Route exact path="/atlas" element={<Atlas />}></Route>
          <Route path="/enemies" element={<Enemies />}></Route>
          <Route path="/error" element={<ErrorPage />}></Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
