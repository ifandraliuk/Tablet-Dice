import React from "react";
import Welles from "./Welles";
import Ethelion from "./Ethelion";
import Algor from "./Algor";
import Beltamor from "./Beltamor";
import Medorien from "./Medorien";
import Thornheim from "./Thornheim";
import Thamor from "./Thamor";

const Fraction = ({ fraction }) => {
  const bgAnimation = {
    init: {
      y: -500,
      overflow: "hidden",
    },
    visible: {
      y: 0,
      transition: {
        duration: 2,
      },
    },
  };
  const detailsLogo = {
    init: {
      scale: 0,
    },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        damping: 5,
        delay: 1.5,
      },
    },
  };
  const mainLogo = {
    init: {
      scale: 0,
    },
    visible: {
      scale: 1,

      transition: {
        delay: 1.2,
      },
    },
  };
  const lightsAnimation = {
    init: {
      opacity: 0,
    },
    visible: {
      opacity: "20%",

      transition: {
        duration: 2.2,
        delay: 1.4,
      },
    },
  };
  if (fraction === "Algor"){
    return (
      <Algor
        bgAnimation={bgAnimation}
        mainLogo={mainLogo}
        detailsLogo={detailsLogo}
        lightsAnimation={lightsAnimation}
        alt=""
      />
    );
  } else if (fraction === "Beltamor") {
    return (
    <Beltamor
    bgAnimation={bgAnimation}
    mainLogo={mainLogo}
    detailsLogo={detailsLogo}
    lightsAnimation={lightsAnimation}
  />
    )
  } else if (fraction === "Ethelion"){
    return (
      <Ethelion
        bgAnimation={bgAnimation}
        mainLogo={mainLogo}
        detailsLogo={detailsLogo}
        lightsAnimation={lightsAnimation}
      />
    );
  } else if (fraction === "Medorien") {
    return (
      <Medorien
        bgAnimation={bgAnimation}
        mainLogo={mainLogo}
        detailsLogo={detailsLogo}
        lightsAnimation={lightsAnimation}
      />
    );
  }  else if (fraction === "Thornheim") {
    return (
      <Thornheim
        bgAnimation={bgAnimation}
        mainLogo={mainLogo}
        detailsLogo={detailsLogo}
        lightsAnimation={lightsAnimation}
      />
    );
  } else if (fraction === "Welles") {
    return (
      <Welles
        bgAnimation={bgAnimation}
        mainLogo={mainLogo}
        detailsLogo={detailsLogo}
        lightsAnimation={lightsAnimation}
      />
    );
  }  else if (fraction === "Thamor") {
    return (
      <Thamor
        bgAnimation={bgAnimation}
        mainLogo={mainLogo}
        detailsLogo={detailsLogo}
        lightsAnimation={lightsAnimation}
      />
    );
  } 
};

export default Fraction;
