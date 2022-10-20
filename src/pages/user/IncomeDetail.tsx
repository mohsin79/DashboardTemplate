import { FaCheck } from "react-icons/fa";
import React, { useEffect, useRef, useState } from 'react';
import Control from "../../components/control";
import { useNavigate } from "react-router-dom";
import { ClickEvent } from "devextreme/ui/button";
import { useForm } from "../../components/useFrom";
import { useStore } from "../../store/store";
import { Form } from "devextreme-react";
import { ButtonItem, GroupItem } from "devextreme-react/form";
import axios from 'axios';
import { encryptFormData } from "../../util/common";
import { ApiRequestAsync } from "../../services/httpservice";
import { toastError, toastSuccess } from "../../util/toaster/Toaster";
import Loader from "../../components/Loader/Loader";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { next, previous, setIncomeDetail } from "../../store/appreducer";
const Annual_Income = [
    "$25,000 and Under", "$25,001 - $50,000", "$50,001 - $100,000", "$100,001 - $250000", "$250,001 - $500,000", "Over $500,000"
]

const TAX_RATE = [
    "0 - 15%", "16 - 25%", "26 - 30%", "31 - 35%", "Over 35%"
]

function IncomeDetail() {

    const [errorShow, setErrorShow] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { type } = useParams();
    /*  move the stepper function start  */
    const dispatch = useAppDispatch();
    const incomeState = useAppSelector(e => e.appform.incomeDetail);
    const { priceRange, percentageRange } = useAppSelector(e => e.appform.appSettings);

    /*  move the stepper function backward End */

    const buttonOptionsPrevious = {
        text: 'Previous',
        type: 'normal',
        useSubmitBehavior: true,
        onClick: () => {
            dispatch(previous())
        }
    }

    const buttonOptionsNext = {
        text: 'Next',
        type: 'default',
        useSubmitBehavior: true,
        onClick: () => {
            handleSubmit()
        }
    }

    const handleSubmit = () => {
        if (incomeState.Annual_Income !== -1 && incomeState.Liquid_Net_Worth !== -1 && incomeState.Net_Worth !== -1 && incomeState.TAX_RATE !== -1) {
            setLoading(true)
            let formValue = {
                annualIncome: incomeState.Annual_Income,
                netWorthExcludingResidence: incomeState.Liquid_Net_Worth,
                LiquidNetWorth: incomeState.Net_Worth,
                taxRate: incomeState.TAX_RATE
            }
            ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=${type === "1" ? "4" : "3"}`, formValue).then(() => {
                toastSuccess("Income Details added successfully");
                setLoading(false)
                dispatch(next())
            }).catch((error) => {
                setLoading(false)
                toastError(error?.message);
            })
        } else {
            setErrorShow(true)
        }
        //  NextStep()
    }
    /*  handle the form submission start */

    const handleIncome = (incomeType: string, Index: number) => {
        dispatch(setIncomeDetail({ [incomeType]: Index }));

        if (incomeType === "Annual_Income") {
            if (incomeState.Liquid_Net_Worth !== -1 && incomeState.Net_Worth !== -1 && incomeState.TAX_RATE !== -1) setErrorShow(false)
        } else if (incomeType === "Net_Worth") {

            if (incomeState.Annual_Income !== -1 && incomeState.Liquid_Net_Worth !== -1 && incomeState.TAX_RATE !== -1) setErrorShow(false)
        } else if (incomeType === "Liquid_Net_Worth") {
            if (incomeState.Annual_Income !== -1 && incomeState.Net_Worth !== -1 && incomeState.TAX_RATE !== -1) setErrorShow(false)
        } else if (incomeType === "TAX_RATE") {

            if (incomeState.Annual_Income !== -1 && incomeState.Net_Worth !== -1 && incomeState.Liquid_Net_Worth !== -1) setErrorShow(false)
        }

    }

    return (
        <div className="row">
            <Loader loading={loading} />
            {/* <div className="col-md-1"></div> */}
            <div className="col-md-12 signUpBoxShadow my-3">
                <div className="long-title"> <h3 className="fs-title">INCOME DETAILS</h3> </div>
                <p className="mb-1"> Financial situation and needs, Liquidity Considerations and Tax Status.</p>
                <div className="col-sm-12">
                    <div className="sub-title"><h3 className="mr-2" >Annual Income </h3> </div> <p className="mb-1 ">includes income form sources such as employment, alimony, social security, investment, income etc.</p>
                </div>
                <div className="justify-content-between annualincomeclm col-sm-4 ">
                    <div className="w-100 mt-2">
                        <h6>
                            Annual Income
                        </h6>
                        <ul className="list-group annualincomecwidth" >
                            {
                                priceRange.map((x, index) =>
                                (
                                    <li key={"Annual_Income" + index} className={`list-group-item d-flex justify-content-between align-items-center mr-4 ${type !== "1" ? "IncomeDetail_li" : "IncomeDetail_Support_li"}`} onClick={() => handleIncome("Annual_Income", x.id)} > {x.value} {incomeState?.Annual_Income === x.id && <FaCheck style={{ fontSize: "15px", color: "#000000" }} />}</li>
                                )

                                )
                            }
                        </ul>
                        {errorShow && incomeState.Annual_Income === -1 && <span className="text-danger">Annual Income is required </span>}
                    </div>
                    <div className="w-100 mt-2">
                        <h6>
                            Net Worth (Excluding Residence)
                        </h6>
                        <ul className="list-group annualincomecwidth" >
                            {
                                priceRange.map((x, index) => {
                                    return (

                                        <li key={"Net_Worth" + index} className={`list-group-item d-flex justify-content-between align-items-center mr-4 ${type !== "1" ? "IncomeDetail_li" : "IncomeDetail_Support_li"}`} onClick={() => handleIncome("Net_Worth", x.id)} >{x.value} {incomeState?.Net_Worth === x.id && <FaCheck style={{ fontSize: "15px", color: "#000000" }} />}</li>

                                    )
                                }
                                )
                            }
                        </ul>
                        {errorShow && incomeState.Net_Worth === -1 && <span className="text-danger">Net worth is required</span>}
                    </div>
                    <div className="w-100 mt-2">
                        <h6>
                            Liquid Net Worth (Must be less than Net Worth)
                        </h6>
                        <ul className="list-group annualincomecwidth" >
                            {
                                priceRange.map((x, index) => {
                                    return (

                                        <li key={"Liquid_Net_Worth" + index} className={`list-group-item d-flex justify-content-between align-items-center mr-4 ${type !== "1" ? "IncomeDetail_li" : "IncomeDetail_Support_li"}`} onClick={() => handleIncome("Liquid_Net_Worth", x.id)} >{x.value} {incomeState?.Liquid_Net_Worth === x.id && <FaCheck style={{ fontSize: "15px", color: "#000000" }} />}</li>

                                    )
                                }
                                )
                            }
                        </ul>
                        {errorShow && incomeState.Liquid_Net_Worth === -1 && <span className="text-danger">Liquid net worth is required</span>}
                    </div>
                </div>
                <div className="annualincomeclm col-sm-4 mt-4">
                    <div className="TAX_RATE_Width mt-2">
                        <h6>
                            TAX RATE (Highest Marginal)
                        </h6>
                        <ul className="list-group annualincomecwidth" >
                            {
                                percentageRange.map((x, index) => 
                                     (
                                        <li key={"TAX_RATE" + index} className={`list-group-item d-flex justify-content-between align-items-center mr-4 ${type !== "1" ? "IncomeDetail_li" : "IncomeDetail_Support_li"}`} onClick={() => handleIncome("TAX_RATE", x.id)} >{x.value} {incomeState?.TAX_RATE === x.id && <FaCheck style={{ fontSize: "15px", color: "#000000" }} />}</li>
                                    )
                                
                                )
                            }
                        </ul>
                        {errorShow && incomeState.TAX_RATE === -1 && <span className="text-danger">Tax Rate is required</span>}
                    </div>
                </div>
                <Form
                    colCount={1}
                    showColonAfterLabel={false}
                    readOnly={false}
                    showValidationSummary={true}
                    validationGroup="customerData"
                    labelLocation="top">
                    <GroupItem colCount={31}>
                        <ButtonItem
                            horizontalAlignment="right"
                            colSpan={28}
                            cssClass={"buttonTxt mt-3"}
                            buttonOptions={buttonOptionsPrevious}
                        />
                        <ButtonItem
                            horizontalAlignment="right"
                            colSpan={3}
                            cssClass={"buttonTxt mt-3"}
                            buttonOptions={buttonOptionsNext}
                        />
                    </GroupItem>
                </Form>
                {/* <div className='d-flex justify-content-end mt-4'>
                <Control.Button className='btn btn-default bg-primary text-white button-width' text='Previous' onClick={handlePreviousButton} />
                <Control.Button className='btn btn-default bg-primary text-white button-width' text='Next' onClick={handleSubmit} />
            </div> */}
            </div>
            {/* <div className="col-md-1"></div> */}
        </div>
    )
}

export default IncomeDetail;