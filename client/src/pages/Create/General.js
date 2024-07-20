import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MotionButton from "../../components/MotionButton";
import {
  isGeneralComplete,
  setGeneralInfo,
} from "../../features/creation/creationSlice";
import {
  races,
  racesList
} from "../../data/ConstVariables";
import { faMars, faVenus } from "@fortawesome/free-solid-svg-icons";
function General() {
  const dispatch = useDispatch();
  const { generalInfo } = useSelector((state) => state.creation);
  const { age, sex, kind, eyecolor, haircut, haircolor, more } = generalInfo;

  const setData = (name, value) => {
    dispatch(setGeneralInfo({ name: name, value: value }));
  };

  useEffect(() => {
    dispatch(isGeneralComplete());
  }, [dispatch, age, sex, kind, eyecolor, haircut, haircolor, more]);
  return (
    <div className="container">
    <div className="row mt-2">
      <div className="alert info">
        Du erwachst vom Kitzeln eines Sonnenstrahls auf deiner Haut, du stehst
        auf und schaust in den Spiegel. Wen siehst du?
      </div>
      <div className="row">
        {racesList.map((kindName) => (
          <div className="col-auto" key={kindName}>
            <MotionButton
              name={kindName}
              content={kindName}
              theme={kind === kindName ? "Thornheim" : ""}
              onClick={(e) => setData("kind", e.target.name)}
            />
          </div>
        ))}
      </div>

      <div className="row ">
        <div className="col-xl-3 col-lg-3 col-md-12">
          <img
            alt="Kind"
            style={{ width: "100%" }}
            src={`/race/${sex === "männlich" ? "m" : "w"}/${
              kind ? kind : "Elb"
            }.png`}
          />
          <div className="row">
            <div className="col-auto">
              <MotionButton
                name="männlich"
                icon={faMars}
                theme={sex === "männlich" ? "Beltamor" : ""}
                onClick={(e) => setData("sex", e.target.name)}
              />
            </div>
            <div className="col-auto">
              <MotionButton
                name="weiblich"
                icon={faVenus}
                theme={sex === "weiblich" ? "Algor" : ""}
                onClick={(e) => setData("sex", e.target.name)}
              />
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 border-pattern left">
          <div className="row m-2">
            <h4>Beschreibung</h4>
            <p className="ms-2">
              {races[kind ? kind : ""]?.descr}
            </p>
            <h4>Spezielle Fertigkeit</h4>
            <u className="Thornheim-text mt-2">{`${races[kind].ability.name}: `}</u>
            <p className="ms-3">{races[kind].ability.descr}</p>
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-12">
          <form>
            <div className="row">
              <label htmlFor="age">Alter:<span className="required-asterisk">*</span></label>{" "}
            </div>
            <div className="row ms-2">
              <input
                className="Thornheim-text"
                type="number"
                id="age"
                required
                value={age}
                onChange={(e) =>
                  setData(e.currentTarget.id, parseInt(e.currentTarget.value))
                }
              ></input>
            </div>
            <div className="row mt-3">
              <label htmlFor="age">Augenfarbe<span className="required-asterisk">*</span></label>{" "}
            </div>
            <div className="row ms-2">
              <input
                className="Thornheim-text"
                type="text"
                id="eyecolor"
                required
                value={eyecolor}
                onChange={(e) =>
                  setData(e.currentTarget.id, e.currentTarget.value)
                }
              ></input>
            </div>
            <div className="row mt-3">
              <label htmlFor="age">Frisur:<span className="required-asterisk">*</span></label>{" "}
            </div>
            <div className="row ms-2">
              <input
                className="Thornheim-text"
                type="text"
                id="haircut"
                required
                value={haircut}
                onChange={(e) =>
                  setData(e.currentTarget.id, e.currentTarget.value)
                }
              ></input>
            </div>
            <div className="row mt-3">
              <label htmlFor="age">Haarfarbe:<span className="required-asterisk">*</span></label>{" "}
            </div>
            <div className="row ms-2">
              <input
                className="Thornheim-text"
                type="text"
                id="haircolor"
                required
                value={haircolor}
                onChange={(e) =>
                  setData(e.currentTarget.id, e.currentTarget.value)
                }
              ></input>
            </div>
            <div className="row mt-3">
              <label htmlFor="age">Besondere Merkmale: </label>{" "}
            </div>
            <div className="row ms-2">
              <input
                className="Thornheim-text"
                type="text"
                id="more"
                value={more}
                onChange={(e) =>
                  setData(e.currentTarget.id, e.currentTarget.value)
                }
              ></input>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default General;
