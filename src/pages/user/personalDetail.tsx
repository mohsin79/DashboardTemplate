import { ClickEvent } from 'devextreme/ui/button';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css'
import { useForm } from '../../components/useFrom';
import { ApiRequestAsync } from '../../services/httpservice';
import { Link, useNavigate } from 'react-router-dom';
import Form, { ButtonItem, GroupItem, Label, PatternRule, RequiredRule, SimpleItem } from 'devextreme-react/form';
import { countryName, nameCountries, provinceName } from '../../util/Data';
import { useStore } from '../../store/store';
import { useState, forwardRef, useEffect, useRef } from 'react';
import { encryptFormData, handleAplicationOtherPersonalData, handleAplicationPersonalData } from '../../util/common';
import { FileUploader, LoadPanel, RadioGroup } from 'devextreme-react';
import Loader from '../../components/Loader/Loader';
import { toastError, toastSuccess } from '../../util/toaster/Toaster';
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/storehook';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import { setPerosnal, next, setIdentityInfo, setProfessional, setIncomeDetail, setRisk, setFinancial, setIdentityProof, setDisclosure, setDisAndSig, getUserData } from '../../store/appreducer';
import { IDisclosure, IDisclosureSig, IFinancial, IIdentityProof, IIncomeDetail, IPersonal } from '../../store/Interfaces';
import { NativeEventInfo } from 'devextreme/events';
import dxRadioGroup from 'devextreme/ui/radio_group';

let initialFValues = {
    firstName: '',
    lastName: '',
    address: '',
    aptOrSuite: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    phoneNumber: '',
    numberOfDependents: '',
    maritalStatus: 'S',
    isMailingAddressDifferent: false,
    maAddress: '',
    maAptOrSuite: '',
    maCountry: '',
    maCity: '',
    maState: '',
    maZipCode: '',
    isTrustedContactPersonAvailable: false,
    tcpName: '',
    tcpPhoneNumber: '',
    tcpAddress: '',
    tcpEmail: '',
    tcpCountry: '',
    tcpCity: '',
    tcpZip: '',
    tcpRelationToAccountHolder: '',
    tcpDateOfBirth: ''
}

const status = [
    "Single", "Married", "Divorced", "Widowed"
]

const fileExtensions = ['.pdf'];

