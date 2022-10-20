import { CheckBox, Form, RadioGroup, SelectBox } from "devextreme-react";
import { ButtonItem, GroupItem } from "devextreme-react/form";
import { OptionChangedEventInfo } from "devextreme/core/dom_component";
import { NativeEventInfo } from "devextreme/events";
import { ValueChangedInfo } from "devextreme/ui/editor/editor";
import dxRadioGroup from "devextreme/ui/radio_group";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isObject } from "util";
import Control from "../../components/control";
import Loader from "../../components/Loader/Loader";
import TextBox from "../../components/textBox";
import { ApiRequestAsync } from "../../services/httpservice";
import { UserFormType } from "../../services/webstorage";
import { useStore } from "../../store/store";
import { encryptFormData } from "../../util/common";
import { toastError, toastSuccess } from "../../util/toaster/Toaster";
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { next, previous, setInvesment } from "../../store/appreducer";

const yearOfExperience = ['1-5', '5+'];
const financial_trading_education = ["Yes", "No"]
const simpleProducts = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

const investExperience = ({
    Guardian: [
        {
            name: 'income',
            strategyName: 'Income',
            text: 'Focus on investments that generate income',
            Select: "incomeStrategy"
        },
        {
            name: 'accountgrowth',
            strategyName: 'Growth of Account',
            text: 'Focus on investments that are looking to grow in value',
            Select: "growthOfAccountStrategy"
        },
        {
            name: 'speculation',
            strategyName: 'Speculation',
            text: 'Focus on assets with a chance of significant value increased. Ability to sustain high losses to achieve this objective',
            Select: "speculationStrategy"
        },
        {
            name: 'trading',
            strategyName: 'Trading',
            text: 'Looking to employ strategies on short term opportunities. This strategy tends to yield high turnover, and high risk',
            Select: "tradingStrategy"
        }
    ],
    Boustead: []
})


