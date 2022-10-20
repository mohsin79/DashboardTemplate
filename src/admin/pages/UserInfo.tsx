import { Accordion } from 'devextreme-react'
import React, { useEffect, useId, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, ButtonGroup } from 'devextreme-react'
import Control from '../../components/control'
import { ApiRequestAsync } from '../../services/httpservice'
import { IPersonal } from '../../store/Interfaces'
import { riskAcceptance } from './Data/userdata'
import { capitalizeFirstLetter } from '../../util/common'
import moment from 'moment'

const tabItems: Array<{ tabName: string, data?: any }> = [{
    tabName: "Personal Details"
},
{ tabName: "Professional Details" },
{ tabName: "Identity  Information" },
{ tabName: "Income Details" },
{ tabName: "Funding Details" },
{ tabName: "Risk Acceptance" },
{ tabName: "Financial Situation" },
{ tabName: "Invesment Experience" },
{ tabName: "Disclosures" },
{ tabName: "Disclosures & Signatures" },
]

const Details = ({ data }: { data: any }) => {

    if (!data?.data) return null;
    return (
        <div className="col-md-12" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {Object.keys(data?.data).map((d: string) => (
                <>
                    {
                        typeof data.data[d] === "object" ? <div className='form-control' style={{ display: 'flex', flexWrap: 'wrap' }}> <label className="form-control"> {d} </label>
                            {
                                Object.keys(data.data[d]).map(nest => (
                                    <>
                                        <div className='col-md-6 p-1 border-bottom' key={nest} >
                                            <label> <strong>{nest}</strong>  </label>
                                        </div>
                                        <div className='col-md-6 p-1 border-bottom' key={d + 'data'} >
                                            <label>{data.data[d][nest]}</label>
                                        </div>
                                    </>
                                ))
                            }

                        </div> :
                            <>
                                <div className='col-md-6 p-1 border-bottom' key={d} >
                                    <label><strong>{d}</strong>   </label>
                                </div>
                                <div className='col-md-6 p-1 border-bottom' key={d + 'data'} >
                                    <label>{data.data[d]}</label>
                                </div>

                            </>

                    }
                </>

            ))}

        </div>
    )
}


const renderItem = (data: any, index: number) => {
    // const Item = List[index];
    return (
        <>
            <div className="accordion-body">
                <Details data={data} />
            </div>
        </>

    )
}
const Title = (data: any) => {
    return <h5>{data.tabName}</h5>
}
const printYesNO = (value: any) => {
    return value ? "Yes" : "No"
}
const UserInfo = () => {
    const [selectedItem, setSelectedItem] = useState([]);
    const handleSelect = (e: any) => {
        setSelectedItem(e.addedItems);
    }
    const [data, setData] = useState(tabItems)

    const isFirstTime = useRef(true);
    const { userId } = useParams();

    useEffect(() => {
        if (!isFirstTime.current && userId) {
            ApiRequestAsync("GET", "/admin/ExtendedAccountDetail", {
                identifierCode: userId
            }).then(res => {

                const personal = res.data.signupInitialCore.map((s: IPersonal) => ({
                    "First Name": s.firstName,
                    "Last Name": s.lastName,
                    Email: res.data.email,
                    Address: s.address,
                    "Apt/Suite": s.aptOrSuite,
                    Country: s.country,
                    "State/Provice": s.state,
                    City: s.city,
                    "Zip_Code": s.zipCode,
                    "Marital Status": s.maritalStatus,
                    Telephone: s.phoneNumber,
                    "No. of Dependents": s.numberOfDependents
                }))
                data[0].data = personal[0];

                data[2].data = {
                    "Tax ID Type": '',
                    "Foreign ID Type": '',
                    "Social Security Or Taxpayer ID No": '',
                    "Date of Birth": moment(res.data.signupInitialCore[0].dateOfBirth).utc().format("DD-MM-YYYY"),
                    "Country of Tax Residence": res.data.signupInitialCore[0].taxCountry,
                    "State": res.data.signupInitialCore[0].taxState,
                    "Valid Government Issued Photo ID": {
                        "ID Type": '',
                        "ID Number": ''
                    },
                    "Place/Country of issuance": res.data.signupInitialCore[0].issuingCountry,
                    "Tax State": res.data.signupInitialCore[0].issuingState,
                    "Issue Date": moment(res.data.signupInitialCore[0].issueDate).utc().format("DD-MM-YYYY"),
                    "Expiration Date": moment(res.data.signupInitialCore[0].dateOfBirth).utc().format("DD-MM-YYYY")
                }
                data[3].data = {
                    "Annual Income": res.data.otherData.annualIncome,
                    "Net Worth": res.data.otherData.netWorthExcludingResidence,
                    "Liquid Net Worth": res.data.otherData.liquidNetWorth,
                    "TAX Rate": res.data.otherData.taxRate
                }
                data[4].data = {
                    "Funding Details": "N/A",
                    "Name of the Bank": res.data.accountFunding.bankName,
                    "ABA Swift": res.data.accountFunding.abaOrSWIFT,
                    "Account Number": res.data.accountFunding.bankAccountNumber,
                    "Account Name": res.data.accountFunding.accountTitle,
                    "Account Type": res.data.accountFunding.bankAccountType
                }
                const investmentRiskTolerance = res.data.signupInitialCore[0].investmentRiskTolerance;
                data[5].data = {
                    "Active or Day Trading": "No",
                    "Conservative": printYesNO(investmentRiskTolerance == "1"),
                    "Moderately Conservative": printYesNO(investmentRiskTolerance == "2"),
                    "Moderate": printYesNO(investmentRiskTolerance == "3"),
                    "Moderately Aggressive": printYesNO(investmentRiskTolerance == "4"),
                    "Significant Risk": printYesNO(investmentRiskTolerance == "5")
                }

                data[6].data = {
                    "Financial Situation and Needs, Liquidity Considerations and Tax Status:": {
                        "Annual Expenses": res.data.otherData.annualExpenses,
                        "Special Expenses": res.data.otherData.specialExpenses,
                        "Liquidity Needs": res.data.otherData.liquidityNeeds
                    },
                    "The expected period you plan to achieve your financial goal(s):": {
                        "The expected period": 3,
                    }
                }
                // data[7].data = {
                //     "Investment": ,
                //     "Year Of Experience": ,
                //     "Knowledge":
                // }
                data[9].data = {
                    "Account Terms & Conditions": printYesNO(res.data.otherData.accountTermsandConditions),
                    "Day Trading Risk Disclosure": printYesNO(res.data.otherData.dayTradingRiskDisclosure),
                    "Penny Stocks Disclosure": printYesNO(res.data.otherData.pennyStockDisclosure),
                    "Electronic Access & Trading Agreement": printYesNO(res.data.otherData.electronicAccessTradingAgreement),
                    "Margin Disclosure Statement": printYesNO(res.data.otherData.marginDisclosureStatement),
                    "W-9 Certification": {
                        "W-9 Certification Name": "",
                    },
                    "Stock Locate Agreement": printYesNO(res.data.otherData.stockLocateAgreement),
                    "Margin Agreement": printYesNO(res.data.otherData.marginAgreement),
                    "Consent for Mail delivery of Statements and Confirms otherwise they will be delivered electronically": printYesNO(res.data.otherData.electronicMailDeliveryAgreement),
                    "I agree to use Electronic Records and Signatures, you agree that you or the firm you represent will be legally bound by your electronic signature": ""


                }
                console.log(res);
            })
        }
        isFirstTime.current = false;
    }, [userId])

    return (
        <div className='row'>
            <div className="col-md-12 col-xl-12 p-4">
                <div id="accordion-container">
                    <Accordion
                        dataSource={data}
                        collapsible={true}
                        multiple={true}
                        animationDuration={300}
                        selectedItems={selectedItem}
                        onSelectionChanged={handleSelect}
                        itemTitleRender={Title}
                        itemRender={renderItem}
                        id="accordion-container"
                    />
                </div>
                <div className='d-flex justify-content-end mt-4'>
                    <Control.Button className='btn btn-default bg-danger text-white button-width' text='Reject' onClick={() => { }} />
                    <Control.Button className='btn btn-default bg-primary text-white button-width' text='Approve' onClick={() => { }} />
                </div>
            </div>
        </div>
    )
}

export default UserInfo