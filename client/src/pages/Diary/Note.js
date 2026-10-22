import React, { useEffect, useState } from "react";
import Popover from "react-bootstrap/Popover";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faMarker,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
function Note(props) {
  const { note, onEdit, editId, onRemove, activeCategory } = props;
  const { players, category, text, createdAt } = note;
  // lokaler Text fürs Editieren (damit nicht alle Notes neu schreiben)
  const [draftText, setDraftText] = useState(note.text);
  const isEditing = editId === note._id;
  const onSave = () => {};

  const popover = (
    <Popover id={`players-popover-${note._id}`}>
      <Popover.Header as="h3">Geteilt mit</Popover.Header>
      <Popover.Body>
        {players.length === 0 ? (
          <div>Nur du</div>
        ) : (
          <ul className="players-list">
            {players.map((p) => (
              <li key={p.id ?? p._id ?? p}>
                {p.name ?? p.username ?? String(p)}
              </li>
            ))}
          </ul>
        )}
      </Popover.Body>
    </Popover>
  );

  useEffect(() => {
    // wenn Edit-Modus geöffnet wird, Draft mit aktuellem Text füllen
    if (isEditing) setDraftText(note.text);
  }, [isEditing, note.text]);
  return (
    <div className="row mt-1">
      <div className="col-lg-11">
        <div className="note-header d-flex align-items-center justify-content-between">
          <h2 className={`note-date ${activeCategory}-icon`}>
            {new Intl.DateTimeFormat("de-DE", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(note.createdAt))}
          </h2>

          <div className="d-flex align-items-center ">
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={popover}
              rootClose
            >
              <button
                type="button"
                className="share-chip"
                title="Geteilte Nutzer anzeigen"
              >
                <FontAwesomeIcon icon={faUserGroup} />
                <span className="share-chip-count">{players.length}</span>
              </button>
            </OverlayTrigger>
            <div className="button-group">
              {isEditing ? (
                <button
                  type="button"
                  className="btn-save"
                  id={note._id}
                  onClick={onSave}
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
              ) : editId === "" ? (
                <button
                  type="button"
                  className="btn-edit"
                  id={note._id}
                  onClick={onEdit}
                >
                  <FontAwesomeIcon icon={faMarker} />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-edit"
                  id={note._id}
                  onClick={onEdit}
                  disabled
                >
                  <FontAwesomeIcon icon={faMarker} />
                </button>
              )}

              <button
                type="button"
                className="btn-remove"
                id={note._id}
                onClick={onRemove}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <p dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      </div>
    </div>
  );
}

export default Note;
