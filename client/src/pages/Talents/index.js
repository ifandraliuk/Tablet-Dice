import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  shallowEqual,
} from "react";
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
  faPlus,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Image, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getTalent,
  addToPlayer,
  updatePlayersTalent,
  getPlayerTalent,
  getUserBoni,
  reset,
} from "../../features/talent/talentSlice";
import { getAttributes } from "../../features/player/playerSlice";
import AllTalents from "./AllTalents";
import ActiveTalents from "./ActiveTalents";
import AttributeList from "../Dashboard/Attributes";
import ScrollUpButton from "../../components/ScrollUpButton";
import { motion } from "framer-motion";
import { pageTransition } from "../../data/Animations";
import { getCategoryBoni } from "../../features/inventory/inventorySlice";

function Talents() {
  console.log("TALENTS rendered");

  const { user } = useSelector((state) => state.auth);
  const { fractionTheme, attributes } = useSelector((state) => state.player);
    const { talentBoni } = useSelector((state) => state.inventory);
  const {
    allTalents,
    kindName,
    kindBonus,
    kindBonusName,
    userclassName,
    userclassBonus,
    playerTalents,
    isLoading,
    isError,
    message,
  } = useSelector((state) => state.talents);
  

  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState("active"); // "active" oder "all"

  const [newTalents, setNewTalent] = useState([]);
  const [edit, toEdit] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bonusMap = useMemo(() => {
    const map = new Map(); // Key: Talent-Name, Value: Bonus-Wert

    for (const el of talentBoni) {
      // passt das zu deiner Struktur: el.bonus.type und el.value
      map.set(el.bonus.type, el.value);
    }

    return map;
  }, [talentBoni]);
  const icons = useMemo(
    () => ({
      Nahkampf: faKhanda,
      Fernkampf: faHurricane,
      Handwerk: faHammer,
      Gesellschaft: faUserGroup,
      Natur: faTree,
      Wissen: faBook,
      Heimlichkeit: faMask,
    }),
    []
  );

  useEffect(() => {
    if (!user) return;
    if (attributes?.length === 0) {
      dispatch(getAttributes());
    }
    if (allTalents?.length === 0) {
      dispatch(getTalent());
    }
    if (playerTalents?.length === 0) {
      dispatch(getPlayerTalent());
    }

    dispatch(getUserBoni());
    dispatch(getCategoryBoni("talent"));
  }, [user, attributes, dispatch]);

  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleShowActiveTalents = () => setViewMode("active");
  const handleShowAllTalents = () => setViewMode("all");

  const handleEdit = () => {
    toEdit((edit) => !edit);
  };
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
  const addNewTalent = useCallback(
    (e) => {
      //e.preventDefault();
      const name = e.currentTarget.name;

      console.log("adding manually talent");
      dispatch(addToPlayer({ name: name, point: 1 }));
    },
    [dispatch]
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    newTalents.forEach((el, i) => {
      if (el[1] > 0)
        //sorting out null values
        dispatch(updatePlayersTalent({ id: el[0], point: el[1] }));
    });
    console.log(newTalents);
    setNewTalent([]);
    toEdit((edit) => !edit);
  };
  return (
    <motion.div>
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
                  <h3>{userclassName}</h3>
                  <p>{userclassBonus}</p>
                  <h3>{kindName}</h3>
                  <h5>{kindBonusName}</h5>
                  <p>{kindBonus}</p>
                </div>
              </div>

              <div className="col-lg-7 col-md-12">
                {attributes ? (
                  <AttributeList  key={attributes._id} />
                ) : (
                  <Spinner animation="border" />
                )}
                <div className="row align-items-center">
                  {/* Linksbündige Buttons */}
                  <div className="col-auto me-auto">
                    <div className="button-group">
                      <button
                        type="button"
                        className={`${
                          viewMode === "active" ? `${fractionTheme}-active` : ""
                        }`}
                        onClick={handleShowActiveTalents}
                      >
                        Erlente talente
                      </button>
                      <button
                        type="button"
                        className={`${
                          viewMode === "all" ? `${fractionTheme}-active` : ""
                        }`}
                        onClick={handleShowAllTalents}
                      >
                        Alle Talente
                      </button>
                    </div>
                  </div>

                  {/* Rechtsbündige Buttons */}
                  <div className="col-auto">
                    {edit ? (
                      <button
                        type="button"
                        className="btn-save"
                        onClick={handleSubmit}
                      >
                        <FontAwesomeIcon icon={faFloppyDisk} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={handleEdit}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    )}
                  </div>
                </div>
                {viewMode === "active" ? (
                  playerTalents.length > 0 ? (
                    <ActiveTalents
                      filter={filter}
                      setFilter={setFilter}
                      icons={icons}
                      edit={edit}
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      fractionTheme={fractionTheme}
                      newTalents={newTalents}
                      bonusMap={bonusMap}
                    />
                  ) : (
                    <h5>Du hast noch keine Talente...</h5>
                  )
                ) : (
                  <AllTalents
                    handleChange={handleChange}
                    handleClick={addNewTalent}
                    icons={icons}
                    filter={filter}
                    setFilter={setFilter}
                    fractionTheme={fractionTheme}
                        bonusMap={bonusMap}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Talents;
