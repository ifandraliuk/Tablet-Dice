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
import { diaryViewForPlayers } from "./diaryView";
import { samePlayers } from "./draftUtils";
import { matchesDiarySearch } from "./diarySearch";

const ActiveDiaryCategory = React.memo(function ActiveDiaryCategory({
  diary,
  activeCategory,
  onRemove,
  user,
  userList,
  fractionTheme,
  onClick,
  viewMode,
  setViewMode,
  onDirtyChange,
  onSavingChange,
  onEditingChange,
  onSavedText,
  search = "",
  requestEditAction,
  resetKey,
  emptyText = "Du hast noch keine Notizen",
}) {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [draftText, setDraftText] = useState("");
  const [initialDraft, setInitialDraft] = useState(null);
  const [share, shareWith] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [editedNoteId, setEditedNoteId] = useState("");
  const dirty = Boolean(editId && initialDraft &&
    (draftText !== initialDraft.text || !samePlayers(share, initialDraft.players)));

  useEffect(() => {
    if (onDirtyChange) onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (onSavingChange) onSavingChange(saving);
  }, [saving, onSavingChange]);

  useEffect(() => {
    if (onEditingChange) onEditingChange(Boolean(editId));
  }, [editId, onEditingChange]);

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
    setInitialDraft(null);
    setSaveError("");
  }, [activeCategory, viewMode, resetKey]);

  const notes = useMemo(() => {
    if (!Array.isArray(diary)) return [];

    return diary
      .filter((note) => note.category === activeCategory)
      .filter((note) => diaryViewForPlayers(note.players || []) === viewMode);
  }, [diary, activeCategory, viewMode]);

  const matchingNotes = useMemo(
    () => notes.filter((note) => matchesDiarySearch(note.text, search, note.createdAt) || note._id === editId),
    [notes, search, editId]
  );

  if (!diary) {
    return <Spinner animation="border" />;
  }

  if (diary.length === 0) {
    return <h5>{emptyText}</h5>;
  }

  if (notes.length === 0) {
    return <h5>Keine Notizen in dieser Kategorie</h5>;
  }

  if (matchingNotes.length === 0) {
    return <h5>Keine Einträge für diese Suche gefunden.</h5>;
  }

  const onCancelEdit = () => {
    setEdit(false);
    setEditId("");
    setDraftText("");
    setInitialDraft(null);
    setSaveError("");
  };

  const onEdit = (e) => {
    setEdit((edit) => !edit);

    const diaryId = e.currentTarget.id;
    const note = notes.find((n) => n._id === diaryId);
    setDraftText(note?.text);
    const playerIds = (note?.players || []).map((player) => String(player?._id ?? player?.id ?? player));
    if (!playerIds.includes(String(user._id))) playerIds.push(String(user._id));
    shareWith(playerIds);
    setInitialDraft({ text: note?.text, players: playerIds });
    setSaveError("");
    setEditId(diaryId.toString());
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!draftText.trim()) {
      setSaveError("Bitte gib einen Text ein.");
      return;
    }
    setSaveError("");
    setSaving(true);
    try {
      await dispatch(editDiary({
        id: editId,
        data: { text: draftText, players: share, category: activeCategory },
      })).unwrap();
      setEditedNoteId(editId);
      setSubmitMessage("Notiz erfolgreich bearbeitet.");
      setEditId("");
      setEdit(false);
      if (onSavedText) onSavedText(draftText, notes.find((note) => note._id === editId)?.createdAt);
      setViewMode(diaryViewForPlayers(share));
    } catch (error) {
      setSaveError(typeof error === "string" ? error : "Die Notiz konnte nicht gespeichert werden.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="">
      <div className="row mt-2"></div>

      {matchingNotes.map((note) =>
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
            shareWith={shareWith}
            fractionTheme={fractionTheme}
            activeCategory={activeCategory}
            onClick={onClick}
            onSubmit={onSubmit}
            onRemove={onRemove}
            onCancelEdit={() => requestEditAction ? requestEditAction(onCancelEdit) : onCancelEdit()}
            saving={saving}
            saveError={saveError}
          />
        ) : (
          <Note
            key={note._id}
            activeCategory={activeCategory}
            note={note}
            user={user}
            fractionTheme={fractionTheme}
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
