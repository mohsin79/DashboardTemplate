import { FaCheck } from "react-icons/fa"
import React, { useState } from 'react'
import Control from "../../components/control"
import { useNavigate } from "react-router-dom"
import { ClickEvent } from "devextreme/ui/button"
import { useStore } from "../../store/store"
import Form, { ButtonItem, GroupItem } from "devextreme-react/form"
import axios from "axios"
import { encryptFormData } from "../../util/common"
import { ApiRequestAsync } from "../../services/httpservice"
import Loader from "../../components/Loader/Loader"
import { toastError, toastSuccess } from "../../util/toaster/Toaster"
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "../../hooks/storehook"
import { next, previous, setFinancial } from "../../store/appreducer"

const ANNUAL_EXPENSES = [
    "$25,000 and Under", "$25,001 - $50,000", "$50,001 - $100,000", "$100,001 - $250000", "$250,001 - $500,000", "Over $500,000"
]

const LIQUIDITY = [
    "Very important", "Important", "Some what important", "Does not matter"
]

const FINANCIAL_GOAL = [
    "Under 1 year", "1 - 2", "3 - 5", "6 - 10", "11 - 20", "Over 20"
]

function FinancialSituation() {
    const [errorShow, setErrorShow] = useState<boolean>(false);
    const [errorShowApi, setErrorShowApi] = useState<Array<string>>([])
    const [loading, setLoading] = useState<boolean>(false);

    const { type } = useParams();
    /*   move the stepper function start  */
    const dispatch = useAppDispatch();
    const financialState = useAppSelector(e => e.appform.financial);
    const { priceRange, yearRange, priority } = useAppSelector(e => e.appform.appSettings);
    /*  move the stepper function end */

    /*  handle previous button function End */

    const buttonOptionsPrevious = {
        text: 'Previous',
        type: 'normal',
        useSubmitBehavior: true,
        onClick: () => {
            dispatch(previous());
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
        if (financialState.ANNUAL_EXPENSES !== -1 && financialState.Special_Expenses !== -1 && financialState.Liquidity_Needs !== -1 && financialState.financial_goal !== -1) {
            let formValue = {
                annualExpenses: financialState.ANNUAL_EXPENSES,
                specialExpenses: financialState.Special_Expenses,
                liquidityNeeds: financialState.Liquidity_Needs,
                timeToAchieveFinancialGoal: financialState.financial_goal
            }
            setLoading(true)
            ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=${type === "1" ? "6" : "5"}`, formValue).then(() => {
                toastSuccess("Financial Situation added successfully");
                setLoading(false)
                dispatch(next())
            }).catch((error) => {
                setLoading(false)
                // toastError(error?.message);
                if (typeof error.response?.data === "object") {
                    setErrorShowApi(Object.values(error.response.data).flatMap(c => c) as Array<string>);
                } else {
                    toastError(error?.message);
                }
            });
        } else {
            setErrorShow(true)
        }
        // NextStep()
    }
    /*  handle the form submission start */

    const handleIncome = (incomeType: string, Index: number) => {


        dispatch(setFinancial({ [incomeType]: Index }));
        if (incomeType === "ANNUAL_EXPENSES") {
            if (financialState.Special_Expenses !== -1 && financialState.Liquidity_Needs !== -1 && financialState.financial_goal !== -1) setErrorShow(false);
        } else if (incomeType === "Special_Expenses") {

            if (financialState.ANNUAL_EXPENSES !== -1 && financialState.Liquidity_Needs !== -1 && financialState.financial_goal !== -1) setErrorShow(false);
        } else if (incomeType === "Liquidity_Needs") {

            if (financialState.ANNUAL_EXPENSES !== -1 && financialState.Special_Expenses !== -1 && financialState.financial_goal !== -1) setErrorShow(false);
        } else if (incomeType === "financial_goal") {

            if (financialState.ANNUAL_EXPENSES !== -1 && financialState.Special_Expenses !== -1 && financialState.Liquidity_Needs !== -1) setErrorShow(false);
        }

    }

    return (
        <div className="row">
            <Loader loading={loading} />
            {/* <div className="col-md-1"></div> */}
            <div className="col-md-12 signUpBoxShadow my-5">
                <div className="long-title"> <h3 className="fs-title">FINANCIAL SITUATION</h3> </div>
                <p className="mb-0"> Financial Situation and Needs, Liquidity Considerations and Tax Status</p>
                <div className="justify-content-between annualincomeclm col-sm-4 ">
                    <div className="w-100 mt-2">
                        <h6>
                            ANNUAL EXPENSES
                        </h6>
                        <ul className="list-group annualincomecwidth" >
                            {
                                priceRange.map((x, index) =>
                                (
                                    <li key={"ANNUAL" + x.id} className="IncomeDetail_li list-group-item d-flex justify-content-between align-items-center mr-4" onClick={() => handleIncome("ANNUAL_EXPENSES", x.id)} >{x.value} {financialState?.ANNUAL_EXPENSES === x.id && <FaCheck style={{ fontSize: "15px", color: "#000000" }} />}</li>
                                ))
                            }
                        </ul>
                        {errorShow && financialState.ANNUAL_EXPENSES === -1 && <span className="text-danger">Annual Expense is required</span>}
                    </div>
                    <div className="w-100 mt-2">
                        <h6>
                            SPECIAL EXPENSES (future & non-recurring)
                        </h6>

                        <ul className="list-group annualincomecwidth" >
                            {
                                priceRange.map((x, index) =>
                                (
                                    <li key={"Special_Expenses" + index} className="IncomeDetail_li list-group-item d-flex justify-content-between align-items-center mr-4" onClick={() => handleIncome("Special_Expenses", x.id)} >{x.value} {financialState?.Special_Expenses === x.id && <FaCheck style={{ fontSize: "15px", color: "#000000" }} />}</li>
                                ))
                            }
                        </ul>
                        {errorShow && financialState.Special_Expenses === -1 && <span className="text-danger">Special Expense worth is required</span>}
                    </div>
                    <div className="w-100 mt-2">
                        <h6>
                            LIQUIDITY NEEDS
                        </h6>
                        <ul className="list-group annualincomecwidth" >
                            {
                                priority.map((x, index) =>
                                (
                                    <li key={"Liquidity_Needs" + index} className="IncomeDetail_li list-group-item d-flex justify-content-between align-items-center mr-4" onClick={() => handleIncome("Liquidity_Needs", x.id)} >{x.value} {financialState?.Liquidity_Needs === x.id && <FaCheck style={{ fontSize: "15px", color: "#000000" }} />}</li>
                                )
                                )
                            }
                        </ul>
                        {errorShow && financialState.Liquidity_Needs === -1 && <span className="text-danger">Liquidity Expense is required</span>}
                    </div>
                </div>
                <div className="annualincomeclm col-sm-4 ">
                    <div className="TAX_RATE_Width mt-4">
                        <h6>
                            The expected period you plan to achieve your financial goal(s)
                        </h6>
                        <ul className="list-group annualincomecwidth" >
                            {
                                yearRange.map((x, index) =>
                                (
                                    <li key={"financial_goal" + index} className="IncomeDetail_li list-group-item d-flex justify-content-between align-items-center mr-4" onClick={() => handleIncome("financial_goal", x.id)} >{x.value} {financialState?.financial_goal === x.id && <FaCheck style={{ fontSize: "15px", color: "#000000" }} />}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                {errorShow && financialState.financial_goal === -1 && <span className="text-danger">Financial Goal is required</span>}
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
                {errorShowApi.map(c => <div className=" mt-2 dx-item dx-validationsummary-item"><div className="dx-item-content dx-validationsummary-item-content">{c}</div></div>)}
                {/* <div className='d-flex justify-content-end mt-4'>
                    <Control.Button className='btn btn-default bg-primary text-white button-width' text='Previous' onClick={handlePreviousButton} />
                    <Control.Button className='btn btn-default bg-primary text-white button-width' text='Next' onClick={handleSubmit} />
                </div> */}
            </div>
            {/* <div className="col-md-1"></div> */}
        </div>
    )
}

export default FinancialSituation;