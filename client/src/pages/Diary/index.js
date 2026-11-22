import React, { useEffect, useMemo, useState } from "react";
import "../../Styles/Diary.css";
import Note from "./Note";
import Editor from "./Editor";
import NotePopup from "./NotePopup";
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
import { Button, Modal, Spinner } from "react-bootstrap";
import { pageTransition } from "../../data/Animations";
import { motion } from "framer-motion";
import DiarySidebar from "./DiarySidebar";
import ActiveDiaryCategory from "./ActiveDiaryPage";
import { getOriginAccentStyle } from "../../data/OriginColors";
import { ALL_DIARY_CATEGORIES, diaryViewForPlayers, matchesDiaryCategory } from "./diaryView";
import { hasDraftContent } from "./draftUtils";
import { matchesDiarySearch } from "./diarySearch";

function Diary() {
  const { diary, userList } = useSelector((state) => state.diaries);
  const { fractionTheme } = useSelector((state) => state.player);
  const { user } = useSelector((state) => state.auth);

  const VIEW_MODE_KEY = "diary-view-mode";
  const CATEGORY_KEY = "diary-active-category";
  const LAST_CATEGORY_KEY = "diary-last-category";
  const SORT_KEY = "diary-sort-direction";

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem(VIEW_MODE_KEY) || "mine";
  });

  const [text, setText] = useState([]);
  const [share, shareWith] = useState([user._id]);
  const [activeCategory, setCategory] = useState(() => {
    return localStorage.getItem(CATEGORY_KEY) || "Personen";
  });
  const [lastCategory, setLastCategory] = useState(() => {
    const active = localStorage.getItem(CATEGORY_KEY);
    const last = localStorage.getItem(LAST_CATEGORY_KEY);
    if (diaryCategories.includes(active)) return active;
    return diaryCategories.includes(last) ? last : diaryCategories[0];
  });
  const [saveData, setSave] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [createCategory, setCreateCategory] = useState(lastCategory);
  const [initialCreateCategory, setInitialCreateCategory] = useState(lastCategory);
  const [createSaving, setCreateSaving] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [editDirty, setEditDirty] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editActive, setEditActive] = useState(false);
  const [search, setSearch] = useState("");
  const [editResetKey, setEditResetKey] = useState(0);
  const [pendingDiscard, setPendingDiscard] = useState(null);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [sortDirection, setSortDirection] = useState(() => {
    return localStorage.getItem(SORT_KEY) || "desc";
  });
