import React from 'react'
import NavbarComp from '../../components/Navbar'
import "../../Styles/Companions.css"
function Companions(props) {
  return (
    <div className="dark-bg">
        <div className={`bg ${props?.originName}-bg  companions-page`}>
            <NavbarComp/>
            <div  className="container-fluid g-5">
                Hier siehst du deine Begleiter
            </div>
        </div>
    </div>
  )
}

export default Companions