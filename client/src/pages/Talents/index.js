import React, { useEffect, useState } from "react";
import "../../Styles/Talents.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faKhanda,
  faHammer,
  faHurricane,
  faMask,
  faBook,
  faTree,
  faUserGroup,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { Image, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getTalent,
  addToPlayer,
  getPlayerTalent,
} from "../../features/talent/talentSlice";
import { addTalent, getAttributes } from "../../features/player/playerSlice";
import AllTalents from "./AllTalents";
import { races } from "../../data/ConstVariables";
import ActiveTalents from "./ActiveTalents";
import AttributeList from "../Dashboard/Attributes";
import ScrollUpButton from "../../components/ScrollUpButton";
import { motion } from "framer-motion";
import { pageTransition } from "../../data/Animations";

function Talents() {
  const { user } = useSelector((state) => state.auth);
  const { fractionTheme, player, attributes } = useSelector((state) => state.player);
  const { allTalents, playerTalents, isLoading, isError, message } =
    useSelector((state) => state.talents);
  const [filter, setFilter] = useState("");
  const [newTalents, setNewTalent] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = [];
  const categorizedTalents = {};
  const icons = {
    Nahkampf: faKhanda,
    Fernkampf: faHurricane,
    Handwerk: faHammer,
    Gesellschaft: faUserGroup,
    Natur: faTree,
    Wissen: faBook,
    Heimlichkeit: faMask,
  };
  const kindAdvantage = races[player?.general?.kind]?.ability;
  //find all categories from dB
  allTalents.map((talent, ind) => {
    return categories.push(talent.category);
  });
  // count amount of categorizedTalents in each category
  categories.forEach(function (x) {
    categorizedTalents[x] = (categorizedTalents[x] || 0) + 1;
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    if (isError) {
      console.log(message);
    } else {
      dispatch(getTalent());
      dispatch(getPlayerTalent());
      dispatch(getAttributes())
    }
  }, [user, navigate, isError, dispatch, message]);

  const handleChange = (e) => {
    console.log(e.target.value, e.target.name);
    const name = e.target.name;
    console.log(isNaN(e.target.value));
    const value = isNaN(parseInt(e.target.value))
      ? 0
      : parseInt(e.target.value);
    console.log(name, typeof value);
    let talent = [e.target.name, value];
    const exists = newTalents.findIndex((el) => el[0] === name);
    console.log(exists);
    if (newTalents && newTalents.length === 0) {
      setNewTalent([...newTalents, talent]);
    } else {
      if (exists >= 0) {
        console.log("found index, repalcing value", exists);
        setNewTalent(
          newTalents.map((val, ind) =>
            val[0] === name && ind === exists ? talent : val
          )
        );
      } else {
        setNewTalent([...newTalents, talent]);
      }
    }
  };
  const handleClick = (e) => {
    e.preventDefault();
    const name = e.currentTarget.name;
    console.log(e.currentTarget.name);
    const talent = newTalents.find((el) => el[0] === name);
    if (talent) {
      const value = parseInt(talent[1]);
      if (value > 0) {
        console.log("adding manually talent");
        dispatch(addToPlayer({ name: name, point: value }));
        setNewTalent(newTalents.map((t) => (t[0] === name ? [t[0], 0] : t)));
        console.log(talent);
      }
    }
    console.log(newTalents);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    newTalents.forEach((el, i) => {
      if (el[1] > 0)
        //sorting out null values
        dispatch(addToPlayer({ name: el[0], point: el[1] }));
    });
    console.log(newTalents);
    setNewTalent([]);
  };

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="init"
      animate="animate"
      exit="exit"
    >
      <div className="talents-page">
        <div className={`${fractionTheme}-bg`}>
          <div className="container-fluid">
            <div className="row dark-bg">
              <div className="col-lg-3 col-md-12 ">
                <div
                  style={{ backgroundColor: "white" }}
                  className="p-2 col-lg-7 col-md-2 mb-2 ms-1 me-1 border"
                >
                  <Image fluid src={`/user/${user?._id}.jpeg`}></Image>
                </div>
                <div className="col-lg-9 col-md-10">
                  <h3>{player?.userclass?.name}</h3>
                  <p>{player?.userclass?.advantages}</p>
                  <h3>{player?.general?.kind}</h3>
                  <h5>{kindAdvantage?.name}</h5>
                  <p>{kindAdvantage?.descr}</p>
                </div>
              </div>
              <div className="col-lg-7 col-md-12">
                {attributes ? (
                  <AttributeList />
                ) : (
                  <Spinner animation="border" />
                )}
                {playerTalents ? (
                  <ActiveTalents props={playerTalents} />
                ) : (
                  <h5>Du hast noch keine Talente...</h5>
                )}
                <h5>Alle Talente</h5>
                <button className="btn-save" onClick={handleSubmit}>
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
                <div className="col-12">
                  {Object.keys(icons).map((name) => (
                    <button
                      key={name}
                      className={name}
                      name={name}
                      onClick={(e) => setFilter(e.currentTarget.name)}
                    >
                      <FontAwesomeIcon icon={icons[name]} />
                    </button>
                  ))}
                  <button name="clear" onClick={(e) => setFilter("")}>
                    <FontAwesomeIcon icon={faRefresh} />
                  </button>
                </div>
                <form>
                  {filter.length === 0 ? (
                    Object.keys(categorizedTalents).map((el, ind) => {
                      return (
                        <div className="col-12" key={ind}>
                          <AllTalents
                            handleChange={handleChange}
                            handleClick={handleClick}
                            categorizedTalents={el}
                            icons={icons}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <AllTalents
                      handleChange={handleChange}
                      handleClick={handleClick}
                      categorizedTalents={filter}
                      icons={icons}
                    />
                  )}
                </form>
              </div>
              {true && (
                <div className="col-lg-auto">
                  <ScrollUpButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Talents;
