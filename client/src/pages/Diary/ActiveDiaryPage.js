import React, { useState, useMemo } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useSelector, useDispatch } from "react-redux";
import {
  getUsers,
  postDiary,
  editDiary,
  getMyDiary,
  removeDiary,
} from "../../features/diary/diarySlice";
import Note from "./Note"; // Pfad ggf. anpassen
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarker, faTrash } from "@fortawesome/free-solid-svg-icons";
import Editor from "./Editor";
const ActiveDiaryCategory = React.memo(function ActiveDiaryCategory({
  diary,
  activeCategory,
  onRemove,
  shareWith,
  setText,
  user,
  userList,
  share,
  onClick,
  viewMode,
  emptyText = "Du hast noch keine Notizen",
}) {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [saveData, setSave] = useState(false);
  const [draftText, setDraftText] = useState("");

  const notes = useMemo(() => {
    if (!Array.isArray(diary)) return [];

    return diary
      .filter((note) => note.category === activeCategory)
      .filter((note) => {
        if (viewMode === "mine") {
          return note.players?.length === 1;
        }
        return true;
      });
  }, [diary, activeCategory, viewMode]);

  if (!diary) {
    return <Spinner animation="border" />;
  }

  if (diary.length === 0) {
    return <h5>{emptyText}</h5>;
  }

  if (notes.length === 0) {
    return <h5>Keine Notizen in dieser Kategorie</h5>;
  }
  const onEdit = (e) => {
    setEdit((edit) => !edit);

    const diaryId = e.currentTarget.id;
    const note = notes.find((n) => n._id === diaryId);
    setDraftText(note?.text); // initialer Text
    setEditId(diaryId.toString());
  };
  const onCancelEdit = (e) => {
    setEdit(false);
    setEditId("");
    setDraftText("");
  };
  const onSubmit = (e) => {
    console.log("submit");
    e.preventDefault();
    debugger;
    const players = share;
    console.log(players);
    if (draftText.length > 0 && saveData) {
      const data = {
        text: draftText,
        players: players,
        category: activeCategory,
      };
      //  if (edit) {
      console.log("edit note");
      console.log(data);
      console.log(editId);
      dispatch(editDiary({ id: editId, data: data }));
      setEditId("");
      setEdit(false);
    } /*  else {
        console.log("posting a diary note");
        dispatch(postDiary(data));
      } */
    document.getElementById("journal").reset();
    /*       if (activeCategory?.length > 0) {
        document.getElementById(activeCategory).focus();
      } */
    setText("");
    shareWith([user._id]);
    setSave(false);
  };
  return (
    <div className="">
      <div className="row mt-2"></div>

      {notes.map((note) =>
        editId === note._id ? (
          <Editor
            key={note._id}
            note={note}
            setDraftText={setDraftText}
            draftText={draftText}
            user={user}
            userList={userList}
            //    onEdit={onEdit}
            //    onCancelEdit={onCancelEdit}
            edit={true}
            editId={editId}
            share={share}
            setSave={setSave}
            activeCategory={activeCategory}
            onClick={onClick}
            onSubmit={onSubmit}
            onRemove={onRemove}
            onCancelEdit={onCancelEdit}
          />
        ) : (
          <Note
            key={note._id}
            activeCategory={activeCategory}
            note={note}
            editId={editId}
            onRemove={onRemove}
            onEdit={onEdit}
          />
        ),
      )}
    </div>
  );
});

export default ActiveDiaryCategory;
