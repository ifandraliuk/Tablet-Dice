import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import Fraction from "../../components/Fraction";
import { setUserImage } from "../../features/creation/creationSlice";
import { allAttributes } from "../../data/ConstVariables";
import AbilityCard from "../../components/AbilityCard";
import ExclamationMark from "../../components/ExclamationMark";
import CreateCharacter from ".";

function Overview({onClick}) {
  const dispatch = useDispatch();
  const {
    activeProfession,
    activeAbility,
    specs,
    professionList,
    generalInfo,
    cuttedOrigin,
    attributes,
    userImage,
  } = useSelector((state) => state.creation);

  const generalInfoNames = {
    age: "Alter",
    sex: "Geschlecht",
    kind: "Spezie",
    eyecolor: "Augenfarbe",
    haircut: "Frisur",
    haircolor: "Haarfarbe",
    more: "Besndere Merkmale",
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    dispatch(setUserImage(base64));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  return (
    <div className="container">
      <div className="row mt-2">
        <div className="col-xl-3 col-lg-3 col-md-12 d-flex flex-column align-items-center">
          <img
            alt="Kind"
            style={{ width: "100%" }}
            src={userImage ? userImage : `/race/${generalInfo?.sex === "männlich" ? "m" : "w"}/${
              generalInfo?.kind
            }.png`}
          />
          <input
            type="file"
            name="img"
            onChange={handleFileChange}
          />
          <Fraction fraction={cuttedOrigin} />
        </div>
        <div className="col-xl-8 col-lg-8 col-md-12">
          <div className="row">
            <h4>Attribute</h4>
            <div className="row">
              {Object.keys(allAttributes).map((attr) => (
                <div className="col-auto" key={attr}>
                  <div>{allAttributes[attr]} </div>
                  <span className={`${cuttedOrigin}-text`}>{attributes[attr]}</span>
                </div>
              ))}
            </div>
            <h4 className="mt-2">Profession</h4>
            <div className="row">
              <div className="col-4">
                <AbilityCard
                  ability={activeProfession?.abilities?.find(
                    (el) => el._id === activeAbility
                  )}
                  userclass={activeProfession?._id}
                  buttonText="Activ"
                  customClick={() => {}}
                />
              </div>
              <div className="col-8">
                <h4>{activeProfession?.name}</h4>
                <p className="ms-2">{activeProfession?.description}</p>
                <p>
                  {`Spezialisierung: `}{" "}
                  <span className={`${cuttedOrigin}-text`}>
                    {
                      activeProfession?.abilities?.find(
                        (el) => el._id === activeAbility
                      )?.specialization
                    }
                  </span>
                </p>
                <p className="ms-2">{activeProfession?.advantages}</p>
                <h4>Allgemeines</h4>
                <ul>
                  {Object.keys(generalInfoNames).map((name) => (
                    <li
                      key={name}
                    >{`${generalInfoNames[name]}: ${generalInfo[name]}`}</li>
                  ))}
                </ul>
                <div className="row">
                  <div className="col-auto">
                     <ExclamationMark />
                  </div>
                  <div className="col-auto">
                    <button className="btn-light" onClick={onClick}>Auswahl bestätigen</button>
                  </div>
                  </div>
                
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="col-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
