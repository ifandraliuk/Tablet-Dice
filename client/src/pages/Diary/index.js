import React, { useEffect, useState } from "react";
import "../../Styles/Diary.css";
import Note from "./Note";
import Editor from "./Editor";
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
function Diary() {
  const { diary, userList } = useSelector((state) => state.diaries);
  const { fractionTheme } = useSelector((state) => state.player);
  const { user } = useSelector((state) => state.auth);

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
  return (
    <motion.div
      variants={pageTransition}
      initial="init"
      animate="animate"
      exit="exit"
    >
      <div className="diary-page">
        <div className={`${fractionTheme}-bg`}>
          <div className="container-fluid dark-bg">
            <div className="row">
              <div className="col-xl-3  col-lg-3 col-md-12">
                {diaryCategories &&
                  diaryCategories.map((category) => (
                    <button
                      id={category}
                      name={category}
                      onClick={(e) => setCategory(e.target.name)}
                      className={`categories ${category}`}
                      key={category}
                    >
                      {category}
                    </button>
                  ))}
              </div>
              <div className="col-xl-8 col-lg-8  diary-border info-container col-md-12">
                <Editor 
                text={text}
                user={user}
                userList={userList}
                edit={edit}
                share={share}
                setSave={setSave}
                activeCategory={activeCategory}
                setText={setText}
                onClick={onClick}
                 onSubmit={onSubmit} />
              </div>
            </div>
            {diary ? (
              diary.length > 0 ? (
                <div>
                  {diary.map(
                    (note) =>
                      note.category === activeCategory && (
                        <Note
                          key={note._id}
                          note={note}
                          editId={editId}
                          onRemove={onRemove}
                          onEdit={onEdit}
                        />
                      )
                  )}
                </div>
              ) : (
                <h5>Du hast noch keine Notizen</h5>
              )
            ) : (
              <Spinner animation="border" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Diary;
