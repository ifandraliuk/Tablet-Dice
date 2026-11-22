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
import { register } from "../../features/auth/AuthSlice";
import { Link, useNavigate } from "react-router-dom";
import { getOriginAccentStyle } from "../../data/OriginColors";
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
    origin: "Herkunft",
    general: "Allgemein",
    profession: "Profession",
    attributes: "Attribute",
  };
  const {
    generalInfo,
    attributes,
    activeOrigin,
    cuttedOrigin,
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
    <main className="create-page" style={cuttedOrigin ? getOriginAccentStyle(cuttedOrigin) : undefined}>
      {visible && (
        <CreateWindow onSubmit={onSubmit} onClose={() => setVisible(false)} origin={cuttedOrigin} />
      )}
      <div className="create-shell">
        <header className="create-header">
          <Link to="/" className="create-back">← Zur Anmeldung</Link>
          <span className="create-header__eyebrow">Tablet &amp; Dice</span>
          <h1>Deinen Charakter erstellen</h1>
          <p>Gestalte Schritt für Schritt deinen Charakter. Deine Auswahl bleibt beim Wechsel zwischen den Bereichen erhalten.</p>
        </header>
        <nav className="create-steps" aria-label="Schritte der Charaktererstellung">
          {Object.keys(categoryNames).map((menuName) => (
              <button
                type="button"
                className={`create-step ${partActive === menuName ? "is-active" : ""}`}
                name={menuName}
                aria-current={partActive === menuName ? "step" : undefined}
                onClick={(e) => dispatch(setActive(e.currentTarget.name))}
                key={menuName}
              >
                <span>{categoryNames[menuName]}</span>
                <span className="create-step__status">{completionFlags[menuName] ? "Abgeschlossen" : "Offen"}</span>
                <FontAwesomeIcon
                  icon={completionFlags[menuName] ? faCircleCheck : faWarning}
                  aria-hidden="true"
                  className={
                    completionFlags[menuName] ? " ms-2 success" : "ms-2 warning"
                  }
                />
              </button>
          ))}
            <button
              type="button"
              className={`create-step ${partActive === "completion" ? "is-active" : ""}`}
              name="completion"
              aria-current={partActive === "completion" ? "step" : undefined}
              onClick={(e) => dispatch(setActive(e.currentTarget.name))}
              disabled={completionFlags.complete ? false : true}
            >
              <span>Namensgebung</span>
              <span className="create-step__status">{completionFlags.complete ? "Bereit" : "Noch gesperrt"}</span>
              <FontAwesomeIcon
                icon={completionFlags.complete ? faCircleCheck : faCircleXmark}
                aria-hidden="true"
                className={completionFlags.complete ? " ms-2 success" : "ms-2"}
              />
            </button>
        </nav>
        <section className="create-content" aria-labelledby="create-section-title">
          <h2 id="create-section-title">{categoryNames[partActive] || "Namensgebung"}</h2>
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
        </section>
      </div>
    </main>
  );
}

export default CreateCharacter;
//partActive === "completion" && completionFlags.complete ? disabled={completionFlags.complete ? false: true}
