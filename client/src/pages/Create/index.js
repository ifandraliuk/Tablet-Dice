import React, { useEffect, useState } from "react";
import "../../Styles/Create.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import {
  createCharacter,
  isComplete,
  resetCreation,
  // uploadPicture,
  // createCharacter,
  setActive,
  uploadPicture,
} from "../../features/creation/creationSlice";
import { registationFullfilled, register } from "../../features/auth/AuthSlice";
import { getFraction, getPlayer } from "../../features/player/playerSlice";
import { useNavigate } from "react-router-dom";
import {
  faCircleCheck,
  faCircleXmark,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import General from "./General";
import Profession from "./Profession";
import Origin from "./Origin";
import Attributes from "./Attributes";
import Overview from "./Overview";
import CreateWindow from "./CreateWindow";
function CreateCharacter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoryNames = {
    general: "Allgemein",
    origin: "Herkunft",
    profession: "Profession",
    attributes: "Attribute",
  };
  const {
    generalInfo,
    attributes,
    activeOrigin,
    activeProfession,
    activeAbility,
    userImage,
    totalPoints,
    partActive,
    completionFlags,
    imageUploaded,
    dataFilled,
  } = useSelector((state) => state.creation);

  const [visible, setVisible] = useState(false);
  const { user, isSuccess, isError } = useSelector(
    (state) => state.auth
  );
  // const [image, targetImage] = useState("");

  useEffect(() => {
    dispatch(isComplete());
  }, [dispatch, completionFlags]);

  useEffect(() => {
    if (isSuccess) {
      const fullGeneral = {
        ...generalInfo,
        origin: activeOrigin,
      };
      const fullInfo = {
        user: user,
        general: fullGeneral,
        attributes: attributes,
        pointsLeft: totalPoints,
        userclass: activeProfession?._id,
        activeAbility: activeAbility,
      };
      dispatch(createCharacter(fullInfo));
    }
  }, [
    isSuccess,
    isError,
    user,
    activeOrigin,
    activeAbility,
    activeProfession?._id,
    attributes,
    generalInfo,
    totalPoints,
    dispatch,
  ]);

  useEffect(() => {
    if (dataFilled && userImage) {
      const formData = new FormData();
      // Convert base64 string to Blob object
      const byteCharacters = atob(userImage.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blobUserImage = new Blob([byteArray], { type: "image/jpeg" });
      // const img = new Blob([userImage])
      formData.append("img", blobUserImage, `${user?._id}.jpeg`);
      dispatch(uploadPicture(formData));
    }
  }, [dataFilled, userImage, user?._id, dispatch]);

  useEffect(() => {
    if (isSuccess && dataFilled && imageUploaded) {
      dispatch(resetCreation());
      dispatch(getFraction())
      navigate("/player");
    }
  }, [isSuccess, dataFilled, imageUploaded, dispatch, navigate]);
  // const setImage = (e) => {
  //   console.log(e.target.files);
  //   targetImage(e.target.files[0]);
  // };
  // const setData = (name, value) => {
  //   dispatch(setInfo({ name: name, value: value }));
  // };

  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("img", image, `${user._id}.jpeg`);
  //   const fullInfo = {
  //     //fullinfo
  //     age: data.age,
  //     haircolor: data.haircolor,
  //     sex: data.sex,
  //     eyecolor: data.eyecolor,
  //     origin: data.origin,
  //     haircut: data.haircut,
  //     kind: data.kind,
  //     //userclass
  //     userclass: data.userclass,
  //     attributes: attributes,
  //   };
  //   console.log(fullInfo);
  //   dispatch(createCharacter(fullInfo));
  //   console.log(dataFilled, imageUploaded);
  //   dispatch(uploadPicture(formData));
  //   console.log(dataFilled, imageUploaded);
  // };
  const onSubmit = (e, formData) => {
    e.preventDefault();
    if (isError || !user) {
      const { name, pwd, check } = formData;
      if (pwd !== check) {
        console.log("pwd!=check");
        window.alert("Passwörter sind nicht identisch!");
      } else {
        dispatch(register(formData));
      }
    }
  };
  return (
    <div className="bg general-bg create-page">
      {visible && (
        <CreateWindow onSubmit={onSubmit} onClose={() => setVisible(false)} />
      )}
      <div className="container-fluid  g-5">
        <div className="row menu">
          {Object.keys(categoryNames).map((menuName) => (
            <div className="col-auto" key={menuName}>
              <button
                name={menuName}
                onClick={(e) => dispatch(setActive(e.currentTarget.name))}
              >
                {categoryNames[menuName]}
                <FontAwesomeIcon
                  icon={completionFlags[menuName] ? faCircleCheck : faWarning}
                  className={
                    completionFlags[menuName] ? " ms-2 success" : "ms-2 warning"
                  }
                />
              </button>
            </div>
          ))}
          <div className="col-auto">
            <button
              name="completion"
              onClick={(e) => dispatch(setActive(e.currentTarget.name))}
              disabled={completionFlags.complete ? false : true}
            >
              Namensgebung
              <FontAwesomeIcon
                icon={completionFlags.complete ? faCircleCheck : faCircleXmark}
                className={completionFlags.complete ? " ms-2 success" : "ms-2"}
              />
            </button>
          </div>
        </div>
        <div className="info-div ">
          {partActive === "general" ? (
            <General />
          ) : partActive === "profession" ? (
            <Profession />
          ) : partActive === "origin" ? (
            <Origin />
          ) : partActive === "attributes" ? (
            <Attributes />
          ) : partActive === "completion" && completionFlags.complete ? (
            <Overview onClick={() => setVisible((visible) => !visible)} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCharacter;
//partActive === "completion" && completionFlags.complete ? disabled={completionFlags.complete ? false: true}