const dateBoxOptions = {
    invalidDateMessage:
        'The date must have the following format: MM/dd/yyyy',
    width: '100%',
    displayFormat: "MMM-dd-yyyy",
    inputAttr: {
        id: 'tcpDateOfBirthDB',
        autocomplete: 'chrome-off' // 'off' //'new-password' //
    }
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

const numberOfDependentEditorOptions = {
    maskRules: "/[02-9]/",
    maxLength: 1,
    inputAttr: {
        id: 'numberOfDependents',
        autocomplete: 'chrome-off', // 'off' //'new-password' //
        maxLength: 1,
    }
}

const countryEditorOptions = {
    dataSource: countryName,
};

const stateEditorOptions = {
    dataSource: provinceName,
};

function PersonalDetails({ beneficialCertificate = null, setBeneficialCertificate = null, index = 0 }: any) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ firstName: "", maritalStatus: "Single", isMailingAddressDifferent: false, country: "", state: "", });
    const [validateCountryCode, setValidateCountryCode] = useState(false);
    const [validateform, setValidateForm] = useState(false);
    const [validatePhoneNumber, setValidatePhoneNumber] = useState(true);
    const [validateNumber, setValidateNumber] = useState(false);
    const [countryCode, setCountryCode] = useState("us");
    const [validateTcpCountryCode, setValidateTcpCountryCode] = useState(false);
    const [validateTcpPhoneNumber, setValidateTcpPhoneNumber] = useState(true);
    const [validateTcpNumber, setValidateTcpNumber] = useState(false);
    const [countrytcpCode, setCountrytcpCode] = useState("us");
    const { type } = useParams();

    const personalData = useAppSelector(e => {
        return e.appform.perosnal
    });

    const countryData = useAppSelector(e => {
        return e.appform.countryData
    });

    const applicationAlreadyexist = useAppSelector(e => {
        return e.appform.applicationAlreadyUpdated
    });
    //  const personalState = useRef<typeof personalData>({ ...personalData }).current;

    const dispatch = useAppDispatch();
    const isFirstTime = useRef(true);
    const { traderId } = useParams();

    const handleMaritalStatus = (martialStatus: string) => {
        if (martialStatus === "S") {
            return "Single"
        } else if (martialStatus === "M") {
            return "Married"
        } else if (martialStatus === "D") {
            return "Divorced"
        } else if (martialStatus === "W") {
            return "Widowed"
        }
    }


    useEffect(() => {
        setFormData({
            ...personalData
        })
    }, [personalData])

    useEffect(() => {
        if (!isFirstTime.current && traderId !== "" && !applicationAlreadyexist) {
            dispatch(getUserData(traderId as string))
        }
        isFirstTime.current = false;
    }, [traderId])

    const buttonOptions = {
        text: 'Next',
        type: 'default',
        useSubmitBehavior: true,
        onClick: (e: any) => {
            handleSubmit(e)
        }
    }

    const resetCountryPhoneNumber = () => {
        setValidateCountryCode(false)
        // setValidatePhoneNumber(true)
        setValidateNumber(false)
    }

    const resetCountryTcpCountryphone = () => {
        setValidateTcpCountryCode(false)
        // setValidateTcpPhoneNumber(true)
        setValidateTcpNumber(false)
    }

    const handlePhoneNumberBlur = (e: any) => {
        dispatch(setPerosnal({ ["phoneNumber"]: e.target.value }))
        if (e.target.value.length > 9) {
            resetCountryPhoneNumber()
        }
    }

    const handlePhoneNumberTcpBlur = (e: any) => {
        dispatch(setPerosnal({ ["tcpPhoneNumber"]: e.target.value }))
        if (e.target.value.length > 9) {
            resetCountryTcpCountryphone()
        }
    }

    const hanldeStoreState = (e: FieldDataChangedEvent) => {
        const { dataField: name, value } = e;
        // if (type === "6")
        //     dispatch(setPerosnalList({ data: { [name as string]: value }, index }))
        // else
        if (name === "country") {
            var data_filter = nameCountries.filter(element => element.country == value)
            if (data_filter && data_filter[0].code && data_filter[0].code !== "") {
                setCountryCode(data_filter[0].code)
            }
        } else if (name === "tcpCountry") {
            var data_filter = nameCountries.filter(element => element.country == value)
            if (data_filter && data_filter[0].code && data_filter[0].code !== "") {
                setCountrytcpCode(data_filter[0].code)
            }
        } else if (name === "isMailingAddressDifferent") {
            resetCountryPhoneNumber()
        } else if (name === "isTrustedContactPersonAvailable") {
            resetCountryTcpCountryphone()
        }
        if (name === "numberOfDependents" && typeof value === "number") {
            dispatch(setPerosnal({ [name as string]: value.toString() }))
        } else {
            dispatch(setPerosnal({ [name as string]: value }))
        }
    }


    const handleFileUpload = async (File: Array<File>) => {
        if (File && File.length > 0) {
            setBeneficialCertificate(File[0]);
            const reader = new FileReader();
            reader.readAsDataURL(File[0]);
        }
    }

    const handleSubmit = (e: ClickEvent) => {
        const { isValid } = e.validationGroup.validate();
        setValidateForm(true)
        // setValidateCountry(true)
        if (isValid && (personalData.phoneNumber.length > 9 && personalData.phoneNumber.length < 21)) {
            if (personalData.isTrustedContactPersonAvailable && (personalData.tcpPhoneNumber.length < 9 || personalData.tcpPhoneNumber.length > 21)) {
                setValidateTcpCountryCode(true)
                return;
            }
            setLoading(true)
            let PostAPIData = {
                ...personalData,
                tcpDateOfBirth: personalData.isTrustedContactPersonAvailable ? personalData.tcpDateOfBirth?.toISOString() : personalData.tcpDateOfBirth,
                maritalStatus: personalData.maritalStatus.charAt(0)
            }
            dispatch(next());
            ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=1`, encryptFormData(PostAPIData)).then(() => {
                toastSuccess("Personal details added successfully");
                setLoading(false)
                dispatch(next());
            }).catch((error) => {
                setLoading(false)
                toastError(error.message);
            });
        } else if (personalData.phoneNumber.length < 9 || personalData.phoneNumber.length > 21) {
            setValidateCountryCode(true)
            if (personalData.isTrustedContactPersonAvailable && (personalData.tcpPhoneNumber.length < 9 || personalData.tcpPhoneNumber.length > 21)) setValidateTcpCountryCode(true)
        } else if (personalData.isTrustedContactPersonAvailable && (personalData.tcpPhoneNumber.length < 9 || personalData.tcpPhoneNumber.length > 21)) {
            setValidateTcpCountryCode(true)
        }
    }

    const handlePhoneInput = (e: any) => {
        if (e.length > 9 && e.length < 21) {
            setValidatePhoneNumber(false)
        } else {
            setValidatePhoneNumber(true)
        }
    }

    const handleTcpPhoneInput = (e: any) => {
        if (e.length > 9 && e.length < 21) {
            setValidateTcpPhoneNumber(false)
        } else {
            setValidateTcpPhoneNumber(true)
        }
    }

    const phoneNumberRenderer = () => {
        return (
            <>
                <div className='d-flex' style={{
                    position: "relative"
                }} >
                    <PhoneInput
                        country={countryCode.toLowerCase()}
                        value={personalData.phoneNumber}
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

    const TcpPhoneNumber = () => {
        return (
            <>
                <div className='d-flex' style={{
                    position: "relative"
                }} >
                    <PhoneInput
                        country={countrytcpCode.toLowerCase()}
                        value={personalData.tcpPhoneNumber}
                        onChange={handleTcpPhoneInput}
                        onFocus={() => setValidateTcpNumber(true)}
                        onBlur={handlePhoneNumberTcpBlur}
                        inputClass={!validateTcpCountryCode ? "custom-phone" : "custom-phone-error"}
                        enableAreaCodeStretch
                        countryCodeEditable={false}
                        inputProps={{
                            name: 'phone',
                            required: true,
                        }}
                    />
                    {validateTcpCountryCode && <div className='areaChart'>
                        <div className='phone-validation pr-4' >!</div>
                    </div>}
                </div>
                {(validateTcpNumber && validateTcpCountryCode) && <p className='text-field-validation-message'> Phone Number is required  </p>}
            </>

        )
    }

    const handleMartialStatusState = (e: NativeEventInfo<dxRadioGroup, Event>) => {
        dispatch(setPerosnal({ ["maritalStatus"]: `${e}` }))
    }


    // const handleMartialStatus = () => {
    //     return (
    //         <div className='row' style={{ marginLeft: "14px", marginTop: "15px" }} >
    //             <div className={`col-lg-2 mr-2 text-center ${personalData.maritalStatus === "Single" ? "martialStatus-focused" : "martialStatus"} `} onClick={() => handleMartialStatusState("Single")} ><label className='margin-martial'>Single</label></div>
    //             <div className={`col-lg-2 mr-2 text-center ${personalData.maritalStatus === "Married" ? "martialStatus-focused" : "martialStatus"}`} onClick={() => handleMartialStatusState("Married")}><label className='margin-martial'>Married</label></div>
    //             <div className={`col-lg-2 mr-2 text-center ${personalData.maritalStatus === "Divorced" ? "martialStatus-focused" : "martialStatus"}`} onClick={() => handleMartialStatusState("Divorced")}><label className='margin-martial'>Divorced</label></div>
    //             <div className={`col-lg-2 mr-2 text-center ${personalData.maritalStatus === "Widowed" ? "martialStatus-focused" : "martialStatus"}`} onClick={() => handleMartialStatusState("Widowed")}><label className='margin-martial'>Widowed</label></div>
    //         </div>
    //     )
    // }

    const handleMartialStatus = () => {
        return (
            <div className="dx-field">
                <div className="dx-field-label">Are You</div>
                <div className="dx-field-value">
                    <RadioGroup value={personalData.maritalStatus} items={status} onValueChange={handleMartialStatusState} layout="horizontal" />
                </div>
            </div>
        )
    }

    const onChange = (e: any) => {
        let target = e.event.target;
        var hasNumber = /\d/;
        if (hasNumber.test(target.value)) {
            // dispatch(setPerosnal({ [target.name as string]: target.value }))
        }
    }

    return (
        <>
            <div className="row" id='Personal_Details'>
                <div className={`align-center signUpBoxShadow col-md-12  ${type === "1" ? "my-4" : "mt-3 mb-3 mx-2"}`}>
                    <div className="long-title">  <h3 className="fs-title">Personal Details</h3> </div>
                    <Loader loading={loading} />
                    <Form
                        formData={formData}
                        onFieldDataChanged={hanldeStoreState}
                        // onContentReady={vali}
                        colCount={1}
                        showColonAfterLabel={false}
                        // readOnly={false}
                        showValidationSummary={true}
                        validationGroup="customerData"
                        labelLocation="top">
                        <GroupItem colCount={4}>
                            <SimpleItem dataField="firstName" editorType="dxTextBox"
                                editorOptions={{
                                    placeholder: '',
                                    maxLength: 50,
                                    mode: "alphabet",
                                    inputAttr: {
                                        id: 'firstNameDB',
                                        autocomplete: 'off',
                                        type: "text"
                                    }

                                }}
                                isRequired={true}>
                                <RequiredRule
                                    message="First name is required"
                                />
                                <PatternRule
                                    pattern="^[a-zA-Z.]+$"
                                    message="Characters from A-Z and Dot accepted only"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="lastName" editorType="dxTextBox" editorOptions={{
                                placeholder: '',
                                values: '',
                                maxLength: 50,
                                inputAttr: {
                                    id: 'lastNameDB',
                                    autocomplete: 'off'
                                }
                            }}
                                isRequired={true}>
                                <RequiredRule
                                    message="Last name is required"
                                />
                                <PatternRule
                                    pattern="^[a-zA-Z. ]+$"
                                    message="Characters from A-Z and Dot accepted only"
                                />
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem colCount={2}>
                            <SimpleItem dataField="address" editorType="dxTextBox" editorOptions={{
                                placeholder: '',
                                maxLength: 100,
                                inputAttr: {
                                    id: 'addressDB',
                                    autocomplete: 'chrome-off'
                                }
                            }}
                                isRequired={true}>
                                <RequiredRule
                                    message="Address is required"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="aptOrSuite" editorType="dxTextBox" editorOptions={{
                                placeholder: '',
                                maxLength: 5,
                                inputAttr: {
                                    id: 'aptOrSuiteDB',
                                    autocomplete: 'chrome-off'
                                }
                            }}>
                                <Label text="Apt/Suite" />
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem colCount={4}>
                            <SimpleItem dataField="country" editorType="dxSelectBox" editorOptions={{
                                dataSource: countryData,
                                searchEnabled: true,
                                valueExpr: "isO2",
                                displayExpr: "name",
                                placeholder: 'Please Select',
                                inputAttr: {
                                    id: 'countryDB',
                                    autocomplete: 'chrome-off', // 'off' //'new-password' //

                                }
                            }}
                                isRequired={true}

                            >
                                <Label text="Country" />
                                <RequiredRule
                                    message="Country is required"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="state" editorType="dxSelectBox"
                                editorOptions={{
                                    dataSource: provinceName,
                                    searchEnabled: true,
                                    placeholder: 'Please Select',
                                    inputAttr: {
                                        id: 'stateDB',
                                        autocomplete: 'chrome-off'
                                    }
                                }}
                                validationRules={[{ type: 'required', message: 'States/Province is required.' }]}>
                                <Label text="States/Province" />
                            </SimpleItem>
                            <SimpleItem dataField="city" editorOptions={{
                                placeholder: '',
                                maxLength: 50,
                                inputAttr: {
                                    id: 'cityDB',
                                    autocomplete: 'chrome-off'
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
                            <SimpleItem dataField="zipCode" editorType="dxTextBox" editorOptions={{
                                placeholder: '',
                                maxLength: 10,
                                inputAttr: {
                                    id: 'zipCodeDB',
                                    autocomplete: 'chrome-off'
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
                        <GroupItem>
                            <SimpleItem dataField="isMailingAddressDifferent" cssClass={"formCheckbox"} label={{ visible: false }} editorType="dxCheckBox" editorOptions={{ text: "Mailing Address (If Different)" }} />
                        </GroupItem>
                        {
                            personalData.isMailingAddressDifferent && <GroupItem

                                colCount={2}
                            >
                                <GroupItem>
                                    <SimpleItem dataField="maAddress" editorType="dxTextBox" editorOptions={{
                                        placeholder: '',
                                        maxLength: 100,
                                        inputAttr: {
                                            id: 'maAddressDB',
                                            autocomplete: 'chrome-off'
                                        }
                                    }}
                                        isRequired={true}>
                                        <Label text="Address" />
                                        <RequiredRule
                                            message="Address is required"
                                        />
                                    </SimpleItem>
                                </GroupItem>
                                <SimpleItem dataField="maAptOrSuite" editorType="dxTextBox" editorOptions={{
                                    placeholder: '',
                                    maxLength: 5,
                                    inputAttr: {
                                        id: 'maAptOrSuiteDB',
                                        autocomplete: 'chrome-off'
                                    }
                                }}>
                                    <Label text="Apt/Suite" />
                                </SimpleItem>
                            </GroupItem>
                        }

                        {personalData.isMailingAddressDifferent && <GroupItem
                            colCount={4}>
                            <SimpleItem dataField="maCountry" editorType="dxSelectBox" editorOptions={{
                                dataSource: countryName,
                                searchEnabled: true,
                                placeholder: 'Please Select',
                                inputAttr: {
                                    id: 'maCountryDB',
                                    autocomplete: 'chrome-off', // 'off' //'new-password' //
                                }
                            }} validationRules={[{ type: 'required', message: 'Country is required.' }]}>
                                <Label text="Country" />
                            </SimpleItem>
                            <SimpleItem dataField="maState" editorType="dxSelectBox" editorOptions={{
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
                            <SimpleItem dataField="maCity" editorType="dxTextBox" editorOptions={{
                                placeholder: '',
                                maxLength: 50,
                                inputAttr: {
                                    id: 'maCityDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
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
                            <SimpleItem dataField="maZipCode" editorType="dxTextBox" editorOptions={{
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
                        <GroupItem
                            colCount={2}>
                            <SimpleItem dataField="phoneNumber"
                                render={phoneNumberRenderer}
                                // helpText="Phone numbers are checked for validity in the country that your are applying"
                                isRequired={true}>
                                <Label text="Phone Number" />
                                <RequiredRule
                                    message="phone Number is required"
                                />
                                <PatternRule
                                    pattern="\(?\d{3}\)?-? *\d{3}-? *-?\d{4}"
                                    message="Invalid format"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="numberOfDependents" editorType="dxNumberBox" editorOptions={numberOfDependentEditorOptions}
                                isRequired={true}>
                                <PatternRule
                                    pattern="^[0-9\b]+$"
                                    message="Only accept 0-9"
                                />
                                <RequiredRule
                                    message="Number Of Dependents is required"
                                />
                            </SimpleItem>
                        </GroupItem>
                        {/* @ts-ignore */}
                        <GroupItem
                            colCount={2}
                        >
                            <SimpleItem dataField="maritalStatus" editorType="dxSelectBox"
                                render={handleMartialStatus}
                                label={{ visible: false }}
                                editorOptions={{
                                    dataSource: status,
                                    maxLength: 1,
                                    inputAttr: {
                                        id: 'maritalStatusDB',
                                        autocomplete: 'chrome-off' // 'off' //'new-password' //
                                    }
                                }} validationRules={[{ type: 'required', message: 'Marital Status is required.' }]}>
                                {/* <Label location={"left"} text="Are You" /> */}
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem>
                            <SimpleItem dataField="isTrustedContactPersonAvailable" cssClass={"formCheckbox"} label={{ visible: false }} editorType="dxCheckBox" editorOptions={{ text: "Would you like to add a Trusted Contact Person" }} />
                        </GroupItem>
                        {personalData.isTrustedContactPersonAvailable && <GroupItem
                            colCount={2}>
                            <SimpleItem dataField="tcpName" editorType="dxTextBox" editorOptions={{
                                placeholder: '',
                                maxLength: 50,
                                inputAttr: {
                                    id: 'tcpNameDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
                                }
                            }}
                                isRequired={true}>
                                <PatternRule
                                    pattern="^[a-z A-Z. ]+$"
                                    message="Characters from A-Z accepted only"
                                />
                                <Label text="Name" />
                                <RequiredRule
                                    message="Name is required"
                                />
                            </SimpleItem>

                            <SimpleItem dataField="tcpEmail" editorType="dxTextBox" editorOptions={{
                                placeholder: '',
                                inputAttr: {
                                    id: 'tcpEmail',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
                                }
                            }}
                                isRequired={true}>
                                <Label text="Email" />
                                <RequiredRule
                                    message="Email is required"
                                />
                                <PatternRule
                                    pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$"
                                    message="Email is InValid"
                                />
                            </SimpleItem>
                        </GroupItem>}
                        {personalData.isTrustedContactPersonAvailable && <GroupItem
                            colCount={2}>
                            <SimpleItem dataField="tcpAddress" editorType="dxTextBox" editorOptions={{
                                placeholder: '',
                                maxLength: 100,
                                inputAttr: {
                                    id: 'tcpAddressDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
                                }
                            }}
                                isRequired={true}>
                                <Label text="Address" />
                                <RequiredRule
                                    message="Street Address is required"
                                />
                            </SimpleItem>
                            <SimpleItem
                                render={TcpPhoneNumber}
                                dataField="tcpPhoneNumber"
                                editorType="dxTextBox"
                                editorOptions={phonesEditorOptions}
                                isRequired={true}>
                                <PatternRule
                                    pattern="\(?\d{3}\)?-? *\d{3}-? *-?\d{4}"
                                    message="Invalid format"
                                />
                                <Label text="Phone Number" />
                                <RequiredRule
                                    message="Phone Number is required"
                                />
                            </SimpleItem>
                        </GroupItem>}
                        {personalData.isTrustedContactPersonAvailable && <GroupItem
                            colCount={4}>
                            <SimpleItem dataField="tcpCountry" editorType="dxSelectBox" colSpan={0.75} editorOptions={{
                                dataSource: countryName,
                                inputAttr: {
                                    id: 'tcpCountryDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
                                }
                            }} validationRules={[{ type: 'required', message: 'Country is required.' }]} >
                                <Label text="Country" />
                            </SimpleItem>
                            <SimpleItem dataField="tcpState" editorType="dxSelectBox" editorOptions={{
                                dataSource: provinceName,
                                inputAttr: {
                                    id: 'tcpStateDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
                                }
                            }} validationRules={[{ type: 'required', message: 'States/Province is required.' }]}>
                                <Label text="States/Province" />
                            </SimpleItem>
                            <SimpleItem dataField="tcpCity" editorType="dxTextBox" editorOptions={{
                                placeholder: '',
                                maxLength: 50,
                                inputAttr: {
                                    id: 'tcpCityDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
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
                            <SimpleItem dataField="tcpZip" editorType="dxTextBox" editorOptions={{
                                placeholder: '',
                                maxLength: 10,
                                inputAttr: {
                                    id: 'tcpZipDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
                                }
                            }}
                                isRequired={true}>
                                <Label text="Zip Code" />
                                <PatternRule
                                    pattern="^[0-9a-z A-Z]+$"
                                    message="Characters from A-Z and 0-9 are accepted only"
                                />
                                <RequiredRule
                                    message="Zip Code is required"
                                />
                            </SimpleItem>
                        </GroupItem>}
                        {personalData.isTrustedContactPersonAvailable && <GroupItem
                            colCount={2}
                            visible={personalData.isTrustedContactPersonAvailable}>
                            <SimpleItem dataField="tcpRelationToAccountHolder" editorType="dxTextBox" editorOptions={{
                                placeholder: '',
                                inputAttr: {
                                    id: 'tcpRelationToAccountHolderDB',
                                    autocomplete: 'chrome-off' // 'off' //'new-password' //
                                }
                            }}
                                isRequired={true}>
                                <Label text="Relationship To Account Holder" />
                                <RequiredRule
                                    message="Relationship To Account Holder is required"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="tcpDateOfBirth"
                                editorType="dxDateBox"
                                editorOptions={dateBoxOptions}>
                                <Label text="Date of birth" />
                                <RequiredRule message="Date of birth is required" />
                            </SimpleItem>
                        </GroupItem>}
                        {type === "1" && <ButtonItem horizontalAlignment="right"
                            cssClass={"buttonTxt mt-3"}
                            buttonOptions={buttonOptions}
                        />}
                    </Form>
                    {type !== "1" && <>
                        <p className="my-4">Please download the "Certificate of Beneficial Ownership" by clicking <Link to=""> HERE </Link>. Please complete, sign and upload the completed form HERE.</p>
                        <div className="w-100 d-flex fileuploader-container" >
                            <div className="w-50">
                                <div className="file-uploader-block">
                                    <FileUploader minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={fileExtensions} onValueChange={(file) => handleFileUpload(file)} selectButtonText="Choose File" labelText="" accept='.pdf' uploadMode="useForm" />
                                </div>
                                {beneficialCertificate === null && <div className="ml-0 my-2" style={{ color: "red" }}> Please fillout and upload the Certificate of Beneficial Ownership. </div>}
                            </div>
                        </div>
                    </>}
                    {validateCountryCode && <div className=" mt-2 dx-item dx-validationsummary-item"><div className="dx-item-content dx-validationsummary-item-content">Phone number is required</div></div>}
                    {validateTcpCountryCode && <div className=" mt-2 dx-item dx-validationsummary-item"><div className="dx-item-content dx-validationsummary-item-content">Phone number is required</div></div>}
                </div>
            </div>
        </>
    )
}

export default PersonalDetails;     