function InvestmentExperience() {
    const [errorShow, setErrorShow] = useState<Array<string>>([]);
    const [errorTableShow, setErrorTableShow] = useState<boolean>(false);
    const [errorEducationField, setErrorEducationField] = useState<boolean>(false);
    const [educationInTradingMarketsState, setEducationInTradingMarketsState] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const investmentState = useAppSelector(e => e.appform.investment);
    const { investmentType, knowedgeType } = useAppSelector(e => e.appform.appSettings);
    // const investmentState = useRef<typeof InvestmentData>({ ...InvestmentData }).current;

    const dispatch = useAppDispatch()

    const { type } = useParams();

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
        setErrorShow([]);
        setLoading(true);
        if (investmentState.assetClasses[0].investmentTypeId || investmentState.assetClasses[0].yearofExp || investmentState.assetClasses[0].knowledgeTypeId && educationInTradingMarketsState) {
            const mutation_Data = investmentState.assetClasses.filter(f => f.investmentTypeId).map(a => ({ ...a }));
            const { assetClasses, ...others } = investmentState;
            ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=${type === "1" ? "7" : "6"}`, { ...encryptFormData(others), assetClasses: JSON.stringify(mutation_Data) }).then(() => {
                toastSuccess("Investment Experience added successfully");
                setLoading(false)
                dispatch(next())
            }).catch((error) => {
                setLoading(false);
                if (typeof error.response?.data === "object") {
                    setErrorShow(Object.values(error.response.data).flatMap(c => c) as Array<string>);
                }
                toastError(error.message);
            });
        } else {
            setLoading(false);
            if (investmentState && (investmentState.assetClasses[0].investmentTypeId || investmentState.assetClasses[0].yearofExp || investmentState.assetClasses[0].knowledgeTypeId)) {
                setErrorEducationField(true)
            } else {
                setErrorTableShow(true)
                if (educationInTradingMarketsState === "") setErrorEducationField(true)
            }
        }
    }
    /*  handle the form submission start */

    const handleEducation = (e: any) => {
        dispatch(setInvesment({ ["educationInTradingMarkets"]: e === 'Yes' }))
        setEducationInTradingMarketsState(e)
        setErrorEducationField(false)
    }

    const handleInvestExperience = (e: any) => {
        dispatch(setInvesment({ [e.element.children[0].firstChild.name as string]: e.value }))
    }

    const handlePleaseElaborate = (e: any) => {
        dispatch(setInvesment({ ["detailsEducationInTradingMarkets"]: e }))
    }

    const handleCheckBox = (e: boolean, index: number, Id: string) => {
        let investList = investmentState.assetClasses.map(a => ({ ...a }));
        investList[index].investmentTypeId = e ? Id : "";
        investList[index].yearofExp = e ? '1-5' : "";
        investList[index].knowledgeTypeId = e ? knowedgeType[0].id : "";
        dispatch(setInvesment({ assetClasses: investList }))
    }

    const handleChangesyearsOfExperience = (e: NativeEventInfo<any, Event> & ValueChangedInfo, index: number) => {
        if (investmentState.assetClasses[index].investmentTypeId !== "") {
            const investList = investmentState.assetClasses.map(a => ({ ...a }));
            //@ts-ignore
            investList[index].yearofExp = e;
            dispatch(setInvesment({ assetClasses: investList }))
        }

    }

    const handleChangesknowledge = (e: NativeEventInfo<any, Event> & ValueChangedInfo, index: number) => {
        if (investmentState.assetClasses[index].investmentTypeId !== "") {
            const investList = investmentState.assetClasses.map(a => ({ ...a }));
            //@ts-ignore
            investList[index].knowledgeTypeId = e;
            dispatch(setInvesment({ assetClasses: investList }))
        }
    }



    return (
        <div className="row">
            {/* <div className="col-md-1"></div> */}
            <div className="col-md-12 signUpBoxShadow my-5">
                <div className="long-title"><h3 className="fs-title"> INVESTMENT EXPERIENCE </h3> </div>
                <div className="row" style={{ margin: "0px", marginBottom: "20px" }}>
                    <div className="col-md-12 invest-tptxt" style={{ backgroundColor: "#dedede" }}>
                        <p className="mt-3">We are collecting the information below to better understand your investment
                            experience.
                            We recognize your responses may change over time as you work with us. Please
                            check the
                            boxes that best describe your investment experience to date.</p>
                    </div>
                </div>
                <div className="row">
                    <Loader loading={loading} />
                    <div className="col-sm-12">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Investment</th>
                                    <th>Year(s) Of Experience</th>
                                    <th>Knowledge</th>
                                </tr>
                            </thead>
                            <tbody>
                                {errorTableShow && <tr>
                                    <td colSpan={3}>
                                        <span className="text-danger">Atleast one Investment Experience is required.</span>
                                    </td>
                                </tr>}
                                {investmentType.map((asset, index) => {
                                    return (
                                        <tr key={asset.id + index}>
                                            <td>
                                                <CheckBox
                                                    value={investmentState.assetClasses[index]?.investmentTypeId === asset.id}
                                                    name="assetClass"
                                                    text={asset.name}
                                                    onValueChange={(e) => handleCheckBox(e, index, asset.id)}
                                                />
                                            </td>
                                            <td>
                                                <RadioGroup name="yearsOfExperience" value={investmentState.assetClasses[index]?.yearofExp} items={yearOfExperience} onValueChange={(e) => handleChangesyearsOfExperience(e, index)} />
                                            </td>
                                            <td>
                                                <RadioGroup name="knowledge" value={investmentState.assetClasses[index]?.knowledgeTypeId} displayExpr="name" valueExpr="id" items={knowedgeType} onValueChange={(e) => handleChangesknowledge(e, index)} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <div className="row">
                            <div className="col-md-12 text-left">
                                {(educationInTradingMarketsState === "" && errorEducationField) && <span className="text-danger" style={{ display: "block" }} >This field is required</span>}
                                <label>Have you had education in trading/financial markets?<span
                                    className="text-danger">
                                    *</span>
                                </label>
                            </div>
                            <div className="col-md-12 text-left ynoption">
                                <RadioGroup value={educationInTradingMarketsState} items={financial_trading_education} onValueChange={handleEducation} layout="horizontal" />
                            </div>
                        </div>
                        {investmentState && investmentState.educationInTradingMarkets && <div className="row">
                            <div className="col-sm-4 text-left ynoption mt-4 mb-4">
                                <label >Please elaborate<span className="text-danger"> *</span></label>
                                <TextBox value={investmentState.detailsEducationInTradingMarkets} placeholder="" onValueChange={handlePleaseElaborate} maxLength={100} />
                            </div>
                        </div>}
                        <div className="row">
                            <div className="col-lg-12 text-left">
                                <label>Please detail the trading strategy you are looking to employ at Guardian Trading</label>
                                <label>On a scale of 1-10 in terms of priority, 10 being the highest, and 1 being the lowest in terms of priority, please review and evaluate the below. </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                {
                                    investExperience.Guardian.map((x, index) =>
                                    (
                                        <div key={index + x.strategyName} className="invest_Experience">
                                            <div className="col-lg-10">
                                                <label className="ml-1">
                                                    <strong>
                                                        {x.strategyName}:
                                                    </strong>
                                                    {x.text}
                                                    <span className="text-danger">  *</span>
                                                </label>
                                            </div>
                                            <div className="col-lg-2">
                                                {
                                                    index === 0 ? <SelectBox value={investmentState.incomeStrategy} name={x.Select} items={simpleProducts} placeholder={""} onValueChanged={handleInvestExperience} /> :
                                                        index === 1 ? <SelectBox value={investmentState.growthOfAccountStrategy} name={x.Select} items={simpleProducts} placeholder={""} onValueChanged={handleInvestExperience} /> :
                                                            index === 2 ? <SelectBox value={investmentState.speculationStrategy} name={x.Select} items={simpleProducts} placeholder={""} onValueChanged={handleInvestExperience} /> :
                                                                <SelectBox value={investmentState.tradingStrategy} name={x.Select} items={simpleProducts} placeholder={""} onValueChanged={handleInvestExperience} />
                                                }

                                            </div>
                                        </div>
                                    )
                                    )
                                }
                            </div>

                        </div>
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
                {errorShow.map(c => <span className="text-danger" style={{ display: "list-item" }}>{c}</span>)}
            </div>
        </div>
    )
}

export default InvestmentExperience;