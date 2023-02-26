import React from 'react'

function Alert(props) {
    const {msg, type} = props
  return (
    <div className={`alert ${type}`}>{msg}</div>
  )
}

export default Alert