import React, { useState, useMemo, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useSelector, useDispatch } from "react-redux";
import {
  getUsers,
  postDiary,
  editDiary,
  getMyDiary,
  removeDiary,
} from "../../features/diary/diarySlice";
import Note from "./Note";
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
  const [submitMessage, setSubmitMessage] = useState("");
  const [editedNoteId, setEditedNoteId] = useState("");

  useEffect(() => {
    if (!submitMessage) return;

    const timer = setTimeout(() => {
      setSubmitMessage("");
      setEditedNoteId("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [submitMessage]);

  useEffect(() => {
    setEdit(false);
    setEditId("");
    setDraftText("");
  }, [activeCategory]);

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

  const onCancelEdit = () => {
    setEdit(false);
    setEditId("");
    setDraftText("");
  };

  const onEdit = (e) => {
    setEdit((edit) => !edit);

    const diaryId = e.currentTarget.id;
    const note = notes.find((n) => n._id === diaryId);
    setDraftText(note?.text);
    setEditId(diaryId.toString());
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const players = share;

    if (draftText.length > 0 && saveData) {
      const data = {
        text: draftText,
        players: players,
        category: activeCategory,
      };

      dispatch(editDiary({ id: editId, data: data }));
      setEditedNoteId(editId);
      setSubmitMessage("Notiz erfolgreich bearbeitet.");
      setEditId("");
      setEdit(false);
    }

    document.getElementById("journal")?.reset();
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
            submitMessage={
              submitMessage && editedNoteId === note._id ? submitMessage : ""
            }
          />
        ),
      )}
    </div>
  );
});

export default ActiveDiaryCategory;
