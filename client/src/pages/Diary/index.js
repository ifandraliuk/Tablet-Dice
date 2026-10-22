import React, { useEffect, useState } from "react";
import "../../Styles/Diary.css";
import Note from "./Note";
import Editor from "./Editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMarker,
  faTrash,
  faPenToSquare,
  faPlus,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { diaryCategories } from "../../data/ConstVariables";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUsers,
  postDiary,
  editDiary,
  getMyDiary,
  removeDiary,
} from "../../features/diary/diarySlice";
import Spinner from "react-bootstrap/Spinner";
import { pageTransition } from "../../data/Animations";
import { motion } from "framer-motion";
import DiarySidebar from "./DiarySidebar";
import ActiveDiaryCategory from "./ActiveDiaryPage";
function Diary() {
  const { diary, userList } = useSelector((state) => state.diaries);
  const { fractionTheme } = useSelector((state) => state.player);
  const { user } = useSelector((state) => state.auth);
  const [viewMode, setViewMode] = useState("mine"); // "mine" | "shared"

  const [text, setText] = useState([]);
  const [share, shareWith] = useState([user._id]);
  const [activeCategory, setCategory] = useState("Personen");
  const [saveData, setSave] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("getting userList...");
    dispatch(getUsers());
    dispatch(getMyDiary(user?._id));
    if (!user) {
      navigate("/");
    }
  }, [navigate, user, dispatch]);
  const handleShowMine = () => setViewMode("mine");
  const handleShowShared = () => setViewMode("shared");
  const handleToggleEdit = () => setEdit((v) => !v);
  const handleCreate = () => {
    setEdit(false);
    setText(""); // falls du text state hast
    setEditId(null); // falls du editId nutzt
  };

  const onClick = (e) => {
    console.log(e.target.value, e.target.name);
    const id = e.target.id;
    if (share.includes(id)) {
      shareWith(share.filter((el) => el !== id));
    } else {
      shareWith([...share, id]);
    }
    console.log(share);
  };

  const onRemove = (e) => {
    console.log("remove pressed");
    console.log(e.currentTarget.id);
    dispatch(removeDiary(e.currentTarget.id));
  };

  const onSubmit = (e) => {
    console.log("submit");
    e.preventDefault();
    
    const players = share;
    console.log(players);
    if (text.length > 0 && saveData) {
      const data = {
        text: text,
        players: players,
        category: activeCategory,
      };
      if (edit) {
        console.log("edit note");
        console.log(data);
        console.log(editId);
        dispatch(editDiary({ id: editId, data: data }));
        setEditId("");
        setEdit(false);
      } else {
        console.log("posting a diary note");
        dispatch(postDiary(data));
      }
      document.getElementById("journal").reset();
      if (activeCategory?.length > 0) {
        document.getElementById(activeCategory).focus();
      }
      setText("");
      shareWith([user._id]);
      setSave(false);
    }
  };


  const mineCount =
    diary?.filter((entry) => {
      const isActiveCategory = entry?.category === activeCategory;
      const players = entry?.players || [];
      return isActiveCategory && players.length === 1;
    }).length || 0;

  const sharedCount =
    diary?.filter((entry) => {
      const players = entry?.players || [];
      return players.length > 1 && entry?.category === activeCategory;
    }).length || 0;
  /* TODOS:
  1. edit mode -switch from Note to Editor
  2. create popup for filter - options - ascending desc for date
  3. create popup for create mode
*/
  return (
    <motion.div>
      <div className="diary-page">
        <div className={`${fractionTheme}-bg`}>
          <div className="container-fluid dark-bg pt-3">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-12">
                <DiarySidebar
                  diary={diary}
                  categories={diaryCategories}
                  activeCategory={activeCategory}
                  setCategory={setCategory}
                  fractionTheme={fractionTheme}
                />
              </div>

              <div className="mt-2 col-xl-8 col-lg-8 col-md-12 info-div">
                {/* TOP BAR */}
                <div
                  className="d-flex align-items-center justify-content-between flex-wrap"
                  style={{ gap: "12px" }}
                >
                  <div
                    className="button-group d-flex align-items-center"
                    style={{ flexWrap: "nowrap" }}
                  >
                    <button
                      type="button"
                      className={`${
                        viewMode === "mine" ? `${fractionTheme}-active` : ""
                      }`}
                      onClick={handleShowMine}
                    >
                      Meine Einträge ({mineCount})
                    </button>

                    <button
                      type="button"
                      className={`${
                        viewMode === "shared" ? `${fractionTheme}-active` : ""
                      }`}
                      onClick={handleShowShared}
                    >
                      Gemeinsame Einträge ({sharedCount})
                    </button>
                  </div>

                  <div
                    className="button-group d-flex align-items-center"
                    style={{ flexWrap: "nowrap"}}
                  >
                    <button
                      type="button"
                      className="btn-add"
                      onClick={handleCreate}
                      title="Neue Notiz"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>

                    <button
                      type="button"
                      className="btn-add"
                      onClick={handleCreate}
                      title="Filter"
                    >
                      <FontAwesomeIcon icon={faFilter} />
                    </button>
                  </div>
                </div>

                {/* CONTENT */}
                <ActiveDiaryCategory
                  diary={diary}
                  activeCategory={activeCategory}
                  editId={editId}
                  onRemove={onRemove}
                  shareWith={shareWith}
                  user={user}
                  userList={userList}
                  share={share}
                  setSave={setSave}
                  onClick={onClick}
                  onSubmit={onSubmit}
                  setText={setText}
                  viewMode={viewMode}
                  edit={edit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Diary;
{
  /*                 <Editor 
                text={text}
                user={user}
                userList={userList}
                edit={edit}
                share={share}
                setSave={setSave}
                activeCategory={activeCategory}
                setText={setText}
                onClick={onClick}
                 onSubmit={onSubmit} /> */
}
