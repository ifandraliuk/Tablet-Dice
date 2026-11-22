//import './App.css';
import React, { useEffect, useState } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import Diary from "./pages/Diary/index";
import Companions from "./pages/Companions/index";
import Dashboard from "./pages/Dashboard/index";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Nav";
import Atlas from "./pages/Atlas";
import Crafting from "./pages/Crafting";
import { getFraction, clearFraction } from "./features/player/playerSlice";
import { ToastContainer } from "react-toastify";

function App() {
  console.log("APP rendered");
  const location = useLocation();
  const dispatch = useDispatch();
  const { fractionTheme } = useSelector((state) => state.player);
  const { user } = useSelector((state) => state.auth);
  const [fractionError, setFractionError] = useState("");
  const [fractionRetry, setFractionRetry] = useState(0);
  const userId = user?._id;
  const token = user?.token;
  const isCreating = location.pathname === "/create";
  useEffect(() => {
    setFractionError("");
    dispatch(clearFraction());
    if (!userId || !token || isCreating) return;
    let active = true;
    const request = dispatch(getFraction());
    request.unwrap().catch((error) => {
      if (active) setFractionError(typeof error === "string" ? error : "Bitte versuche es erneut.");
    });
    return () => {
      active = false;
      request.abort();
    };
  }, [dispatch, userId, token, fractionRetry, isCreating]);

  return (
    <div className="g-0">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="app-toast"
      />
      <div className={`${fractionTheme}-bg`}>
        <div className="container-fluid">
          <div className="row dark-bg">
            {user && <Navbar />}
            {user && fractionError && <div role="alert">Herkunftshintergrund konnte nicht geladen werden: {fractionError} <button type="button" onClick={() => setFractionRetry((value) => value + 1)}>Erneut versuchen</button></div>}

            <AnimatePresence>
              <Routes location={location} key={location.pathname}>
                <Route index element={<LoginPage />}></Route>
                <Route path="/" element={<LoginPage />}></Route>
                <Route path="/create" element={<CreateCharacter />}></Route>
                <Route exact path="/diary" element={<Diary />}></Route>
                <Route exact path="/player" element={<Dashboard />}></Route>
                <Route
                  exact
                  path="/inventory"
                  element={<InventoryPage />}
                ></Route>
                <Route exact path="/talents" element={<Talents />}></Route>
                <Route path="/crafting" element={<Crafting />}></Route>
                <Route exact path="/bestiaria" element={<Bestiaria />}></Route>
                <Route
                  path="/companions"
                  element={<Companions origin={fractionTheme} />}
                ></Route>
                <Route exact path="/atlas" element={<Atlas />}></Route>
                <Route path="/enemies" element={<Enemies />}></Route>
                <Route path="/error" element={<ErrorPage />}></Route>
              </Routes>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
