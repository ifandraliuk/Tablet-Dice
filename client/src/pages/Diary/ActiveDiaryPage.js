import React, { useMemo } from "react";
import Spinner from "react-bootstrap/Spinner";
import Note from "./Note"; // Pfad ggf. anpassen
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarker, faTrash } from "@fortawesome/free-solid-svg-icons";
const ActiveDiaryCategory = React.memo(function ActiveDiaryCategory({
  diary,
  activeCategory,
  editId,
  onRemove,
  onEdit,
  viewMode,
  emptyText = "Du hast noch keine Notizen",
}) {
  const notes = useMemo(() => {
    if (!Array.isArray(diary)) return [];
    return diary
      .filter((note) => note.category === activeCategory)
      .filter((note) => {
        if (viewMode === "mine") {
          return note.players?.length === 1;
        }
        return true; // "shared" / "all"
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

  return (
    <div className="">
      <div className="row mt-2"></div>

      {notes.map((note) => (
        <Note
          key={note._id}
          activeCategory={activeCategory}
          note={note}
          editId={editId}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
});

export default ActiveDiaryCategory;
