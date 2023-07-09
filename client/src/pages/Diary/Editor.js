import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../Styles/Editor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareNodes,
  faFloppyDisk,
  faMarker,
} from "@fortawesome/free-solid-svg-icons";

const modules = {
    toolbar: [
        [{ 'header': [4] }],
        [{ size: [ 'small', false, 'large']}],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image']
    ]
}

const Editor = ({
  text, // user text input
  setText,
  user, // user id for sharing options
  userList, // list of all users
  edit, // edit mode is active or not
  share, // note shared with users
  setSave, // save note
  activeCategory, // chosen category
  onClick, // share with users
  onSubmit,
}) => {
  const [shareActive, setShare] = useState(false);
  const shareOptions = () => {
    setShare((shareActive) => !shareActive);
    if (activeCategory?.length > 0) {
      document.getElementById(activeCategory).focus();
    }
  };
  return (
    <div>
      {" "}
      <form id="journal" onSubmit={onSubmit}>
        <div className="w-auto h-auto  p-2 mb-2 dark-bg">
          {/*           
            <textarea
            id="textarea-note"
            type="text"
            cols="40"
            rows="5"
            onChange={onChange}
            value={text}
          ></textarea> 
          */}
          <ReactQuill
          modules={modules}
            onChange={setText}
            value={text}
          />
       
          <div className="row info-row ">
            <div className="col-lg-auto col-md-1">
              <button className="btn-edit" onClick={shareOptions}>
                <FontAwesomeIcon icon={faShareNodes} />
              </button>
            </div>
            <div className="col-xl-auto col-lg-auto col-md-8">
              {activeCategory?.length === 0 ? (
                <div>Kategorie nicht gewählt</div>
              ) : (
                <h5 className={`${activeCategory} `}>{activeCategory}</h5>
              )}
            </div>
            <div className="col-lg-auto m-0 p-0 col-md-2">
              {activeCategory.length === 0 ? (
                <button className="btn-save" disabled>
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
              ) : edit ? (
                <button
                  className="btn-save"
                  type="submit"
                  onClick={() => {
                    setSave(true);
                    setShare(false);
                  }}
                >
                  <FontAwesomeIcon icon={faMarker} />
                </button>
              ) : (
                <button
                  className="btn-save"
                  type="submit"
                  onClick={() => {
                    setSave(true);
                    setShare(false);
                  }}
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
              )}
            </div>
          </div>
          {shareActive && (
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
          )}
        </div>
      </form>
    </div>
  );
};

export default Editor;
