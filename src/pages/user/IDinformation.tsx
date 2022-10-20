import { Form, SimpleItem, GroupItem, RequiredRule, PatternRule, Label, ButtonItem } from 'devextreme-react/form'
import { ClickEvent } from 'devextreme/ui/button';
import { useNavigate } from 'react-router-dom';
import Control from '../../components/control';
import { useForm } from '../../components/useFrom';
import { ApiRequestAsync } from '../../services/httpservice';
import { useStore } from '../../store/store';
import { countryName, IDType, provinceName } from '../../util/Data';
import axios from 'axios';
import { encryptFormData } from '../../util/common';
import { useEffect, useRef, useState } from 'react';
import Loader from '../../components/Loader/Loader';
import { toastError, toastSuccess } from '../../util/toaster/Toaster';
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/storehook';
import { next, previous, setIdentityInfo, setIdentityInfoList } from '../../store/appreducer';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
const initialFValues = {
    ssn: '',
    dateOfBirth: '',
    validGovtIDType: '',
    idNumber: '',
    issuingCountry: '',
    issuingState: '',
    taxCountry: '',
    taxState: '',
    IssueDate: '',
    expirationDate: '',
    // country of tax  and state , name of id needs discussion missing on api
}

const dateBoxOptions = {
    invalidDateMessage:
        'The date must have the following format: MM/dd/yyyy',
    width: '100%',
    displayFormat: "MMM-dd-yyyy"
}

