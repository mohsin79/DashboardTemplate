import React from 'react'
import { Link } from 'react-router-dom';
import { QuickLink, Legal, Service, ContactDetail } from "./AsideMenuData";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"

function Footer() {
  return (
    <div className="container-fluid footer">
      <div className="row footerbg d-flex justify-content-center">
        <div className="container footer-width">
          <div className="row footerlinks">
            <div className="col-md-2">
              <h2>QUICK LINK</h2>
              <ul>
                {QuickLink.map((QuickLink, index) => (
                  <Link key={`${QuickLink.text}-${index}`}  className="nav-item active" to={QuickLink.reference}>
                    {QuickLink.text}
                  </Link>
                ))}
              </ul>
            </div>
            <div className="col-md-2">
              <h2>LEGAL</h2>
              <ul>
                {Legal.map((legal, index) => (
                  <Link key={`${legal.text}-${index}`} className="nav-item active" to={legal.reference}>
                    {legal.text}
                  </Link>
                ))}
              </ul>
            </div>
            <div className="col-md-2">
              <h2>SERVICES</h2>
              <ul>
                {Service.map((service, index) => (
                  <Link  key={`${service.text}-${index}`} className="nav-item active" to={service.reference}>
                    {service.text}
                  </Link>
                ))}
              </ul>
            </div>
            <div className="col-md-4">
              <h2>CONTACT</h2>
              <ul>
                <Link to={""}> <FaPhoneAlt style={{ fontSize: "15px" }} /> <span > 844-963-1512 </span></Link>
                <Link to={""}> <FaEnvelope color="#FFFFFF" style={{ fontSize: "15px" }} /> <span > guardian.newaccounts@velocityclearingllc.com </span></Link>
                <Link to={""}> <FaMapMarkerAlt style={{ fontSize: "15px" }} /> <span > Guardian </span></Link>
              </ul>
            </div>
            <div className="col-md-1">
              <h2>SUBSCRIBE</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer