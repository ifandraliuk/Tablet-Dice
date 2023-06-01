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

  export {
    pageTransition,
    buttonAnimation,
  }