const modules = {
  toolbar: [
    [{ header: [4] }],
    [{ size: ["small", false, "large"] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["clean"],
    ["link", "image"],
  ],
};
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

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(CATEGORY_KEY, activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    localStorage.setItem(LAST_CATEGORY_KEY, lastCategory);
  }, [lastCategory]);

  useEffect(() => {
    localStorage.setItem(SORT_KEY, sortDirection);
  }, [sortDirection]);

  useEffect(() => {
    if (!createSuccess) return;
    const timer = setTimeout(() => setCreateSuccess(false), 2500);
    return () => clearTimeout(timer);
  }, [createSuccess]);

  const requestDiscard = (dirty, action) => {
    if (dirty) {
      setPendingDiscard(() => action);
    } else {
      action();
    }
  };
  const requestEditAction = (action) => requestDiscard(editDirty, action);
  const navigateFromEdit = (action) => requestEditAction(() => {
    setEditResetKey((key) => key + 1);
    action();
  });
  const handleShowMine = () => {
    if (viewMode !== "mine") navigateFromEdit(() => setViewMode("mine"));
  };
  const handleShowShared = () => {
    if (viewMode !== "shared") navigateFromEdit(() => setViewMode("shared"));
  };
  const selectCategory = (category) => {
    setCategory(category);
    if (diaryCategories.includes(category)) setLastCategory(category);
  };
  const handleCategoryChange = (category) => {
    if (category !== activeCategory) navigateFromEdit(() => selectCategory(category));
  };
  const handleToggleEdit = () => setEdit((v) => !v);
  const handleCreate = () => navigateFromEdit(() => {
    setEdit(false);
    setText("");
    setEditId(null);
    shareWith([String(user._id)]);
    const defaultCategory = activeCategory === ALL_DIARY_CATEGORIES ? lastCategory : activeCategory;
    setCreateCategory(defaultCategory);
    setInitialCreateCategory(defaultCategory);
    setCreateError("");
    setCreateSuccess(false);
    setIsCreatePopupOpen(true);
  });

  const closeCreatePopup = () => {
    if (createSaving) return;
    const dirty = hasDraftContent(text) ||
      createCategory !== initialCreateCategory ||
      share.length > 1;
    requestDiscard(dirty, () => setIsCreatePopupOpen(false));
  };

  const handleCreatePopupSave = async () => {
    const noteText = String(text ?? "").trim();

    if (!noteText) {
      setCreateError("Bitte gib einen Text ein.");
      return;
    }

    setCreateError("");
    setCreateSaving(true);
    try {
      const createdNote = await dispatch(postDiary({
        text: noteText,
        players: share,
        category: createCategory,
      })).unwrap();
      selectCategory(createCategory);
      setViewMode(diaryViewForPlayers(share));
      if (!matchesDiarySearch(noteText, search, createdNote?.createdAt)) setSearch("");
      setText("");
      shareWith([String(user._id)]);
      setIsCreatePopupOpen(false);
      setCreateSuccess(true);
    } catch (error) {
      setCreateError(typeof error === "string" ? error : "Die Notiz konnte nicht gespeichert werden.");
    } finally {
      setCreateSaving(false);
    }
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
    setDeleteError("");
    setDeleteNoteId(e.currentTarget.id);
  };

  const cancelRemove = () => {
    if (deleteSaving) return;
    setDeleteNoteId(null);
    setDeleteError("");
  };

  const confirmRemove = async () => {
    if (!deleteNoteId || deleteSaving) return;
    setDeleteError("");
    setDeleteSaving(true);
    try {
      await dispatch(removeDiary(deleteNoteId)).unwrap();
      setDeleteNoteId(null);
    } catch (error) {
      setDeleteError(typeof error === "string" && error.trim()
        ? error
        : error?.message || "Der Eintrag konnte nicht gelöscht werden. Bitte versuche es erneut.");
    } finally {
      setDeleteSaving(false);
    }
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
      document.getElementById("journal")?.reset();
      if (activeCategory?.length > 0) {
        document.getElementById(activeCategory)?.focus();
      }
      setText("");
      shareWith([user._id]);
      setSave(false);
    }
  };

  const handleSortChange = (direction) => {
    setSortDirection(direction);
    setShowFilterPopup(false);
  };

  const sortedDiary = useMemo(() => {
    if (!Array.isArray(diary)) return [];

    return [...diary].sort((a, b) => {
      const aTime = new Date(a?.createdAt || 0).getTime();
      const bTime = new Date(b?.createdAt || 0).getTime();

      return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
    });
  }, [diary, sortDirection]);

  const mineCount =
    diary?.filter((entry) => {
      const players = entry?.players || [];
      return matchesDiaryCategory(entry, activeCategory) && diaryViewForPlayers(players) === "mine";
    }).length || 0;

  const sharedCount =
    diary?.filter((entry) => {
      const players = entry?.players || [];
      return diaryViewForPlayers(players) === "shared" && matchesDiaryCategory(entry, activeCategory);
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
                  setCategory={handleCategoryChange}
                  disabled={editSaving}
                  fractionTheme={fractionTheme}
                />
              </div>

              <div className="mt-2 col-xl-8 col-lg-8 col-md-12 info-div">
                {/* TOP BAR */}
                <div className="diary-toolbar d-flex align-items-center justify-content-between w-100" style={{ gap: "12px" }}>
                  <div className="segmented-toggle" role="tablist" aria-label="Diary view">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={viewMode === "mine"}
                      aria-pressed={viewMode === "mine"}
                      className={`segmented-toggle__button ${viewMode === "mine" ? "is-active" : ""}`}
                      onClick={handleShowMine}
                      disabled={editSaving}
                    >
                      Private Einträge ({mineCount})
                    </button>

                    <button
                      type="button"
                      role="tab"
                      aria-selected={viewMode === "shared"}
                      aria-pressed={viewMode === "shared"}
                      className={`segmented-toggle__button ${viewMode === "shared" ? "is-active" : ""}`}
                      onClick={handleShowShared}
                      disabled={editSaving}
                    >
                      Gemeinsame Einträge ({sharedCount})
                    </button>
                  </div>

                  <div className="d-flex align-items-center" style={{ flexWrap: "nowrap", marginLeft: "auto" }}>
                    <button
                      type="button"
                      className="btn-add"
                      onClick={handleCreate}
                      disabled={editSaving}
                      title="Neue Notiz"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>

                    <div className="filter-popup-wrap">
                      <button
                        type="button"
                        className="btn-add"
                        onClick={() => setShowFilterPopup((v) => !v)}
                        title="Filter"
                        aria-expanded={showFilterPopup}
                        aria-controls="diary-sort-popup"
                      >
                        <FontAwesomeIcon icon={faFilter} />
                      </button>

                      {showFilterPopup && (
                        <div id="diary-sort-popup" className="filter-sort-popup" role="group" aria-label="Sortierung" style={getOriginAccentStyle(fractionTheme)}>
                          <div className="filter-sort-title">Sortierung</div>
                          <label className="filter-sort-option">
                            <input
                              type="radio"
                              name="diarySort"
                              checked={sortDirection === "desc"}
                              onChange={() => handleSortChange("desc")}
                            />
                            Absteigend
                          </label>

                          <label className="filter-sort-option">
                            <input
                              type="radio"
                              name="diarySort"
                              checked={sortDirection === "asc"}
                              onChange={() => handleSortChange("asc")}
                            />
                            Aufsteigend
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="diary-search">
                  <input
                    type="search"
                    className="form-control dark-filter-control"
                    aria-label="Einträge durchsuchen"
                    placeholder="Text oder Datum (TT.MM.JJJJ) …"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    disabled={editActive}
                    title={editActive ? "Suche ist während der Bearbeitung deaktiviert" : "Suche nach Text oder Erstellungsdatum"}
                  />
                </div>

                {createSuccess && (
                  <div className="diary-submit-success" role="status">
                    Notiz erfolgreich erstellt.
                  </div>
                )}

                {isCreatePopupOpen && (
                  <NotePopup
                  modules={modules}
                    closeCreatePopup={closeCreatePopup}
                    text={text}
                    setText={setText}
                    user={user}
                    userList={userList}
                    share={share}
                    shareWith={shareWith}
                    category={createCategory}
                    setCategory={setCreateCategory}
                    categories={diaryCategories}
                    fractionTheme={fractionTheme}
                    saving={createSaving}
                    saveError={createError}
                    handleCreatePopupSave={handleCreatePopupSave}
                  />
                )}

                {/* CONTENT */}
                <ActiveDiaryCategory
                  diary={sortedDiary}
                  activeCategory={activeCategory}
                  editId={editId}
                  onRemove={onRemove}
                  user={user}
                  userList={userList}
                  fractionTheme={fractionTheme}
                  setViewMode={setViewMode}
                  onDirtyChange={setEditDirty}
                  onSavingChange={setEditSaving}
                  onEditingChange={setEditActive}
                  search={search}
                  onSavedText={(savedText, createdAt) => {
                    if (!matchesDiarySearch(savedText, search, createdAt)) setSearch("");
                  }}
                  requestEditAction={requestEditAction}
                  resetKey={editResetKey}
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
      <Modal
        show={Boolean(pendingDiscard)}
        onHide={() => setPendingDiscard(null)}
        centered
        className="diary-share-modal"
        style={getOriginAccentStyle(fractionTheme)}
        aria-labelledby="diary-discard-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="diary-discard-title">Änderungen verwerfen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deine Änderungen sind noch nicht gespeichert.</Modal.Body>
        <Modal.Footer>
          <Button type="button" className="diary-share-button diary-share-button--cancel" onClick={() => setPendingDiscard(null)}>
            Weiter bearbeiten
          </Button>
          <Button type="button" className="diary-share-button diary-share-button--confirm" onClick={() => {
            const action = pendingDiscard;
            setPendingDiscard(null);
            action();
          }}>
            Änderungen verwerfen
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={Boolean(deleteNoteId)}
        onHide={cancelRemove}
        centered
        className="diary-share-modal"
        style={getOriginAccentStyle(fractionTheme)}
        aria-labelledby="diary-delete-title"
      >
        <Modal.Header closeButton={!deleteSaving}>
          <Modal.Title id="diary-delete-title">Eintrag löschen?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Möchtest du diesen Tagebucheintrag wirklich löschen? Diese Aktion
          kann nicht rückgängig gemacht werden.
          {deleteError && <p role="alert" className="mt-3 mb-0">{deleteError}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="diary-share-button diary-share-button--cancel"
            onClick={cancelRemove}
            disabled={deleteSaving}
          >
            Abbrechen
          </Button>
          <Button
            type="button"
            className="diary-share-button diary-share-button--confirm"
            onClick={confirmRemove}
            disabled={deleteSaving}
          >
            {deleteSaving ? "Wird gelöscht …" : "Löschen"}
          </Button>
        </Modal.Footer>
      </Modal>
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
