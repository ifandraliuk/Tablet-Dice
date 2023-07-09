import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarker, faTrash } from "@fortawesome/free-solid-svg-icons";
function Note(props) {
  const { note, onEdit, editId, onRemove } = props;
  const { players, category, text } = note;

  return (
    <div className="row ">
      <div className="col-lg-3 col-xl-3   col-md-11  d-flex justify-content-end">
        <div className="col-lg-auto d-flex profile-card  mt-auto mb-auto justify-content-end">
          {players.map((player) => {
            const originName = player?.general?.origin.split(" ");
            const origin = originName[originName?.length - 1];
            return (
              <div key={player._id}>
                <picture>
                  <img
                    className={`profile-img ${origin}-border`}
                    src={`/user/${player._id}.jpeg`}
                    alt={`${player.name}`}
                  />
                </picture>
              </div>
            );
          })}
        </div>
      </div>
      <div className="col-lg-8 col-xl-8 col-md-11 note-body diary-border">
        {editId === note._id ? <strong>Diese Notiz wird oben auf der Seite bearbeitet</strong> : <></>}
        <div className="row">
          <div className="col-auto">
            {category ? (
              <div className={` ${category}`}>{category}</div>
            ) : (
              <div>KEINE</div>
            )}
          </div>
          <div className="col-auto d-flex justify-content-end">
            <div className="button-group d-flex">
              <button className="btn-edit" id={note._id} onClick={onEdit}>
                <FontAwesomeIcon icon={faMarker} />
              </button>
              <button className="btn-remove" id={note._id} onClick={onRemove}>
                <FontAwesomeIcon icon={faTrash} />
              </button>{" "}
            </div>
          </div>
        </div>
        <div>
          <p dangerouslySetInnerHTML={{__html:text}}></p>
        </div>
      </div>
    </div>
  );
}

export default Note;
