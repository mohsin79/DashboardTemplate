import { FileUploader, Form, SelectBox } from "devextreme-react";
import { ButtonItem, GroupItem, Label, PatternRule, RequiredRule, SimpleItem } from "devextreme-react/form";
import { FieldDataChangedEvent } from "devextreme/ui/form";
import { any, element } from "prop-types";
import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "../../../components/useFrom";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { ApiGetCommonDataAsync, ApiRequestAsync } from "../../../services/httpservice";
import { addedBeneficialData, getUserData, setBeneficiaryInfo, setCompany, setCountryData, setDisAndSig, setDisclosure, setFinancial, setFunding, setIncomeDetail, setRisk } from "../../../store/appreducer";
import { IDisclosure, IDisclosureSig, IFinancial, IFunding, IIncomeDetail } from "../../../store/Interfaces";
import { handleAplicationBeneficiaryCompanyData, handleAplicationCompanyData, handleAplicationFundingData, handleAplicationOtherPersonalData, handleAplicationPersonalData, handleImageArray } from "../../../util/common";
import { countryName, nameCountries, provinceName } from "../../../util/Data";
import IDproof from "./IDproof";

const initialFValues = {
    Name: '',
    // backofficeAccountNo: '1GDN-GDN-123456-M',
    address: '',
    aptOrSuite: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    phoneNumber: '',
    email: '',
    taxIdNum: '',
    isMailingAddressDifferent: false,
    mACompanyAddress: '',
    mACountry: '',
    mAAptOrSuite: '',
    mACity: '',
    mAState: '',
    mAZipCode: '',

}

const phonesEditorOptions = {
    mask: '+1 (X00) 000-0000',
    maskRules: { X: /[02-9]/ },
    placeholder: 'Please add country code for the area your number is in ex: the United States +1',
    maxLength: 11,
    inputAttr: {
        id: 'phoneNumber',
        autocomplete: 'chrome-off' // 'off' //'new-password' //
    }
}

