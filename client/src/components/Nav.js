import React from "react";
import "../Styles/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiceD20,
  faHome,
  faBoxOpen,
  faBookJournalWhills,
  faPaw,
  faGlobe,
  faFeather,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/AuthSlice";
import { reset as playerReset } from "../features/player/playerSlice";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const { fractionTheme } = useSelector((state) => state.player);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    dispatch(playerReset());
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="navbar-page">
      <nav className="navbar">
        <div className="logo"></div>
        <ul className="nav-list">
          <li>
            <Link className="link" to="/">
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </li>
          <li>
            <Link
              className={`link ${location.pathname === "/diary" && "active"}`}
              to="/diary"
            >
              <FontAwesomeIcon
                icon={faBookJournalWhills}
                className={location.pathname === "/diary" ? `${fractionTheme}-text` : ""}
              />{" "}
              Tagebuch
            </Link>
          </li>
          <li>
            <Link
              className={`link ${
                location.pathname === "/inventory" && "active"
              }`}
              to="/inventory"
            >
              <FontAwesomeIcon
                icon={faBoxOpen}
                className={
                  location.pathname === "/inventory" ? `${fractionTheme}-text` : ""
                }
              />{" "}
              Inventar
            </Link>
          </li>
          <li>
            <Link className={`link ${location.pathname === "/talents" && "active"}`} to="/talents">
              <FontAwesomeIcon icon={faDiceD20}  className={location.pathname === "/talents" ? `${fractionTheme}-text` : ""} /> Talente
            </Link>
          </li>
          <li>
            <Link className={`link ${location.pathname === "/bestiaria" && "active"}`} to="/bestiaria">
              <FontAwesomeIcon icon={faFeather}  className={location.pathname === "/bestiaria" ? `${fractionTheme}-text` : ""}/> Bestiarium
            </Link>
          </li>
          <li>
            <Link className={`link ${location.pathname === "/companions" && "active"}`} to="/companions">
              <FontAwesomeIcon icon={faPaw}  className={location.pathname === "/companions" ? `${fractionTheme}-text` : ""}/> Begleiter
            </Link>
          </li>
          <li>
            <Link className={`link ${location.pathname === "/atlas" && "active"}`} to="/atlas">
              <FontAwesomeIcon icon={faGlobe}  className={location.pathname === "/atlas" ? `${fractionTheme}-text` : ""}/> Atlas
            </Link>
          </li>
        </ul>
        {user ? (
          <button as={Link} to="/" className="logout-btn" onClick={onLogout}>
            Ausloggen
          </button>
        ) : (
          <></>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
