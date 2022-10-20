import { Toolbar } from 'devextreme-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa"
 
function Topheader() {

  return (
      <div className='row header-bg'>
         <div className='headwrap'>
            <div className='topnbmr'>
            <Link to="tel:844-963-1512"> <FaPhoneAlt  style={{ color: "white" }} /> <span className='ml-2'> 844-963-1512 </span></Link>
            </div>
         </div>
      </div>
  )
}

export default Topheader;