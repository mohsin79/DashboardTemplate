import React, { useState } from 'react'

import { FaBriefcase, FaUser, FaUserCircle } from "react-icons/fa"
import Employee from './Employee'
import Retired from './Retired'
import SelfEmployee from './SelfEmployee'


function ProfessionalDetail() {
    const [status, setStatus] = useState("employee")


    const handleEmployed = (employeeType: string) => {
        try {
            setStatus(employeeType)
        } catch (error) {
            console.log(error)
        }
    }

    const renderForm = () => {
        try {
            switch (status) {
                case "employee": return <Employee />;
                case "selfEmployee": return <SelfEmployee />;
                case "retired": return <Retired />
                default: return <Employee />
            }
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className="my-5">
            <div className="row mt-4">
                {/* <div className="col-md-1"></div> */}
                <div className="signUpBoxShadow col-md-12">
                <div className="long-title"> <h3 className="fs-title">Professional Details</h3></div>
                    <div className="row">
                        <div className="col-sm-10">
                        <div className="sub-title"> <h3>Are You Currently</h3> </div>
                        </div>
                        <div className="column" onClick={() => handleEmployed("employee")} >
                            <div className={status === "employee" ? "card-selected" : "card_professional_detail"}>
                                <div>
                                    <FaBriefcase className={status === "employee" ? "icon-color-selected" : "icon-color"} />
                                </div>
                                <p className={status === "employee" ? "mt-2 icon-text-selected" : "mt-2 icon-text"}>Employed</p>
                            </div>
                        </div>
                        <div className="column" onClick={() => handleEmployed("selfEmployee")} >
                            <div className={status === "selfEmployee" ? "card-selected" : "card_professional_detail"}>
                                <div>
                                    <FaUser className={status === "selfEmployee" ? "icon-color-selected" : "icon-color"} />
                                </div>
                                <p className={status === "selfEmployee" ? "mt-2 icon-text-selected" : "mt-2 icon-text"}>Self Employed</p>
                            </div>
                        </div>
                        <div className="column" onClick={() => handleEmployed("retired")}>
                            <div className={status === "retired" ? "card-selected" : "card_professional_detail"}>
                                <div>
                                    <FaUserCircle className={status === "retired" ? "icon-color-selected" : "icon-color"} />
                                </div>
                                <p className={status === "retired" ? "mt-2 icon-text-selected" : "mt-2 icon-text"}>Retired</p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4'>
                    {renderForm()}
                    </div>
                </div>
                {/* <div className="col-md-1"></div> */}
            </div>
        </div>
    )
}

export default ProfessionalDetail;