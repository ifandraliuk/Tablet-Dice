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
  const {
    note,
    onEdit,
    editId,
    onRemove,
    activeCategory,
    submitMessage = "",
  } = props;
  const { players, category, text, createdAt } = note;
  const [draftText, setDraftText] = useState(note.text);
  const isEditing = editId === note._id;

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
    if (isEditing) setDraftText(note.text);
  }, [isEditing, note.text]);

  const createdAtDate = note?.createdAt ? new Date(note.createdAt) : null;
  const dateText = createdAtDate
    ? createdAtDate.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";
  const timeText = createdAtDate
    ? createdAtDate.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="row mt-1">
      <div className="col-lg-11">
        <div className="note-header d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center ">
            {submitMessage && (
              <div className="diary-submit-success diary-submit-success--inline">
                {submitMessage}
              </div>
            )}
          </div>

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
                <span className="share-chip-count">{players.length}</span>
                <FontAwesomeIcon icon={faUserGroup} />
              </button>
            </OverlayTrigger>

            <div >
              {isEditing ? (
                <button type="button" className="btn-save" id={note._id}>
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

        <div className="note-meta">
          {dateText && <span className="note-date">{dateText}</span>}
          {timeText && <span className="note-time">{timeText}</span>}
        </div>
      </div>
    </div>
  );
}

export default Note;
