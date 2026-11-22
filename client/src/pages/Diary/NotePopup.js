import React, { useState } from "react";
import ReactQuill from "react-quill";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import ShareDialog from "./ShareDialog";
import { getOriginAccentStyle } from "../../data/OriginColors";
import { getSharingInfo } from "./sharingInfo";
import "../../Styles/Editor.css";

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
  shareWith,
  category,
  setCategory,
  categories,
  fractionTheme,
  saving,
  saveError,
  handleCreatePopupSave,
  modules = defaultModules,
}) => {
  const [shareOpen, setShareOpen] = useState(false);
  const sharing = getSharingInfo(share, user?._id);
  return (
    <>
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
          ...getOriginAccentStyle(fractionTheme),
          width: "min(560px, 90vw)",
          maxHeight: "90vh",
          overflowY: "auto",
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
            disabled={saving}
            aria-label="Schließen"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="note-category" className="form-label">Kategorie:</label>
          <select
            id="note-category"
            className="form-select dark-filter-control"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={saving}
          >
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <ReactQuill
            modules={modules}
            value={text || ""}
            onChange={setText}
            style={{ background: "#101010", color: "#fff" }}
          />
        </div>

        <Button type="button" className="diary-share-button diary-share-button--cancel diary-create-share" onClick={() => setShareOpen(true)} disabled={saving} title={`Freigabe bearbeiten: ${sharing.label}`} aria-label={`Mitspieler +: ${sharing.label}`}>
          <span>Mitspieler +</span>
          <FontAwesomeIcon icon={faUserGroup} aria-hidden="true" />
        </Button>
        {saveError && <p role="alert">{saveError}</p>}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "0.5rem",
          }}
        >
          <Button
            type="button"
            className="diary-share-button diary-share-button--cancel"
            onClick={closeCreatePopup}
            disabled={saving}
          >
            Abbrechen
          </Button>

          <Button
            type="button"
            className="diary-share-button diary-share-button--confirm"
            disabled={saving}
            onClick={() => {
              handleCreatePopupSave();
            }}
          >
            {saving ? "Speichern …" : "Speichern"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
    <ShareDialog
      show={shareOpen}
      onHide={() => setShareOpen(false)}
      selectedPlayers={share}
      onConfirm={(players) => {
        shareWith(players);
        setShareOpen(false);
      }}
      user={user}
      userList={userList}
      fractionTheme={fractionTheme}
    />
    </>
  );
};

export default NotePopup;
