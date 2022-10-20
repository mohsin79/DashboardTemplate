import { CheckBox } from 'devextreme-react';
import Form, { ButtonItem, GroupItem, Label, PatternRule, RequiredRule, SimpleItem } from 'devextreme-react/form';
import { ClickEvent } from 'devextreme/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Control from '../../components/control';
import { useForm } from '../../components/useFrom';
import { ApiRequestAsync } from '../../services/httpservice';
import { useStore } from '../../store/store';
import axios from "axios"
import { encryptFormData } from '../../util/common';
import Loader from '../../components/Loader/Loader';
import { toastError, toastSuccess } from '../../util/toaster/Toaster';
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/storehook';
import { next, previous, setRisk } from '../../store/appreducer';




function RiskAcceptance() {
    const [errorShow, setErrorShow] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    // const [investmentRiskTolerance, setInvestmentRiskTolerance] = useState<string>("");
    /*  move the stepper function backward start  */

    const dispatch = useAppDispatch();
    const investmentRiskTolerance = useAppSelector(e => e.appform.investmentRiskTolerance);
    const { investmentRisk } = useAppSelector(e => e.appform.appSettings)

    /*  move the stepper function backward End */
    const { type } = useParams();
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
        onClick: (e: any) => {
            handleSubmit(e)
        }
    }

    const handleSubmit = (e: ClickEvent) => {
        if (investmentRiskTolerance !== "") {
            let formData = {
                investmentRiskTolerance: investmentRiskTolerance
            }
            setLoading(true)
            ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=${type === "1" ? "5" : "4"}`, formData).then(() => {
                toastSuccess("Risk Acceptance added successfully");
                setLoading(false)
                dispatch(next())
            }).catch((error) => {
                setLoading(false)
                toastError(error?.message);
            });
        } else {
            setErrorShow(true)
        }
        // NextStep()
    }
    /*  handle the form submission start */

    const handleCheckbox = (e: any, id: string) => {
        dispatch(setRisk(id));
    }

    return (
        <div className="row">
            <Loader loading={loading} />
            {/* <div className="col-md-1"></div> */}
            <div className="col-md-12 signUpBoxShadow my-4">
                <div className="long-title"> <h3 className="fs-title">RISK ACCEPTANCE</h3> </div>
                <label className="text-left">  <strong> We consider day trading to be a
                    high‐risk
                    trading strategy.</strong> Please ensure that you have read and understand the accompanying Day Trading Risk Disclosure Statement before submitting your new account documentation.
                    It is in your best interest to carefully consider whether or not you have a significant risk tolerance before proceeding with this form. </label>
                <div className="utility-coonections">
                    <div className="row">
                        <div className="sub-title mb-2"><h3> Investment Risk Tolerance </h3> </div>
                        <label>Please select the degree of risk you are willing to take with
                            the assets
                            in this account</label>
                        {errorShow && investmentRiskTolerance === "" && <span className="text-danger">Please select atleast 1 Risk Tolerance option below. </span>}
                        <div className="tolerance-error"></div>
                        {
                            investmentRisk.map((riskAcceptance, index) => {
                                return (
                                    <div key={riskAcceptance.id} className="row">
                                        <div className='col-md-auto' style={{ alignSelf: "center" }}>
                                            <CheckBox name={riskAcceptance.name} value={investmentRiskTolerance === riskAcceptance.id} defaultValue={false} onValueChange={(e) => handleCheckbox(e, riskAcceptance.id)} />
                                        </div>
                                        <div className='col-md-3 risk-headings'>
                                            <div className="title-text">
                                                <h4>
                                                    {riskAcceptance.name}
                                                </h4>
                                            </div>
                                        </div>
                                        <div className='col-md-8' style={{ verticalAlign: "middle" }}>
                                            <label>
                                                {riskAcceptance.description}
                                            </label>
                                        </div>

                                    </div>
                                )
                            })
                        }
                        <div className="row">
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
                                        cssClass={"buttonTxt mt-3 ml-4"}
                                        buttonOptions={buttonOptionsNext}
                                    />
                                </GroupItem>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="col-md-1"></div> */}
        </div>
    )
}

export default RiskAcceptance