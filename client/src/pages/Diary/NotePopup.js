import React from "react";
import ReactQuill from "react-quill";
import { motion } from "framer-motion";

const defaultModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
  ],
};

const NotePopup = ({
  closeCreatePopup,
  text,
  setText,
  user,
  userList,
  share,
  setSave,
  activeCategory,
  onClick,
  onRemove,
  handleCreatePopupSave,
  modules = defaultModules,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="note-popup-backdrop"
      onClick={closeCreatePopup}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="note-popup"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, 90vw)",
          background: "#1d1d1d",
          borderRadius: "12px",
          padding: "1rem",
          boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <h5 style={{ margin: 0 }}>Neue Notiz</h5>
          <button
            type="button"
            className="btn-close"
            onClick={closeCreatePopup}
            style={{ background: "transparent", color: "#fff" }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <ReactQuill
            modules={modules}
            value={text || ""}
            onChange={setText}
            style={{ background: "#101010", color: "#fff" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "0.5rem",
          }}
        >
          <button
            type="button"
            className="btn-cancel"
            onClick={closeCreatePopup}
          >
            Abbrechen
          </button>

          <button
            type="button"
            className="btn-save"
            onClick={() => {
              handleCreatePopupSave();
            }}
          >
            Speichern
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotePopup;
