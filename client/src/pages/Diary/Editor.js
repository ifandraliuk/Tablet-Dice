import React, { useState, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../Styles/Editor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareNodes,
  faFloppyDisk,
  faMarker,
  faTrash,
  faXmark,
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

  const [shareActive, setShare] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareDraft, setShareDraft] = useState([]);

  const shareOptions = () => {
    setShare((shareActive) => !shareActive);
  };
  const openShare = () => {
    setShareDraft(Array.isArray(share) ? [...share] : []);
    setShareOpen(true);
  };

  const cancelShare = () => {
    setShareOpen(false);
    setShareDraft([]); // optional
  };

  const confirmShare = () => {
    setShare(shareDraft);
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
                // setShare(false); // <- du hast setShare als local state, das war vorher ein Bug
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
    </div>
  );
}

export default Editor;
/*            {shareActive && (
              <div className="col-3 border mt-2">
                {userList?.map(
                  (u) =>
                    u.id !== user?._id && (
                      <div className="p-2" key={u.id}>
                        <input
                          type="checkbox"
                          name="users"
                          id={u.id}
                          onChange={onClick}
                          checked={share?.includes(u.id)}
                        />
                        <label htmlFor={u.id}>{u.name}</label>
                        <br />
                      </div>
                    )
                )}
              </div>
            )} */
