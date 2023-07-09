/* PAGES */
const pageTransition = {
    init: {
       scale:0, 
       opacity:1,
    },
    animate: {
      scale:1,
      opacity: 1,
    },
    exit: {
     opacity:0,
     display: "none"
    },
}

/* TABLES */
const tableAnimation = {
  init:{ 
    translateY: 30, 
    opacity: 0 
  },
  animate:{
    translateY: 0,
    opacity: 1,
    
  },
  exit:{
    backgroundColor: "rgba(221, 85, 85, 0.8)",
    scale: 0,
    transition: {
      duration: 0.2,
      when:"afterChildren"
    },
  }
}

/*LISTS*/

const listAnimation = {
  init: {
    scale: 0,
    x: -100,
  },
  animate: {
    scale:1,
    x: 0,
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  }
}
/** BUTTONS */


const buttonAnimation = {
    init: {
      scale: 0
    },
    result:{
      scale: 1 
    },
    hover:{
      borderRadius: 50, 
      scale: 1.2
    }
  }
const buttonActive = {
  inactive: {
    boxShadow: "none",
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgb(24, 24, 24)",
  },
  active: {
    boxShadow:" 0px 0px 15px 5px #fff",
    color: "rgb(0, 0, 0)",
    backgroundColor:"rgb(255, 255, 255)",
    transition:{
      duration: 1.5
    },
  }}
  const focusButton = {
    animate:{

    }
  }
  export {
    pageTransition,
    listAnimation,
    buttonActive,
    tableAnimation,
    buttonAnimation,
    focusButton,
  }