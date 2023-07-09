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
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/AuthSlice";
import {
  reset as playerReset,
} from "../features/player/playerSlice";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    dispatch(playerReset());
    localStorage.clear();
    navigate("/")
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
          <Link className="link" to="/diary">
            <FontAwesomeIcon icon={faBookJournalWhills} /> Tagebuch
          </Link>
        </li>
        <li>
          <Link className="link" to="/inventory">
            <FontAwesomeIcon icon={faBoxOpen} /> Inventar
          </Link>
        </li>
        <li>
          <Link className="link" to="/talents">
            <FontAwesomeIcon icon={faDiceD20} /> Talente
          </Link>
        </li>
        <li>
          <Link className="link" to="bestiaria">
            <FontAwesomeIcon icon={faPaw} /> Bestiarium
          </Link>
        </li>
        <li>
          <Link className="link" to="atlas">
            <FontAwesomeIcon icon={faGlobe} /> Atlas
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