function CompanyDetails() {
    const { values, setValues, errors, setErrors, handleInputChange } = useForm(initialFValues);
    const [countryCode, setCountryCode] = useState("us");
    const [formData, setFormData] = useState({ Name: "", isMailingAddressDifferent: false, country: "", state: "", });
    const [validatePhoneNumber, setValidatePhoneNumber] = useState(true);
    const [validateCountryCode, setValidateCountryCode] = useState(false);
    const [validateNumber, setValidateNumber] = useState(false);
    const [dropdownCountryData, setDropdownCountryData] = useState<Array<object>>([]);
    // const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isFirstTime = useRef(true);
    const company = useAppSelector(e => e.appform.company);
    const countryData = useAppSelector(e => e.appform.countryData);
    const applicationAlreadyexist = useAppSelector(e => {
        return e.appform.applicationAlreadyUpdated
    });
    const companyState = useRef<typeof company>({ ...company }).current;
    const { traderId } = useParams();

    // useEffect(() => {
    //     if (!isFirstTime.current) {
    //         ApiRequestAsync("GET", "/admin/ExtendedAccountDetail", {
    //             identifierCode: traderId
    //         }).then(res => {
    //             handleApplicationData(res);
    //         })
    //     }
    //     isFirstTime.current = false;
    // }, [traderId])

    useEffect(() => {
        if (!isFirstTime.current && traderId !== "" && !applicationAlreadyexist) {
            dispatch(getUserData(traderId as string))
        }
        isFirstTime.current = false;
    }, [traderId]);

    useEffect(() => {
        ApiGetCommonDataAsync("GET", "/Countries").then(responce => {
            dispatch(setCountryData(responce.data))
            let result = responce.data.map((count: { name: string; }) => count.name);
            setDropdownCountryData(result)
        })
    }, [])

    useEffect(() => {
        setFormData({
            ...company
            // maritalStatus: handleMaritalStatus(personalData.maritalStatus)!
        })
    }, [company])

    // const handleApplicationData = (Data: any) => {
    //     if (Data) {
    //         const { data } = Data;
    //         const ApplicationCompanyData = handleAplicationCompanyData(data.companyDetailsCore);
    //         const ApplicationBeneficiaryCompanyData = handleAplicationBeneficiaryCompanyData(data.signupInitialCore)
    //         const ApplicationOtherData = handleAplicationOtherPersonalData(data.otherData)
    //         const ApplicationFundingData = handleAplicationFundingData(data.accountFunding)
    //         if (ApplicationCompanyData && ApplicationCompanyData.companyDetailsResponce.Name && ApplicationCompanyData.companyDetailsResponce.Name !== "") dispatch(setCompany({ ...ApplicationCompanyData.companyDetailsResponce }))
    //         if (ApplicationBeneficiaryCompanyData && ApplicationBeneficiaryCompanyData.BeneficialArrayResponce && ApplicationBeneficiaryCompanyData.BeneficialArrayResponce.length > 0 && ApplicationBeneficiaryCompanyData.BeneficialArrayResponce[0].firstName && ApplicationBeneficiaryCompanyData.BeneficialArrayResponce.firstName !== "") dispatch(addedBeneficialData(ApplicationBeneficiaryCompanyData.BeneficialArrayResponce))
    //         if (ApplicationOtherData.incomeDetailResponce.Annual_Income && ApplicationOtherData.incomeDetailResponce.Annual_Income.toString() !== "") dispatch(setIncomeDetail({ ...ApplicationOtherData.incomeDetailResponce } as unknown as IIncomeDetail))
    //         if (ApplicationCompanyData.investmentRiskToleranceResponce.investmentRiskTolerance && ApplicationCompanyData.investmentRiskToleranceResponce.investmentRiskTolerance !== "") dispatch(setRisk(ApplicationCompanyData.investmentRiskToleranceResponce.investmentRiskTolerance as any))
    //         if (ApplicationOtherData.financialResponce.ANNUAL_EXPENSES && ApplicationOtherData.financialResponce.ANNUAL_EXPENSES.toString() !== "") dispatch(setFinancial({ ...ApplicationOtherData.financialResponce } as unknown as IFinancial))
    //         if (ApplicationOtherData.signatureResponce.accountTermsandConditions && ApplicationOtherData.signatureResponce.accountTermsandConditions) dispatch(setDisAndSig({ ...ApplicationOtherData.signatureResponce as IDisclosureSig }))
    //         if (ApplicationOtherData.disclosureResponce.abilityToBorrowFunds !== undefined && ApplicationOtherData.disclosureResponce.abilityToBorrowFunds) dispatch(setDisclosure(ApplicationOtherData.disclosureResponce as unknown as IDisclosure))
    //         if (ApplicationFundingData.fundingDataResponce.bankName !== undefined && ApplicationFundingData.fundingDataResponce.bankName) dispatch(setFunding({...ApplicationFundingData.fundingDataResponce}as unknown as IFunding))
    //     }
    // }

    const hanldeStoreState = (e: FieldDataChangedEvent) => {
        const { dataField: name, value } = e;
        // dispatch(setCompany({ [name as string]: value }))

        if (name === "country") {
            //@ts-ignore
            var data_filter = dropdownCountryData.filter(element => element.name == value)
            //@ts-ignore
            if (data_filter && data_filter[0].code && data_filter[0].code !== "") {
                //@ts-ignore
                setCountryCode(data_filter[0].name)
                //@ts-ignore
                dispatch(setCompany({ [name as string]: data_filter[0].code }))
            }
        } else {
            dispatch(setCompany({ [name as string]: value }))
        }
    }

    const handlePhoneInput = (e: any) => {
        if (e.length > 10 && e.length < 18) {
            setValidatePhoneNumber(false)
        } else {
            setValidatePhoneNumber(true)
        }
    }

    const resetCountryPhoneNumber = () => {
        setValidateCountryCode(false)
        // setValidatePhoneNumber(true)
        setValidateNumber(false)
    }

    const handlePhoneNumberBlur = (e: any) => {
        dispatch(setCompany({ ["phoneNumber"]: e.target.value }))
        if (e.target.value.length > 9) {
            resetCountryPhoneNumber()
        }
    }

    const phoneNumberRenderer = () => {
        return (
            <>
                <div className='d-flex' style={{
                    position: "relative"
                }} >
                    <PhoneInput
                        country={company.country.toLowerCase()}
                        value={company.phoneNumber}
                        onChange={handlePhoneInput}
                        onFocus={() => setValidateNumber(true)}
                        onBlur={handlePhoneNumberBlur}
                        inputClass={!validateCountryCode ? "custom-phone" : "custom-phone-error"}
                        enableAreaCodeStretch
                        countryCodeEditable={false}
                        inputProps={{
                            name: 'phone',
                            required: true,
                        }}
                    />
                    {validateCountryCode && <div className='areaChart'>
                        <div className='phone-validation pr-4' >!</div>
                    </div>}
                </div>
                {(validateNumber && validateCountryCode) && <p className='text-field-validation-message'> Phone Number is required  </p>}
            </>

        )
    }


    return (
        <div>
            <div className="row">
                <div className="col-md-12 signUpBoxShadow mt-5 mb-3">
                    <div className="long-title"> <h3 className="fs-title">Company Details</h3></div>
                    <Form
                        formData={formData}
                        onFieldDataChanged={hanldeStoreState}
                        colCount={1}
                        showColonAfterLabel={false}
                        readOnly={false}
                        showValidationSummary={false}
                        validationGroup="customerData"
                        labelLocation="top">
                        <GroupItem colCount={4}>
                            <SimpleItem dataField="Name" editorOptions={{
                                placeholder: '',
                                maxLength: 50,
                                mode: "alphabet",
                                inputAttr: {
                                    id: 'companyNameDB',
                                    autocomplete: 'off' // 'off' //'new-password' //
                                }
                            }}
                                isRequired={true}>
                                <Label text="Company Name" />
                                <RequiredRule
                                    message="Company name is required"
                                />
                                <PatternRule
                                    pattern=""
                                    message="Company name is required"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="backofficeAccountNo" editorOptions={{
                                placeholder: '',
                                disabled: true
                            }}
                                isRequired={true}>
                                <Label text="Backoffice Account No" />
                                <RequiredRule
                                    message="Backoffice AccountNo is required"
                                />
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem colCount={2}>
                            <SimpleItem dataField="address" editorOptions={{
                                placeholder: '',
                                maxLength: 100,
                                inputAttr: {
                                    id: 'addressDB',
                                    autocomplete: 'off' // 'off' //'new-password' //
                                }
                            }}
                                isRequired={true}>
                                <Label text="Address" />
                                <RequiredRule
                                    message="Address is required"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="aptOrSuite" editorOptions={{
                                placeholder: '',
                                maxLength: 5,
                                mode: "alphabet",
                                inputAttr: {
                                    id: 'AptOrSuiteDB',
                                    autocomplete: 'off' // 'off' //'new-password' //
                                }
                            }}>
                                <Label text="Apt/Suite" />
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem colCount={4}>
                            <SimpleItem dataField="country" editorType="dxSelectBox"
                                editorOptions={{
                                    dataSource: dropdownCountryData,
                                    searchEnabled: true,
                                    placeholder: 'Please Select',
                                    inputAttr: {
                                        id: 'dropdownCountryDataDB',
                                        autocomplete: 'off' // 'off' //'new-password' //
                                    }
                                }} validationRules={[{ type: 'required', message: 'Country is required.' }]} />
                            <SimpleItem dataField="state" editorType="dxSelectBox"
                                editorOptions={{
                                    dataSource: provinceName,
                                    searchEnabled: true,
                                    placeholder: 'Please Select',
                                    inputAttr: {
                                        id: 'provinceNameDB',
                                        autocomplete: 'off' // 'off' //'new-password' //
                                    }
                                }} validationRules={[{ type: 'required', message: 'States/Province is required.' }]}>
                                <Label text="States/Province" />
                            </SimpleItem>
                            <SimpleItem dataField="city" editorOptions={{
                                placeholder: '',
                                maxLength: 50,
                                inputAttr: {
                                    id: 'cityDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
                                }
                            }}
                                isRequired={true}>
                                <PatternRule
                                    pattern="^[a-z A-Z]+$"
                                    message="Characters from A-Z accepted only"
                                />
                                <RequiredRule
                                    message="City is required"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="zipCode" editorOptions={{
                                placeholder: '',
                                maxLength: 10,
                                inputAttr: {
                                    id: 'zipCodeDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
                                }
                            }}
                                isRequired={true}>
                                <PatternRule
                                    pattern="^[0-9a-z A-Z]+$"
                                    message="Characters from A-Z and 0-9 are accepted only"
                                />
                                <RequiredRule
                                    message="Zip Code is required"
                                />
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem colCount={3}>
                            <SimpleItem dataField="email" editorOptions={{
                                placeholder: '',
                                autocomplete: 'off',
                                autofill: 'off'
                            }}
                                isRequired={true}>
                                <RequiredRule
                                    message="Please Enter a Valid Email Address"
                                />
                                <PatternRule
                                    pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$"
                                    message="Please Enter a Valid Email Address"
                                />
                            </SimpleItem>
                            <SimpleItem
                                render={phoneNumberRenderer}
                                dataField="phoneNumber"
                                editorOptions={phonesEditorOptions}
                                // helpText="Phone numbers are checked for validity in the country that your are applying"
                                isRequired={true}>
                                <Label text="Company Phone #" />
                                <PatternRule
                                    pattern="\(?\d{3}\)?-? *\d{3}-? *-?\d{4}"
                                    message="Invalid format"
                                />
                                <RequiredRule
                                    message="phone is required"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="taxIdNum" editorOptions={{
                                placeholder: '',
                            }}
                                isRequired={true}>
                                <Label text="LLC's Tax ID/EIN Number" />
                                <RequiredRule
                                    message="LLC's Tax ID/EIN Number"
                                />
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem>
                            <SimpleItem dataField="isMailingAddressDifferent" label={{ visible: false }} editorType="dxCheckBox" editorOptions={{ text: "Mailing Address (If Different)" }} />
                        </GroupItem>
                        {company.isMailingAddressDifferent && <GroupItem
                            colCount={4}>
                            <SimpleItem dataField="mACompanyAddress" editorOptions={{
                                placeholder: '',
                                maxLength: 100,
                                inputAttr: {
                                    id: 'mACompanyAddressDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
                                }
                            }}
                                colSpan={3}
                                isRequired={true}>
                                <Label text="Address" />
                                <RequiredRule
                                    message="Address is required"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="mAAptOrSuite" colSpan={1} editorOptions={{
                                placeholder: '',
                                maxLength: 5,
                                inputAttr: {
                                    id: 'maAptOrSuiteDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
                                }
                            }}>
                                <Label text="Apt/Suite" />
                            </SimpleItem>
                            <SimpleItem dataField="mACountry" colSpan={1} editorType="dxSelectBox"
                                editorOptions={{
                                    dataSource: countryName,
                                    searchEnabled: true,
                                    placeholder: 'Please Select',
                                    inputAttr: {
                                        id: 'maCountryDB',
                                        autocomplete: 'chrome-off' // 'off' //'new-password' //
                                    }
                                }} validationRules={[{ type: 'required', message: 'Country is required.' }]}>
                                <Label text="Country" />
                            </SimpleItem>
                            <SimpleItem dataField="mAState" colSpan={1} editorType="dxSelectBox"
                                editorOptions={{
                                    dataSource: provinceName,
                                    searchEnabled: true,
                                    placeholder: 'Please Select',
                                    inputAttr: {
                                        id: 'maStateDB',
                                        autocomplete: 'chrome-off' // 'off' //'new-password' //
                                    }
                                }} validationRules={[{ type: 'required', message: 'States/Province is required.' }]}>
                                <Label text="States/Province" />
                            </SimpleItem>
                            <SimpleItem dataField="mACity" colSpan={1} editorOptions={{
                                placeholder: '',
                                maxLength: 50,
                                inputAttr: {
                                    id: 'mACityDB',
                                    autocomplete: 'chrome-off', // 'off' //'new-password' //
                                    maxLength: 50
                                }
                            }}
                                isRequired={true}>
                                <Label text="City" />
                                <PatternRule
                                    pattern="^[a-z A-Z]+$"
                                    message="Characters from A-Z accepted only"
                                />
                                <RequiredRule
                                    message="City is required"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="mAZipCode" editorOptions={{
                                placeholder: '',
                                maxLength: 5,
                                inputAttr: {
                                    id: 'maZipCodeDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
                                }
                            }}
                                isRequired={true}>
                                <PatternRule
                                    pattern="^[0-9a-z A-Z]+$"
                                    message="Characters from A-Z and 0-9 are accepted only"
                                />
                                <Label text="Zip Code" />
                                <RequiredRule
                                    message="Zip Code is required"
                                />
                            </SimpleItem>
                        </GroupItem>}
                    </Form>
                    <div className="col-md-12 mt-4" style={{ border: "1px solid #e5e5e5", marginTop: "12px" }}> </div>
                    <IDproof />
                </div>
            </div>

        </div>
    )
}

export default CompanyDetails;

function setImage(arg0: { FrontImage: any; BackImage: any; }) {
    throw new Error("Function not implemented.");
}
