import { Form, SimpleItem, GroupItem, RequiredRule, PatternRule, Label, ButtonItem } from 'devextreme-react/form'
import { ClickEvent } from 'devextreme/ui/button';
import { useRef, useState } from 'react';
import { useForm } from '../../components/useFrom';
import { ApiRequestAsync } from '../../services/httpservice';
import { encryptFormData } from '../../util/common';
import { AccountType } from '../../util/Data';
import { toastError, toastSuccess } from '../../util/toaster/Toaster';
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/storehook';
import { next, previous, setFunding } from '../../store/appreducer';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
const initialFValues = {
    Wages_Income: false,
    Savings: false,
    Pension: false,
    fundFromAnotherAccount: false,
    gift_Inheritance: false,
    other: false,
    saleofasset: false,
    otherIncomeSource: "",
    bankName: "",
    ABAOrSWIFT: "",
    bankAccountNumber: "",
    bankAccountType: "Checking",
    accountTitle: ""
}

// on Bankend modal there is written it is not mandatory on the frontend but the reason to made it mandatory bacause it return exception on API hit

function FundingDetails() {

    /*  move the stepper function start  */
    const [loading, setLoading] = useState<boolean>(false);
    const [errorOverFund, setErrorOverFund] = useState<boolean>(false);
    const [errorShow, setErrorShow] = useState<Array<string>>([])
    const dispatch = useAppDispatch();
    const funding = useAppSelector(e => e.appform.funding);

    const fundingState = useRef<typeof funding>({ ...funding }).current;
    const { type } = useParams()

    /*  move the stepper function end */
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

    const handleIncomeResource = (incomeSource: any) => {
        let responce_income_resource: any = []
        incomeSource.map((income: boolean, index: number) => {
            if (income) {
                responce_income_resource.push(`${index + 1}`)
            } else {
                responce_income_resource.splice(index + 1, 1)
            }
        })

        return responce_income_resource;
    }


    const hanldeStoreState = (e: FieldDataChangedEvent) => {
        const { dataField: name, value } = e;
        dispatch(setFunding({ [name as string]: value }))
    }

    const handleSubmit = (e: ClickEvent) => {
        if (fundingState.Wages_Income || fundingState.Savings || fundingState.Pension || fundingState.fundFromAnotherAccount || fundingState.gift_Inheritance || fundingState.saleofasset || fundingState.other) {
            const { isValid } = e.validationGroup.validate();
            if (isValid) {
                let incomeSource = [fundingState.Wages_Income, fundingState.Savings, fundingState.Pension, fundingState.fundFromAnotherAccount, fundingState.gift_Inheritance, fundingState.other, fundingState.saleofasset]
                let incomeSource_responce = handleIncomeResource(incomeSource)
                let api_Data = {
                    IncomeSource: incomeSource_responce,
                    otherIncomeSource: fundingState.otherIncomeSource,
                    bankName: fundingState.bankName,
                    ABAOrSWIFT: fundingState.ABAOrSWIFT,
                    bankAccountNumber: fundingState.bankAccountNumber.toString(),
                    bankAccountType: fundingState.bankAccountType,
                    accountTitle: fundingState.accountTitle
                }
                setLoading(true)
                ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=${type === "1" ? "9" : "7"}`, encryptFormData(api_Data)).then(() => {
                    toastSuccess("Funding details added successfully");
                    setLoading(false)
                    dispatch(next());
                }).catch((error) => {
                    setLoading(false)
                    if (typeof error.response?.data === "object") {
                        setErrorShow(Object.values(error.response.data).flatMap(c => c) as Array<string>);
                    } else {
                        toastError(error?.message);
                    }
                    // toastError(error?.message);
                });
            }
        } else {
            setErrorOverFund(true)
        }

    }

    return (
        <div className="my-4">
            <div className="property-form">
                <div className="row">

                    {/* <div className="col-sm-1"></div> */}
                    <div className="col-sm-12 signUpBoxShadow text-left fundingclm ">
                        <div className="long-title"> <h3 className="fs-title">FUNDING DETAILS</h3></div>
                        <div style={{ borderBottom: "1px solid #e5e5e5" }} />
                        <div className="sub-title">
                            {errorOverFund && <span id="fundingError" style={{ color: "red", marginTop: "12px" }} >Please select atleast 1 option</span>}
                            <h3 className="mt-2">
                                I am funding this account with(check all that apply)
                            </h3> </div>
                        <Form
                            onFieldDataChanged={hanldeStoreState}
                            formData={fundingState}
                            colCount={1}
                            showColonAfterLabel={false}
                            readOnly={false}
                            showValidationSummary={true}
                            validationGroup="customerData"
                            labelLocation="top">
                            <GroupItem colCount={4}>
                                <SimpleItem
                                    colSpan={2}
                                    dataField="Wages_Income"
                                    label={{ visible: false }}
                                    editorType="dxCheckBox"
                                    editorOptions={{
                                        text: "Wages/Income",
                                        inputAttr: {
                                            id: 'Wages_Income',
                                            autocomplete: 'off' // 'off' //'new-password' //
                                        }
                                    }} />
                                <SimpleItem
                                    colSpan={2}
                                    dataField="Savings"
                                    label={{ visible: false }}
                                    editorType="dxCheckBox"
                                    editorOptions={{
                                        text: "Savings",
                                        inputAttr: {
                                            id: 'Savings',
                                            autocomplete: 'off' // 'off' //'new-password' //
                                        }
                                    }} />
                            </GroupItem>
                            <GroupItem colCount={2}>
                                <SimpleItem
                                    colSpan={1}
                                    dataField="Pension"
                                    label={{ visible: false }}
                                    editorType="dxCheckBox"
                                    editorOptions={{
                                        text: "Pension or Retirement",
                                        inputAttr: {
                                            id: 'Pension',
                                            autocomplete: 'off' // 'off' //'new-password' //
                                        }
                                    }} />
                                <SimpleItem
                                    colSpan={1}
                                    dataField="fundFromAnotherAccount"
                                    label={{ visible: false }}
                                    editorType="dxCheckBox"
                                    editorOptions={{
                                        text: "Funds from another account",
                                        inputAttr: {
                                            id: 'fundFromAnotherAccount',
                                            autocomplete: 'off' // 'off' //'new-password' //
                                        }
                                    }} />
                            </GroupItem>
                            <GroupItem colCount={2}>
                                <SimpleItem
                                    colSpan={1}
                                    dataField="gift_Inheritance"
                                    label={{ visible: false }}
                                    editorType="dxCheckBox"
                                    editorOptions={{
                                        text: "Gift/Inheritance",
                                        inputAttr: {
                                            id: 'fundFromAnotherAccount',
                                            autocomplete: 'off' // 'off' //'new-password' //
                                        }
                                    }} />
                                <SimpleItem
                                    colSpan={1}
                                    dataField="other"
                                    label={{ visible: false }}
                                    editorType="dxCheckBox"
                                    editorOptions={{
                                        text: "Other",
                                        inputAttr: {
                                            id: 'other',
                                            autocomplete: 'off' // 'off' //'new-password' //
                                        }
                                    }} />
                            </GroupItem>
                            <GroupItem colCount={2}>
                                <SimpleItem
                                    colSpan={1}
                                    dataField="saleofasset"
                                    label={{ visible: false }}
                                    editorType="dxCheckBox"
                                    editorOptions={{
                                        text: "Sale of an asset",
                                        inputAttr: {
                                            id: 'saleofasset',
                                            autocomplete: 'off' // 'off' //'new-password' //
                                        }
                                    }} />
                                <SimpleItem colSpan={1} dataField="otherIncomeSource" editorOptions={{
                                    maxLength: 100,
                                    text: funding.other ? funding.otherIncomeSource : "",
                                    disabled: funding.other ? false : true,
                                    inputAttr: {
                                        id: 'saleofasset',
                                        autocomplete: 'off' // 'off' //'new-password' //
                                    }
                                }}
                                    isRequired={true}
                                >
                                    {funding.other && <RequiredRule message="Other income source information is required" />}
                                    <Label visible={false} text="" />
                                </SimpleItem>

                            </GroupItem>
                            <GroupItem colCount={2}>
                                <SimpleItem dataField="bankName" editorOptions={{
                                    placeholder: '',
                                    maxLength: 100,
                                    inputAttr: {
                                        id: 'bankName',
                                        autocomplete: 'off' // 'off' //'new-password' //
                                    }
                                }}
                                    isRequired={true}>
                                    <Label text="Name of the bank you will be funding your account from " />
                                    <RequiredRule
                                        message="Bank is required"
                                    />
                                </SimpleItem>
                                <SimpleItem dataField="ABAOrSWIFT" editorOptions={{
                                    placeholder: '',
                                    maxLength: 50,
                                    inputAttr: {
                                        id: 'ABAOrSWIFT',
                                        autocomplete: 'off', // 'off' //'new-password' //
                                        maxLength: 50
                                    },
                                    mode: 'password'
                                }}

                                    isRequired={true}>
                                    <Label text="ABA / SWIFT" />
                                    <RequiredRule
                                        message="ABA / SWIFT is required"
                                    />
                                </SimpleItem>
                            </GroupItem>
                            <GroupItem colCount={3}>
                                <SimpleItem dataField="bankAccountNumber" editorType="dxNumberBox" editorOptions={{
                                    placeholder: '',
                                    maxLength: 20,
                                    inputAttr: {
                                        id: 'bankAccountNumber',
                                        autocomplete: 'off', // 'off' //'new-password' //
                                        maxLength: 20
                                    },
                                    mode: 'password'
                                }}
                                >
                                    <Label text="Account Number" />

                                    <RequiredRule
                                        message="Bank Account Number is required"
                                    />
                                </SimpleItem>
                                <SimpleItem dataField="accountTitle" editorOptions={{
                                    placeholder: '',
                                }}
                                    isRequired={true}>
                                    <Label text="Account Name" />
                                    <RequiredRule
                                        message="Account Name is required"
                                    />
                                </SimpleItem>
                                <SimpleItem dataField="bankAccountType" editorType="dxSelectBox" editorOptions={{ dataSource: AccountType, searchEnabled: true, placeholder: 'Please Select' }} isRequired={true} validationRules={[{ type: 'required', message: '' }]} >
                                    <Label text="Account Type" />
                                    <RequiredRule
                                        message="Account Type is required"
                                    />
                                </SimpleItem>
                            </GroupItem>
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
                        <div style={{ textAlign: "left" }}>
                            <p className="text-danger">* Please be advised Velocity Clearing LLC is not accepting incoming ACH transfers at this time </p>
                        </div>
                    </div>
                    {errorShow.map(c => <div className=" mt-2 dx-item dx-validationsummary-item"><div className="dx-item-content dx-validationsummary-item-content">{c}</div></div>)}
                    {/* <div className="col-sm-1"></div> */}
                    {/* <div className='d-flex justify-content-end mt-4'>
                        <Control.Button className='btn btn-default bg-primary text-white button-width' text='Previous' onClick={handlePreviousButton} />
                        <Control.Button className='btn btn-default bg-primary text-white button-width' text='Next' onClick={handleSubmit} /> */}
                    {/* <Form
                            colCount={1}
                            showColonAfterLabel={false}
                            readOnly={false}
                            showValidationSummary={true}
                            validationGroup="customerData"
                            labelLocation="top">
                            <GroupItem colCount={14}>
                                <ButtonItem
                                    horizontalAlignment="right"
                                    colSpan={13}
                                    buttonOptions={buttonOptionsPrevious}
                                />
                                <ButtonItem
                                    horizontalAlignment="right"
                                    colSpan={1}
                                    buttonOptions={buttonOptionsNext}
                                />
                            </GroupItem>
                        </Form> */}
                </div>
            </div>
        </div>
    )
}

export default FundingDetails;  