import React from "react";
import { useDispatch } from "react-redux";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import MotionButton from "../../components/MotionButton";
import { setActiveHabitat } from "../../features/atlas/atlasSlice";

const HabitatInfo = ({ habitat, kingdom }) => {
  const { name } = habitat;
  const dispatch = useDispatch();
  const habitatActive = () => {
    dispatch(setActiveHabitat({ id: habitat._id }));
  };

  return (
    <article className={`container atlas-habitat-summary atlas-kingdom--${kingdom}`}>
      <div className="row mb-4 atlas-habitat-summary__layout">
        <div className="col-12 col-md-4 atlas-habitat-summary__visual">
          <img
            alt=""
            className="img-habitat"
            src={`habitat/${kingdom}/${habitat._id}.png`}
          />
        </div>

        <div className="col-12 col-md-8 atlas-habitat-summary__details">
          <h1>{name}</h1>
          <p>{habitat.description}</p>
          <div className="row">
            <div className="col-auto">
              <MotionButton
                content="Habitat ansehen"
                name={habitat._id}
                icon={faArrowRight}
                onClick={habitatActive}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HabitatInfo;
