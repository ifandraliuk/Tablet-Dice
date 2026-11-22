import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import originColors, { getOriginAccentStyle } from "../../data/OriginColors";

function ShareDialog({ show, onHide, selectedPlayers, onConfirm, user, userList, fractionTheme }) {
  const [draft, setDraft] = useState([]);
  const selectablePlayers = (userList || []).filter((player) => {
    const id = player?._id ?? player?.id;
    return id && String(id) !== String(user?._id);
  });

  useEffect(() => {
    if (show) setDraft(selectedPlayers.map(String));
  }, [show, selectedPlayers]);

  const toggleUser = (id) => {
    setDraft((previous) =>
      previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="diary-share-modal"
      dialogClassName="diary-share-dialog"
      style={getOriginAccentStyle(fractionTheme)}
      aria-labelledby="diary-share-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="diary-share-title">Notiz teilen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Wähle die Mitspieler, die diesen Eintrag sehen sollen. Du selbst behältst Zugriff.</p>
        {selectablePlayers.length === 0 ? (
          <p className="mb-0">Keine weiteren Spieler vorhanden.</p>
        ) : (
          <Form>
            {selectablePlayers.map((player) => {
              const playerId = String(player._id ?? player.id);
              const playerName = player.name ?? player.username ?? playerId;
              const fallbackImage = `/race/${player.sex === "männlich" ? "m" : "w"}/${player.kind || "Mensch"}.png`;
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
                        style={{ "--player-origin-color": originColors[originName] || "rgb(249, 199, 79)" }}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                      <span className="diary-share-player__details">
                        <span className="diary-share-player__name">{playerName}</span>
                        <span className="diary-share-player__meta">
                          Level {player.level ?? "?"} · {player.userclass || "Nicht angegeben"}
                        </span>
                      </span>
                    </span>
                  }
                  checked={draft.includes(playerId)}
                  onChange={() => toggleUser(playerId)}
                />
              );
            })}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" className="diary-share-button diary-share-button--cancel" onClick={onHide}>
          Abbrechen
        </Button>
        <Button type="button" className="diary-share-button diary-share-button--confirm" onClick={() => onConfirm(draft)}>
          Übernehmen
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ShareDialog;
