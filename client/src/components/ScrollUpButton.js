import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons'
function ScrollUpButton() {
    const onClick = () => {
    }
  return (
    <button id="bn" className="btn-up" onClick={onClick}><FontAwesomeIcon icon={faArrowAltCircleUp}/></button>
  )
}

export default ScrollUpButton