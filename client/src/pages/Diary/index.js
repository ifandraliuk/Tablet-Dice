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
  const onEdit = (e) => {
    setEdit((edit) => !edit);
    const diaryId = e.currentTarget.id;
    console.log(diaryId);
    setEditId(diaryId.toString());
    let playerIds = [];
    const toEdit = diary.find((d) => d._id === diaryId.toString());
    console.log(toEdit);
    if (!toEdit) {
      return false;
    }
    setText(toEdit.text);
    if (toEdit.category) {
      setCategory(toEdit.category);
    } else {
      setCategory("");
    }
    toEdit.players?.map((player) => playerIds.push(player._id));
    shareWith(playerIds);
    /*    if(!toEdit){
      return false
    }
    
    if(toEdit.category){
      setCategory(toEdit.category)
    } else {
      setCategory("")
    }
    setText(toEdit.text)
    //setEditPlayers(toEdit.players)
    shareWith(toEdit.players) */
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
              {/* Links: Filter */}
              <div className="col-lg-3 col-xl-3 "></div>
              <div className="col-lg-8 col-xl-8">
                <div className="row align-items-center mb-2 ">
                  <div className="col-lg-4 col-xl-4 me-auto ">
                    <div className="button-group">
                      <button
                        type="button"
                        className={`${
                          viewMode === "mine" ? `${fractionTheme}-active` : ""
                        }`}
                        onClick={handleShowMine}
                      >
                        Meine Einträge
                      </button>

                      <button
                        type="button"
                        className={`${
                          viewMode === "shared" ? `${fractionTheme}-active` : ""
                        }`}
                        onClick={handleShowShared}
                      >
                        Gemeinsame Einträge
                      </button>
                    </div>
                  </div>

                  {/* Rechts: Edit + Plus */}
                  <div className="col-xl-4 d-flex justify-content-end">
                    <div className="button-group d-flex">
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
                        title="Neue Notiz"
                      >
                        <FontAwesomeIcon icon={faFilter} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-12">
                <DiarySidebar
                  categories={diaryCategories}
                  activeCategory={activeCategory}
                  setCategory={setCategory}
                  fractionTheme={fractionTheme}
                />
              </div>

              <div className="mt-2 col-xl-8 col-lg-8 col-md-12 info-div">
                {/* TOP BAR */}

                {/* CONTENT */}
                <ActiveDiaryCategory
                  diary={diary}
                  activeCategory={activeCategory}
                  editId={editId}
                  onRemove={onRemove}
                  onEdit={onEdit}
                  viewMode={viewMode} // gleich unten erklären
                  edit={edit} // optional
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
