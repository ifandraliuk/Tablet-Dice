import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../Styles/Editor.css";
import originColors, { getOriginAccentStyle } from "../../data/OriginColors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Modal } from "react-bootstrap";
import {
  faFloppyDisk,
  faMarker,
  faUserGroup,
  faPlus,
  faCancel,
} from "@fortawesome/free-solid-svg-icons";

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
  note = {},
  draftText = "",
  setDraftText,
  user,
  userList,
  edit,
  editId,
  share = [],
  shareWith,
  fractionTheme,
  setSave,
  activeCategory,
  onClick,
  onSubmit,
  onRemove,
  onCancelEdit,
}) {
  const safePlayers = Array.isArray(note?.players) ? note.players : [];
  const safeShare = Array.isArray(share) ? share : [];
  const safeUserList = Array.isArray(userList) ? userList : [];
  const selectablePlayers = safeUserList.filter((player) => {
    const playerId = player?._id ?? player?.id;
    return playerId && String(playerId) !== String(user?._id);
  });

  const createdAtValue = note?.createdAt;
  const createdAtDate =
    createdAtValue && !Number.isNaN(new Date(createdAtValue).getTime())
      ? new Date(createdAtValue)
      : null;

  const createdLabel = createdAtDate
    ? new Intl.DateTimeFormat("de-DE", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(createdAtDate)
    : "Ohne Datum";

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

  const [shareOpen, setShareOpen] = useState(false);
  const [shareDraft, setShareDraft] = useState([]);

  const openShare = () => {
    const selectedPlayers = edit ? safePlayers : safeShare;
    setShareDraft(
      selectedPlayers.map((player) =>
        String(player?._id ?? player?.id ?? player),
      ),
    );
    setShareOpen(true);
  };

  const cancelShare = () => {
    setShareOpen(false);
  };

  const confirmShare = () => {
    shareWith(shareDraft);
    setShareOpen(false);
  };
  const toggleUser = (id) => {
    setShareDraft((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div>
      <div>
        <div className="col-lg-11 d-flex align-items-center justify-content-end mb-2">
         {/*  <h2 className={`note-date ${activeCategory}-icon`}>{createdLabel}</h2> */}

          <div className="d-flex">
            <button title="Teilen" onClick={openShare}>
              <FontAwesomeIcon icon={faUserGroup} />
              {`${safePlayers.length ?? 1} `}
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              className="btn-save"
              type="submit"
              form="journal"
              disabled={activeCategory?.length === 0}
              onClick={() => {
                setSave(true);
              }}
              title="Speichern"
            >
              <FontAwesomeIcon icon={edit ? faFloppyDisk : faMarker} />
            </button>
            {editId && (
              <button
                type="button"
                className="btn-remove"
                onClick={onCancelEdit}
                title="Verwerfen"
              >
                <FontAwesomeIcon icon={faCancel} />
              </button>
            )}
          </div>
        </div>
        <div className="col-lg-11 col-xl- col-md-11 ms-5 mb-4">
          <form id="journal" onSubmit={onSubmit}>
            <div className="w-auto h-auto  p-2 mb-2">
              <ReactQuill
                modules={modules}
                onChange={setDraftText}
                value={draftText}
              />
            </div>
          </form>
        </div>
      </div>
      <Modal
        show={shareOpen}
        onHide={cancelShare}
        centered
        className="diary-share-modal"
        dialogClassName="diary-share-dialog"
        style={getOriginAccentStyle(fractionTheme)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Notiz teilen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectablePlayers.length === 0 ? (
            <p className="mb-0">Keine weiteren Spieler vorhanden.</p>
          ) : (
            <Form>
              {selectablePlayers.map((player) => {
                const playerId = String(player._id ?? player.id);
                const playerName = player.name ?? player.username ?? playerId;
                const fallbackImage = `/race/${
                  player.sex === "männlich" ? "m" : "w"
                }/${player.kind || "Mensch"}.png`;
                const originName = player.origin?.trim().split(/\s+/).pop();
                return (
                  <Form.Check
                    key={playerId}
                    id={`share-player-${playerId}`}
                    type="checkbox"
                    label={
                      <span className="diary-share-player">
                        <img
                          className="diary-share-player__image"
                          src={`/user/${playerId}.jpeg`}
                          alt=""
                          loading="lazy"
                          style={{
                            "--player-origin-color":
                              originColors[originName] || "rgb(249, 199, 79)",
                          }}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = fallbackImage;
                          }}
                        />
                        <span className="diary-share-player__details">
                          <span className="diary-share-player__name">
                            {playerName}
                          </span>
                          <span className="diary-share-player__meta">
                            Level {player.level ?? "?"} ·{" "}
                            {player.userclass || "Nicht angegeben"}
                          </span>
                        </span>
                      </span>
                    }
                    checked={shareDraft.includes(playerId)}
                    onChange={() => toggleUser(playerId)}
                  />
                );
              })}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="diary-share-button diary-share-button--cancel"
            onClick={cancelShare}
          >
            Abbrechen
          </Button>
          <Button
            type="button"
            className="diary-share-button diary-share-button--confirm"
            onClick={confirmShare}
          >
            Übernehmen
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Editor;
