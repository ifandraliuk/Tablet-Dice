//import './App.css';
import React from "react";
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
import {useSelector } from "react-redux";
import Diary from "./pages/Diary/index";
import Companions from './pages/Companions/index';
import Dashboard from "./pages/Dashboard/index";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Nav";
import Atlas from "./pages/Atlas";

function App() {
  const location = useLocation();
  const { fractionTheme} =
    useSelector((state) => state.player);

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
