import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../Styles/Editor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faUserGroup, faPlus, faCancel } from "@fortawesome/free-solid-svg-icons";
import ShareDialog from "./ShareDialog";
import NoteDate from "./NoteDate";
import { getSharingInfo } from "./sharingInfo";

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

function Editor({
  draftText, setDraftText, user, userList, share, shareWith, fractionTheme,
  activeCategory, onSubmit, onCancelEdit, saving, saveError, note,
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const sharing = getSharingInfo(share, user?._id);

  return (
    <article className="diary-note diary-note--editing">
      <header className="diary-note__header">
        <NoteDate createdAt={note?.createdAt} />
        <div className="diary-note__actions">
          <button type="button" className="share-chip" title="Teilen" aria-label={`Freigabe bearbeiten: ${sharing.label}`} onClick={() => setShareOpen(true)} disabled={saving}>
            <FontAwesomeIcon icon={faUserGroup} aria-hidden="true" />
            <span className="share-chip-count">{sharing.label}</span>
            <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
          </button>
          <button
            className="btn-save"
            type="submit"
            form="journal"
            disabled={!activeCategory?.length || saving}
            title="Speichern"
            aria-label="Eintrag speichern"
          >
            <FontAwesomeIcon icon={faFloppyDisk} aria-hidden="true" />
          </button>
          <button type="button" className="btn-remove" onClick={onCancelEdit} disabled={saving} title="Verwerfen" aria-label="Bearbeitung verwerfen">
            <FontAwesomeIcon icon={faCancel} aria-hidden="true" />
          </button>
        </div>
      </header>
      <div>
        <form id="journal" onSubmit={onSubmit}>
          <div className="mb-2">
            <ReactQuill modules={modules} onChange={setDraftText} value={draftText} />
          </div>
          {saveError && <p role="alert">{saveError}</p>}
        </form>
      </div>
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
    </article>
  );
}

export default Editor;
