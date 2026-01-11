import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarker, faTrash } from "@fortawesome/free-solid-svg-icons";
function Note(props) {
  const { note, onEdit, editId, onRemove, activeCategory } = props;
  const { players, category, text, createdAt } = note;

  return (
    <div className="row mt-1">
      <h2 className={`${activeCategory}-icon`}>
        {" "}
        {new Intl.DateTimeFormat("de-DE", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(note.createdAt))}
      </h2>
      <div className="col-lg-10 col-xl- col-md-11 ms-5 mb-4">
        <div className="row">
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
          <p dangerouslySetInnerHTML={{ __html: text }}></p>
        </div>
      </div>
    </div>
  );
}

export default Note;
