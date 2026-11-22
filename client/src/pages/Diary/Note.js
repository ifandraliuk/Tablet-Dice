import React, { useEffect, useMemo, useState } from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faMarker, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getOriginAccentStyle } from "../../data/OriginColors";
import NoteDate from "./NoteDate";
import { getSharingInfo } from "./sharingInfo";
import { diaryPreview } from "./diaryPreview";

function Note({ note, user, fractionTheme, onEdit, editId, onRemove, showCategory, search = "", submitMessage = "" }) {
  const { players, text, createdAt } = note;
  const preview = useMemo(() => diaryPreview(text), [text]);
  const [expanded, setExpanded] = useState(Boolean(search.trim()));
  useEffect(() => {
    setExpanded(Boolean(search.trim()));
  }, [search]);
  const sharing = getSharingInfo(players, user?._id);
  const popover = (
    <Popover
      id={`players-popover-${note._id}`}
      className="diary-players-popover"
      style={getOriginAccentStyle(fractionTheme)}
    >
      <Popover.Header as="h3">{sharing.heading}</Popover.Header>
      <Popover.Body>
        {sharing.players.length === 0 ? (
          <div>{sharing.label === "Nur du" ? "Nur du" : "Keine Teilnehmer angegeben"}</div>
        ) : (
          <ul className="players-list">
            {sharing.players.map((player) => (
              <li key={player.id ?? player._id ?? player}>
                {player.name ?? player.username ?? String(player)}
              </li>
            ))}
          </ul>
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <article className="diary-note">
      <header className="diary-note__header">
        <div className="diary-note__details">
          {showCategory && <span className="diary-note__category">{note.category || "Sonstiges"}</span>}
          <NoteDate createdAt={createdAt} updatedAt={note.updatedAt} />
        </div>
        <div className="diary-note__actions">
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose>
            <button type="button" className="share-chip" title="Freigabe anzeigen" aria-label={`Freigabe anzeigen: ${sharing.label}`}>
              <span className="share-chip-count">{sharing.label}</span>
              <FontAwesomeIcon icon={faUserGroup} aria-hidden="true" />
            </button>
          </OverlayTrigger>
          <button
            type="button"
            className="btn-edit"
            id={note._id}
            onClick={onEdit}
            disabled={editId !== ""}
            title="Eintrag bearbeiten"
            aria-label="Eintrag bearbeiten"
          >
            <FontAwesomeIcon icon={faMarker} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn-remove"
            id={note._id}
            onClick={onRemove}
            title="Eintrag löschen"
            aria-label="Eintrag löschen"
          >
            <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
          </button>
        </div>
      </header>
      {submitMessage && (
        <div className="diary-submit-success diary-submit-success--inline" role="status">
          {submitMessage}
        </div>
      )}
      <div id={`diary-note-text-${note._id}`} className="diary-note__text" dangerouslySetInnerHTML={{ __html: preview && !expanded ? preview : text }} />
      {preview && (
        <button
          type="button"
          className="diary-note__toggle"
          aria-expanded={expanded}
          aria-controls={`diary-note-text-${note._id}`}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Weniger anzeigen" : "Mehr anzeigen"}
        </button>
      )}
    </article>
  );
}

export default Note;
