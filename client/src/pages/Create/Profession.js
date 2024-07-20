import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MotionButton from "../../components/MotionButton";
import {
  getProfessions,
  isProfessionComplete,
  setActiveAbility,
  setActiveProfession,
} from "../../features/creation/creationSlice";
import AbilityCard from "../../components/AbilityCard";
import ExclamationMark from "../../components/ExclamationMark";

function Profession() {
  const dispatch = useDispatch();
  const { activeProfession, availableAbilities, activeAbility, specs, professionList } =
    useSelector((state) => state.creation);
  useEffect(() => {
    if (professionList.length === 0) dispatch(getProfessions());
    dispatch(isProfessionComplete());
  }, [activeProfession, professionList?.length, activeAbility, dispatch]);

  const onAbilityClick = e =>{
    console.log(e.target.name)
    const id = e.currentTarget.name
    dispatch(setActiveAbility(id))
  }
  return (
    <div className="container">
      <div className="row mt-2">
        <div className="alert info">
          Du denkst zurück an deine Ausbildung, all die Übungsstunden die du
          verbracht hast, wie hast du dich spezialisiert?
        </div>
        <div className="row">
          {professionList?.map((professionName) => (
            <div className="col-auto" key={professionName._id}>
              <MotionButton
                name={professionName.name}
                content={professionName.name}
                theme={
                  activeProfession._id === professionName._id ? "Thornheim" : ""
                }
                onClick={(e) => dispatch(setActiveProfession(professionName))}
              />
            </div>
          ))}
        </div>

        <div className="row">
          {activeProfession?.name?.length > 0 && (
            <div className="col-xl-2 col-lg-2 col-md-12">
              <img
                alt="Profession"
                style={{ width: "100%" }}
                src={`/classes_img/${activeProfession._id}.svg`}
              />
            </div>
          )}
          {activeProfession?.name?.length > 0 && (
            <div className="col-xl-6 col-lg-6 col-md-12 border-pattern left">
              <div className="row m-2">
                <h4>Beschreibung</h4>
                <p className="ms-2">{activeProfession.description}</p>
                <h4>Kategorie</h4>
                <p className="Thornheim-text mt-2 ms-2">
                  {activeProfession.category}
                </p>
                <h4>Spezialzierungen</h4>
                <ul className="ms-4">
                  {specs?.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
                <h4>Vorteile</h4>
                <p className=" mt-2 ms-2">{activeProfession.advantages}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-2 d-flex justify-content-end align-items-start">{activeAbility?.length> 0 ? "": <ExclamationMark />}</div>
        <div className="col-10">
           <h4>Wähle deine erste Fertigkeit</h4>

        </div>
        <div className="row">
            {" "}
            {availableAbilities?.map((ability) => (
              <div className="col-3" key={ability._id}>
                <AbilityCard
                  ability={ability}
                  userclass={activeProfession._id}
                  buttonText={activeAbility === ability._id ? "Ausgewählt" : "Wählen"}
                  customClick={onAbilityClick}
                />
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}

export default Profession;