function IDinformation({ index = 0 }: any) {
    const [loading, setLoading] = useState<boolean>(false);
    const [errorShow, setErrorShow] = useState<Array<string>>([])

    const dispatch = useAppDispatch();
    const { type } = useParams();

    const identity = useAppSelector(e => {
        // if (type === "6")
        //     return e.appform.identityInfoList[index]
        // else
        return e.appform.identityInfo
    });
    const identityState = useRef<typeof identity>({ ...identity }).current;

    const handleSubmit = (e: ClickEvent) => {
        // NextStep()
        const { isValid } = e.validationGroup.validate();
        if (isValid) {
            let PostData = {
                ...identity,
                ssn: String(identity.ssn),
                issueDate: typeof identity.issueDate === "string" ? identity.issueDate : identity.issueDate?.toISOString(),
                dateOfBirth: typeof identity.dateOfBirth === "string" ? identity.dateOfBirth : identity.dateOfBirth?.toISOString(),
                expirationDate: typeof identity.expirationDate === "string" ? identity.expirationDate : identity.expirationDate?.toISOString(),
                validGovtIDType: identity.validGovtIDType.charAt(0)
            }


            setLoading(true)
            ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=3`, encryptFormData(PostData)).then(() => {
                toastSuccess("ID Information added successfully");
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
    }
    /*  handle the form submission start */



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
    const hanldeStoreState = (e: FieldDataChangedEvent) => {
        const { dataField: name, value } = e;
        // if (type === "6")
        //     dispatch(setIdentityInfoList({ data: { [name as string]: value }, index }))
        // else
        dispatch(setIdentityInfo({ [name as string]: value }))
    }


    return (
        <div>
            <Loader loading={loading} />
            <div className="row mt-2">
                {/* <div className="col-md-2"></div> */}
                <div className={`align-center signUpBoxShadow col-md-12  ${type === "1" ? "my-4" : "mt-3 mb-3 mx-2"}`}>
                    <div className="long-title"><h3 className="fs-title" style={{ color: "black" }} >ID INFORMATION</h3> </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="sub-title-ID-Information"><h3>IMPORTANT INFORMATION ABOUT PROCEDURES FOR OPENING A NEW ACCOUNT USA PATRIOT ACT INFORMATION</h3></div>
                        </div>
                        <label>
                            Important information. To help the government fight the funding of terrorism and money‐laundering activities, Federal law requires that Velocity Clearing LLC (“Velocity”) verify your identity by obtaining your name, date of birth, address, and a government‐issued identification number before opening your account. In certain circumstances, Velocity may obtain and verify this information with respect to any person(s) authorized to effect transactions in an account. For certain entities, such as trusts, estates, corporations, partnerships or other organizations, identifying documentation is also required. Your account may be restricted and/or closed if Velocity cannot verify this information. Velocity will not be responsible for any losses or damages (including, but not limited to, lost opportunities) resulting from any failure to provide this information or from any restriction placed upon, or closing of your account.
                        </label>
                    </div>
                    <Form
                        onFieldDataChanged={hanldeStoreState}
                        formData={identityState}
                        colCount={1}
                        showColonAfterLabel={false}
                        readOnly={false}
                        showValidationSummary={type === "1" ? true : false}
                        validationGroup="customerData"
                        labelLocation="top">
                        <GroupItem colCount={4}>
                            <SimpleItem dataField="ssn" editorType="dxNumberBox" editorOptions={{
                                placeholder: '',
                                maxLength: 11,
                                inputAttr: {
                                    id: 'ssn',
                                    autocomplete: 'off', // 'off' //'new-password' //
                                    maxLength: 11
                                },
                                mode: 'password'
                            }}
                                isRequired={true}>
                                <Label text="Tax ID (SS# / EIN)" />
                                <RequiredRule
                                    message="Social Security or Taxpayer ID No is required"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="dateOfBirth"
                                editorType="dxDateBox"
                                editorOptions={dateBoxOptions}

                            >
                                <Label text="Date of birth (MMM-DD-YYYY)" />
                                <RequiredRule message="Date of birth is required" />
                            </SimpleItem>
                            <SimpleItem dataField="taxCountry" editorType="dxSelectBox" editorOptions={{ dataSource: countryName, searchEnabled: true, placeholder: 'Please Select' }} isRequired={true}>
                                <Label text="Country of Tax Residence" />
                                <RequiredRule
                                    message="Country is required."
                                />
                            </SimpleItem>
                            <SimpleItem
                                dataField="taxState"
                                editorType="dxSelectBox"
                                editorOptions={{
                                    dataSource: provinceName,
                                    searchEnabled: true,
                                    placeholder: 'Please Select'
                                }} isRequired={true}>
                                <Label text="Tax State" />
                                <RequiredRule
                                    message='State is required.'
                                />
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem caption="Valid Government Issued Photo ID" cssClass={"mt-2"}>
                            <GroupItem colCount={4}>
                                <SimpleItem dataField="validGovtIDType" editorType="dxSelectBox" editorOptions={{ dataSource: IDType, searchEnabled: true, placeholder: 'Please Select', maxLength: 1 }}>
                                    <Label text="ID Type" />
                                    <RequiredRule
                                        message='ID Type is required.'
                                    />
                                </SimpleItem>
                                <SimpleItem dataField="idNumber" editorOptions={{
                                    placeholder: '',
                                    maxLength: 30,
                                }}
                                    isRequired={true}>
                                    <Label text="ID Number" />
                                    <RequiredRule
                                        message="ID Number is required"
                                    />
                                </SimpleItem>
                                <SimpleItem dataField="issuingCountry" editorType="dxSelectBox" editorOptions={{ dataSource: countryName, searchEnabled: true, placeholder: 'Please Select' }} isRequired={true} >
                                    <Label text="Country of Issuance" />
                                    <RequiredRule
                                        message='Country of Issuance is required.'
                                    />
                                </SimpleItem>
                                <SimpleItem dataField="issuingState" editorType="dxSelectBox" editorOptions={{ dataSource: provinceName, searchEnabled: true, placeholder: 'Please Select' }} validationRules={[{ type: 'required', message: 'State is required.' }]}>
                                    <Label text="Issuing State" />
                                    <RequiredRule
                                        message='Country of Issuance is required.'
                                    />
                                </SimpleItem>
                            </GroupItem>
                            <GroupItem colCount={4}>
                                <SimpleItem dataField="issueDate"
                                    editorType="dxDateBox"
                                    editorOptions={dateBoxOptions}>
                                    <Label text="Issue Date (MMM-DD-YYYY)" />
                                    <RequiredRule message="Issue Date is required" />
                                </SimpleItem>
                                <SimpleItem dataField="expirationDate"
                                    editorType="dxDateBox"
                                    editorOptions={dateBoxOptions}>
                                    <Label text="Expiration (MMM-DD-YYYY)" />
                                    <RequiredRule message="Expiration is required" />
                                </SimpleItem>
                            </GroupItem>
                        </GroupItem>
                        {type === "1" &&
                            <GroupItem colCount={33}>
                                <ButtonItem
                                    horizontalAlignment="right"
                                    colSpan={30}
                                    cssClass={"buttonTxtIdInformation mt-3"}
                                    buttonOptions={buttonOptionsPrevious}
                                />
                                <ButtonItem
                                    horizontalAlignment="right"
                                    colSpan={3}
                                    cssClass={"buttonTxtIdInformation mt-3"}
                                    buttonOptions={buttonOptionsNext}
                                />
                            </GroupItem>
                        }
                    </Form>
                    {errorShow.map(c => <div className=" mt-2 dx-item dx-validationsummary-item"><div className="dx-item-content dx-validationsummary-item-content">{c}</div></div>)}
                </div>
            </div>
        </div>
    )
}

export default IDinformation;