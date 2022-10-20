import React, { useEffect, useState } from 'react';
import Form, { ButtonItem, GroupItem, Label, PatternRule, RequiredRule, SimpleItem } from 'devextreme-react/form';
import { countryName, IDType, nameCountries, provinceName } from '../../../util/Data';
import { Link, useParams } from 'react-router-dom';
import { FileUploader, RadioGroup, SelectBox } from 'devextreme-react';
import { next, previous, setBeneficialData, setBeneficialDetailScreen, showBeneficialPhoneValidation } from '../../../store/appreducer';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { ClickEvent } from 'devextreme/ui/button';
import { FieldDataChangedEvent } from 'devextreme/ui/form';
import Loader from '../../../components/Loader/Loader';
import PhoneInput from 'react-phone-input-2';
import { encryptFile, encryptFormData, handleImageArray } from '../../../util/common';
import { ApiRequestAsync } from '../../../services/httpservice';
import { toastError, toastSuccess } from '../../../util/toaster/Toaster';

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
        autocomplete: 'chrome-off' // 'off' //'new-password' //
    }
}

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

const fileExtensionPersonal = ['.pdf'];
const simpleProducts = ["Government Issued ID", "Utility Bill & Passport"]
const fileExtensions = ['.jpeg', '.jpg', '.png'];
const status = ["Single", "Married", "Divorced", "Widowed"]

function BeneficiaryDetail({ data, index }: { data: any, index: number }) {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<any>({});
    const [phoneNumber, setPhoneNumber] = useState<string>("+1");
    const beneficialPhoneValidation = useAppSelector(e => e.appform.beneficialPhoneValidation);
    const beneficialData = useAppSelector(e => e.appform.beneficialList);
    const selectedBeneficiaryIndex = useAppSelector(e => e.appform.selectedBeneficiaryIndex);
    const [hideValidation, setHidaValidation] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [formDataFile, setFormDataFile] = useState<{ FrontImage: File[] | undefined, BackImage: File[] | undefined }>({
        FrontImage: undefined,
        BackImage: undefined
    })
    const [image, setImage] = useState({
        frontIdentification: "",
        backIdentification: ""
    })
    const { type } = useParams();

    useEffect(() => {
        setTimeout(() => {
            setFormData({ ...data })
            setHidaValidation(true)
        }, 400);
    }, [])

    useEffect(() => {

        setTimeout(() => {
            if (selectedBeneficiaryIndex !== -1 && beneficialData.length > 0) {
                setPhoneNumber(beneficialData[selectedBeneficiaryIndex].phoneNumber)
                if (beneficialData[selectedBeneficiaryIndex].country === "") {
                    setFormData({
                        ...data,
                        countrycode: 'us'
                    })
                }
            }
        }, 600);
    }, [selectedBeneficiaryIndex])

    // const beneficiary = useAppSelector(e => e.appform.beneficialList[index])

    // const handleFileImageUpload = async (File: Array<File>, key: string) => {
    //     if (File && File.length > 0) {
    //         dispatch(setBeneficialData({ data: { [key as string]: File[0] }, index: index }))
    //         const reader = new FileReader();
    //         reader.readAsDataURL(File[0]);

    //     }
    // }

    const handleFileImageUpload = async (File: Array<File>, key: string) => {
        if (File && File.length > 0) {
            if (key !== "boForm") {
                if (key === "frontIdentification") {
                    setFormDataFile({ ...formDataFile, ["FrontImage"]: File });
                } else {
                    setFormDataFile({ ...formDataFile, ["BackImage"]: File });
                }
                dispatch(setBeneficialData({ data: { [key as string]: File[0] }, index: index }))
                const reader = new FileReader();
                reader.onload = function (e) {
                    setImage({ ...image, [key]: e.target!.result });
                }
                reader.readAsDataURL(File[0]);
            } else {
                dispatch(setBeneficialData({ data: { [key as string]: File[0] }, index: index }))
                const reader = new FileReader();
                reader.readAsDataURL(File[0]);
            }

        }
    }

    const buttonOptionsPrevious = {
        text: 'Previous',
        type: 'normal',
        useSubmitBehavior: true,
        onClick: () => {
            dispatch(previous());
        }
    }

    const hanldeStoreState = (e: FieldDataChangedEvent) => {
        const { dataField: name, value } = e;
        dispatch(setBeneficialData({ data: { [name as string]: value }, index: index }))
        if (name === "isMailingAddressDifferent") {
            setFormData({ ...formData, [name]: value });
            // resetCountryPhoneNumber()
        } else if (name === "country") {
            var data_filter = nameCountries.filter(element => element.country == value)
            if (data_filter && data_filter[0]?.code && data_filter[0]?.code !== "") {
                setFormData({
                    ...formData,
                    ["countrycode"]: data_filter[0]?.code,
                    ["country"]: value,
                    ["phoneNumber"]: ""
                });
            }
        } else if (name === "tcpCountry") {
            var data_filter = nameCountries.filter(element => element.country == value)
            if (data_filter && data_filter[0]?.code && data_filter[0]?.code !== "") {
                setFormData({
                    ...formData,
                    ["countrytcpCode"]: data_filter[0]?.code,
                    ["tcpCountry"]: value,
                    ["tcpPhoneNumber"]: ""
                });
            }
        } else {
            setFormData({ ...formData, [name as string]: value });
        }
    }

    const handleGovtId = (e: any) => {
        try {
            if (e === "Government Issued ID") {
                // setIdentificationType(e)
                dispatch(setBeneficialData({ data: { ["IdentificationProofType"]: "1" }, index: index }))
                setFormData({
                    ...formData,
                    ["IdentificationProofType"]: "1",
                    ["IdentificationProofTypeText"]: "Government Issued ID"
                });
                dispatch(setBeneficialData({ data: { ["IdentificationProofTypeText"]: "Government Issued ID" }, index: index }))
                // dispatch(updateBeneficiaryInfo());
            } else {
                // setIdentificationType(e)
                dispatch(setBeneficialData({ data: { ["IdentificationProofType"]: "2" }, index: index }))
                dispatch(setBeneficialData({ data: { ["IdentificationProofTypeText"]: "Utility Bill & Passport" }, index: index }))
                setFormData({
                    ...formData,
                    ["IdentificationProofType"]: "2",
                    ["IdentificationProofTypeText"]: "Utility Bill & Passport"
                });
                // dispatch(updateBeneficiaryInfo());
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmitform = (e: ClickEvent) => {
        try {
            const { isValid } = e.validationGroup.validate()
            if (isValid) {
                // dispatch(BeneficiaryPostApiFlagFunction(true));
                let beneficialDataApi = [...beneficialData]
                let apiData: any = [];


                new Promise((res, rej) => {
                    setLoading(true)
                    beneficialDataApi.forEach(async (beneficial: any, index) => {
                        let modifying_Object = {
                            ...beneficial,
                            tcpDateOfBirth: beneficial.isTrustedContactPersonAvailable ? typeof beneficial.isTrustedContactPersonAvailable === "string" ? beneficial.isTrustedContactPersonAvailable : beneficial.tcpDateOfBirth?.toISOString() : beneficial.tcpDateOfBirth,
                            maritalStatus: beneficial.maritalStatus.charAt(0),
                            ssn: String(beneficial.ssn),
                            IssueDate: typeof beneficial.IssueDate === "string" ? beneficial.IssueDate : beneficial.IssueDate?.toISOString(),
                            dateOfBirth: typeof beneficial.dateOfBirth === "string" ? beneficial.dateOfBirth : beneficial.dateOfBirth?.toISOString(),
                            expirationDate: typeof beneficial.expirationDate === "string" ? beneficial.expirationDate : beneficial.expirationDate?.toISOString(),
                            validGovtIDType: beneficial.validGovtIDType !== "" ? beneficial.validGovtIDType?.charAt(0) : "L"
                        }
                        let modify;
                        modify = encryptFormData(modifying_Object);
                        modify.frontIdentification = await encryptFile(modifying_Object.frontIdentification!);
                        modify.backIdentification = await encryptFile(modifying_Object.backIdentification!);
                        modify.boForm = await encryptFile(modifying_Object.boForm!);
                        apiData.push(modify);
                        if (beneficialDataApi.length - 1 === index) {
                            res(apiData);
                        }
                    })
                }).then(result => {
                    console.log(result);
                    ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=2`, { Beneficiaries: result }).then(c => {
                        setLoading(false)
                        dispatch(next());
                        toastSuccess("Beneficiaries added successfully");
                    }).catch((error) => {
                        setLoading(false)
                        toastError(error?.message);
                    })
                });

            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleImageFrame = () => {
        dispatch(setBeneficialDetailScreen({ ["ImageFrameFlag"]: true }));
    }

    const buttonOptionsNextForm = {
        type: 'default',
        text: "Next",
        useSubmitBehavior: true,
        onClick: (e: any) => {
            handleSubmitform(e)
        }
    }

    const resetCountryPhoneNumber = () => {
        setFormData({
            ...formData,
            ["validatePhoneNumber"]: false,
            ["validateNumber"]: false
        });
    }

    const handlePhoneNumberBlur = (e: any) => {
        dispatch(setBeneficialData({ data: { ["phoneNumber"]: e.target.value }, index: index }))
        setFormData({
            ...formData,
            ["phoneNumber"]: e.target.value,
        });
        setFormData({
            ...formData,
            ["validatePhoneNumber"]: false,
            ["validateNumber"]: false
        });
        if (e.target.value.length > 9) {
            resetCountryPhoneNumber()
            dispatch(showBeneficialPhoneValidation(false))
            // dispatch(setBeneficialData({ data: { ["validatePhoneNumber"]: false }, index: index }))
            // dispatch(updateBeneficiaryInfo())
        }
    }

    const handlePhoneInput = (e: any) => {
        if (e.length > 10 && e.length < 18) {
            setFormData({ ...formData, ["validatePhoneNumber"]: false });
        } else {
            setFormData({ ...formData, ["validatePhoneNumber"]: true });
        }
    }

    const phoneInputFocus = (e: any) => {
        setFormData({
            ...formData,
            ["validateNumber"]: false
        });
    }

    const phoneNumberRenderer = () => {
        return (
            <>
                <div className='d-flex' style={{
                    position: "relative"
                }} >
                    <PhoneInput
                        country={formData?.countrycode?.toLowerCase()}
                        value={phoneNumber}
                        onChange={handlePhoneInput}
                        onFocus={phoneInputFocus}
                        onBlur={handlePhoneNumberBlur}
                        inputClass={!beneficialPhoneValidation ? "custom-phone" : "custom-phone-error"}
                        enableAreaCodeStretch
                        countryCodeEditable={false}
                        inputProps={{
                            name: 'phone',
                            required: true,
                        }}
                    />
                    {(formData.validatePhoneNumber || beneficialPhoneValidation) && <div className='areaChart'>
                        <div className='phone-validation pr-4' >!</div>
                    </div>}
                </div>
                {(formData.validateNumber && formData.validatePhoneNumber) && <p className='text-field-validation-message'> Phone Number is required  </p>}
            </>

        )
    }

    useEffect(() => {
        if (data.frontIdentification !== "" && data.backIdentification !== "" && typeof data.frontIdentification === "string" && typeof data.backIdentification === "string") {
            let front_Image = "";
            let back_Image = "";
            let FrontImage_Redux: File[] | undefined;
            let BackImage_Redux: File[] | undefined;
            let FrontImage_Api: any = null;
            let BackImage_Api: any = null;
            handleImageArray(data.frontIdentification).then((blob) => {
                FrontImage_Api = blob
                FrontImage_Redux = [new File([blob], "front-image." + blob.type.substring(blob.type.lastIndexOf('/') + 1), { type: blob.type })];
                const reader = new window.FileReader();
                reader.readAsDataURL(blob);
                reader.onload = () => {
                    const imageDataUrl = reader.result;
                    front_Image = imageDataUrl as string
                    console.log("front")
                }
                handleImageArray(data.backIdentification).then((_blob) => {
                    BackImage_Api = _blob
                    BackImage_Redux = [new File([_blob], "back-image." + _blob.type.substring(_blob.type.lastIndexOf('/') + 1), { type: _blob.type })];
                    const reader = new window.FileReader();
                    reader.readAsDataURL(_blob);
                    reader.onload = () => {
                        const imageDataUrl = reader.result;
                        back_Image = imageDataUrl as string
                        dispatch(setBeneficialData({ data: { ["frontIdentification"]: FrontImage_Api }, index: index }))
                        dispatch(setBeneficialData({ data: { ["backIdentification"]: BackImage_Api }, index: index }))
                        setImage({
                            frontIdentification: front_Image,
                            backIdentification: back_Image
                        });
                        setFormDataFile({
                            FrontImage: FrontImage_Redux,
                            BackImage: BackImage_Redux
                        });

                    }
                })
            })
        }
    }, []);

    const handlePhoneNumberTcpBlur = (e: any) => {
        dispatch(setBeneficialData({ data: { ["tcpPhoneNumber"]: e.target.value }, index: index }))
        setFormData({
            ...formData,
            ["tcpPhoneNumber"]: e,
        });
        if (e.target.value.length > 9) {
            setFormData({
                ...formData,
                ["validateTcpNumber"]: false
            });
            // dispatch(setBeneficialData({ data: { ["validateTcpCountryCode"]: false }, index: index }))
            // dispatch(updateBeneficiaryInfo())
        }
    }

    const validateForm = (e: any) => {
        try {
            e.validationGroup.validate()
        } catch (error) {
            console.log(error)
        }
    }

    const handleMartialStatusState = (e: any) => {
        dispatch(setBeneficialData({ data: { ["maritalStatus"]: `${e}` }, index: index }))
        setFormData({
            ...formData,
            ["maritalStatus"]: `${e}`
        });
        // dispatch(updateBeneficiaryInfo())
    }

    const handleMartialStatus = () => {
        return (
            <div className="dx-field">
                <div className="dx-field-label">Are You <span className="text-danger"> *</span></div>
                <div className="dx-field-value">
                    <RadioGroup value={formData.maritalStatus} items={status} onValueChange={handleMartialStatusState} layout="horizontal" />
                </div>
            </div>
        )
    }

    const handleTcpPhoneInput = (e: any) => {
        if (e.length < 12) {
            setFormData({
                ...formData,
                ["validateTcpNumber"]: false,
            });
        } else {
            setFormData({
                ...formData,
                ["validateTcpNumber"]: true,
            });
        }
    }

    const handleTcpfocus = () => {
        setFormData({
            ...formData,
            ["validateTcpNumber"]: true,
        });
    }

    const TcpPhoneNumber = () => {
        return (
            <>
                <div className='d-flex' style={{
                    position: "relative"
                }} >
                    <PhoneInput
                        country={formData?.countrytcpCode?.toLowerCase()}
                        value={data.tcpPhoneNumber}
                        onChange={handleTcpPhoneInput}
                        onFocus={handleTcpfocus}
                        onBlur={handlePhoneNumberTcpBlur}
                        inputClass={!beneficialPhoneValidation ? "custom-phone" : "custom-phone-error"}
                        enableAreaCodeStretch
                        countryCodeEditable={false}
                        inputProps={{
                            name: 'phone',
                            required: true,
                        }}
                    />
                    {formData.validateTcpCountryCode && <div className='areaChart'>
                        <div className='phone-validation pr-4' >!</div>
                    </div>}
                </div>
                {(formData.validateTcpNumber && formData.validateTcpCountryCode) && <p className='text-field-validation-message'> Phone Number is required  </p>}
            </>

        )
    }


    return (
        <>
            <h3 className='beneficial-heading'> Beneficial Owner - {index + 1}</h3>
            <div className="row" id='Personal_Details' style={{ borderTop: "1px solid black" }}>
                <Loader loading={loading} />
                <div className={`align-center signUpBoxShadow-beneficial col-md-12 mt-3 mb-3 mx-2}`}>
                    <div className="long-title">  <h3 className="fs-title">Personal Details</h3> </div>
                    <Form
                        formData={{ ...formData }}
                        // onContentReady={validateForm}
                        // onFormDataChange={hanldeStoreState}
                        onFieldDataChanged={hanldeStoreState}
                        colCount={1}
                        showColonAfterLabel={false}
                        readOnly={false}
                        showValidationSummary={false}
                        validationGroup="customerData"
                        labelLocation="top">
                        <GroupItem colCount={4}>
                            <SimpleItem dataField="firstName" editorOptions={{
                                placeholder: '',
                                maxLength: 50,
                                mode: "alphabet",
                                inputAttr: {
                                    id: 'firstNameDB',
                                    autocomplete: 'off'
                                }

                            }}

                                isRequired={true}>
                                <RequiredRule
                                    message="First name is required"
                                />
                                <PatternRule
                                    pattern="^[a-zA-Z. ]+$"
                                    message="Characters from A-Z and Dot accepted only"
                                />
                            </SimpleItem>
                            <SimpleItem dataField="lastName" editorOptions={{
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
                            <SimpleItem dataField="address" editorOptions={{
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
                            <SimpleItem dataField="aptOrSuite" editorOptions={{
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
                                dataSource: countryName,
                                searchEnabled: true,
                                placeholder: 'Please Select',
                                inputAttr: {
                                    id: 'countryDB',
                                    autocomplete: 'chrome-off', // 'off' //'new-password' //
                                }
                            }}
                                isRequired={hideValidation}
                            >
                                <Label text="Country" />
                                {hideValidation && <RequiredRule
                                    message="Country is required"
                                />}
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
                            <SimpleItem dataField="zipCode" editorOptions={{
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
                        <GroupItem >
                            <SimpleItem dataField="isMailingAddressDifferent" cssClass={"formCheckbox"} label={{ visible: false }} editorType="dxCheckBox" editorOptions={{ text: "Mailing Address (If Different)" }} />
                        </GroupItem>
                        {
                            formData.isMailingAddressDifferent && <GroupItem

                                colCount={2}
                            >
                                <GroupItem>
                                    <SimpleItem dataField="maAddress" editorOptions={{
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
                                <SimpleItem dataField="maAptOrSuite" editorOptions={{
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

                        {formData.isMailingAddressDifferent && <GroupItem
                            colCount={4}>
                            <SimpleItem dataField="maCountry" editorType="dxSelectBox" editorOptions={{
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
                            <SimpleItem dataField="maCity" editorOptions={{
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
                            <SimpleItem dataField="maZipCode" editorOptions={{
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
                            <SimpleItem render={phoneNumberRenderer} dataField="phoneNumber" editorOptions={phonesEditorOptions}
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
                            <SimpleItem dataField="numberOfDependents" editorOptions={numberOfDependentEditorOptions}
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
                            colCount={1}
                        >
                            <SimpleItem
                                render={handleMartialStatus}
                                dataField="maritalStatus"
                                editorType="dxSelectBox"
                                label={{ visible: false }}
                                editorOptions={{
                                    dataSource: status,
                                    maxLength: 1,
                                    inputAttr: {
                                        id: 'maritalStatusDB',
                                        autocomplete: 'chrome-off' // 'off' //'new-password' //
                                    }
                                }} validationRules={[{ type: 'required', message: 'Marital Status is required.' }]}>
                                {/* <Label text="Are You" /> */}
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem>
                            <SimpleItem dataField="isTrustedContactPersonAvailable" cssClass={"formCheckbox"} label={{ visible: false }} editorType="dxCheckBox" editorOptions={{ text: "Would you like to add a Trusted Contact Person" }} />
                        </GroupItem>
                        {formData.isTrustedContactPersonAvailable && <GroupItem
                            colCount={2}>
                            <SimpleItem dataField="tcpName" editorOptions={{
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

                            <SimpleItem dataField="tcpEmail" editorOptions={{
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
                        {formData.isTrustedContactPersonAvailable && <GroupItem
                            colCount={2}>
                            <SimpleItem dataField="tcpAddress" editorOptions={{
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
                        {formData.isTrustedContactPersonAvailable && <GroupItem
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
                            <SimpleItem dataField="tcpCity" editorOptions={{
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
                            <SimpleItem dataField="tcpZip" editorOptions={{
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
                        {formData.isTrustedContactPersonAvailable && <GroupItem
                            colCount={2}
                        >
                            <SimpleItem dataField="tcpRelationToAccountHolder" editorOptions={{
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

                    </Form>
                    <p className="my-4">Please download the "Certificate of Beneficial Ownership" by clicking <Link to=""> HERE </Link>. Please complete, sign and upload the completed form HERE.</p>
                    <div className="w-100 d-flex fileuploader-container" >
                        <div className="w-50">
                            <div className="file-uploader-block">
                                <FileUploader minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={fileExtensionPersonal} onValueChange={(file) => handleFileImageUpload(file, "boForm")} selectButtonText="Choose File" labelText="" accept='.pdf' uploadMode="useForm" />
                            </div>
                            {formData.boForm === null && <div className="ml-0 my-2" style={{ color: "red" }}> Please fillout and upload the Certificate of Beneficial Ownership. </div>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-2" style={{ borderTop: "1px solid Black" }} >
                {/* <div className="col-md-2"></div> */}
                <div className={`align-center signUpBoxShadow-beneficial col-md-12 mt-3 mb-3 mx-2`}>
                    <div className="long-title"><h3 className="fs-title">ID INFORMATION</h3> </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="sub-title-ID-Information"><h3>IMPORTANT INFORMATION ABOUT PROCEDURES FOR OPENING A NEW ACCOUNT USA PATRIOT ACT INFORMATION</h3></div>
                        </div>
                        <p>
                            Important information. To help the government fight the funding of terrorism and money‐laundering activities, Federal law requires that Velocity Clearing LLC (“Velocity”) verify your identity by obtaining your name, date of birth, address, and a government‐issued identification number before opening your account. In certain circumstances, Velocity may obtain and verify this information with respect to any person(s) authorized to effect transactions in an account. For certain entities, such as trusts, estates, corporations, partnerships or other organizations, identifying documentation is also required. Your account may be restricted and/or closed if Velocity cannot verify this information. Velocity will not be responsible for any losses or damages (including, but not limited to, lost opportunities) resulting from any failure to provide this information or from any restriction placed upon, or closing of your account.
                        </p>
                    </div>
                    <Form
                        onFieldDataChanged={hanldeStoreState}
                        formData={{ ...formData }}
                        colCount={1}
                        showColonAfterLabel={false}
                        readOnly={false}
                        showValidationSummary={false}
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
                            <SimpleItem
                                dataField="taxCountry"
                                editorType="dxSelectBox"
                                editorOptions={{
                                    dataSource: countryName,
                                    searchEnabled: true,
                                    placeholder: 'Please Select'
                                }}
                                isRequired={hideValidation}>
                                <Label text="Country of Tax Residence" />
                                {hideValidation && <RequiredRule
                                    message="Country is required."
                                />}
                            </SimpleItem>
                            <SimpleItem
                                dataField="taxState"
                                editorType="dxSelectBox"
                                editorOptions={{
                                    dataSource: provinceName,
                                    searchEnabled: true,
                                    placeholder: 'Please Select'
                                }} isRequired={hideValidation}>
                                <Label text="Tax State" />
                                {hideValidation && <RequiredRule
                                    message='State is required.'
                                />}
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem caption="Valid Government Issued Photo ID" cssClass={"mt-2"}>
                            <GroupItem colCount={4}>
                                <SimpleItem dataField="validGovtIDType" editorType="dxSelectBox" editorOptions={{ dataSource: IDType, searchEnabled: true, placeholder: 'Please Select', maxLength: 1 }} validationRules={[{ type: 'required', message: 'ID Type is required.' }]} >
                                    <Label text="ID Type" />
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
                                <SimpleItem dataField="issuingCountry" editorType="dxSelectBox" editorOptions={{ dataSource: countryName, searchEnabled: true, placeholder: 'Please Select' }} isRequired={hideValidation} >
                                    <Label text="Country of Issuance" />
                                    {hideValidation && <RequiredRule
                                        message='Country of Issuance is required.'
                                    />}
                                </SimpleItem>
                                <SimpleItem dataField="issuingState" editorType="dxSelectBox" editorOptions={{ dataSource: provinceName, searchEnabled: true, placeholder: 'Please Select' }} isRequired={hideValidation}>
                                    <Label text="Issuing State" />
                                    {hideValidation && <RequiredRule
                                        message='Country of Issuance is required.'
                                    />}
                                </SimpleItem>
                            </GroupItem>
                            <GroupItem colCount={4}>
                                <SimpleItem dataField="IssueDate"
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
                    </Form>

                </div>
            </div>
            <div className="property-form">
                <div className="row" style={{ borderTop: "1px solid Black" }}>
                    <div className="align-center signUpBoxShadow-beneficial col-md-12 imageUploadDiv mt-3 mb-3 mx-2">
                        <div className="long-title"><h3 className="fs-title">IDENTIFICATION PROOF UPLOAD</h3></div>
                        <br />
                        <p>
                            Government issued ID. If Driver's License is used and the address is not
                            the same as
                            on the application please provide a utility bill with your name and
                            address. You can
                            email a copy to guardian.newaccounts@velocityclearingllc.com
                        </p>
                        {/* <SelectBox value={IdentificationType} items={simpleProducts} placeholder={""} onValueChange={handleGovtId} /> */}
                        <SelectBox value={data.IdentificationProofTypeText} items={simpleProducts} placeholder={""} onValueChange={handleGovtId} />
                        <p className="mt-4">

                            {data.IdentificationProofTypeText === "Government Issued ID" ? <b> Please upload a copy of the Applicant’s Government issued ID in jpeg format (Front and Back) </b> : <b>Please upload a copy of Your Utility Bill & Passport PDF format</b>}
                        </p>

                        <div className="w-100 d-flex fileuploader-container" >
                            <div className="w-40 d-flex">
                                <div className="file-uploader-block">
                                    <FileUploader value={formDataFile.FrontImage ?? []} minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={data.IdentificationProofTypeText === "Government Issued ID" ? fileExtensions : fileExtensionPersonal} onValueChange={(file) => handleFileImageUpload(file, "frontIdentification")} selectButtonText="Choose File" labelText="" accept={data.IdentificationProofTypeText === "Government Issued ID" ? "image/*" : ".pdf"} uploadMode="useForm" />
                                    <span className="note" style={{ marginLeft: "9px" }} >{'Allowed file extensions: '}
                                        <span>.jpeg, .jpg, .png</span>
                                        .
                                    </span> <br />
                                    <span className="note" style={{ marginLeft: "9px" }}>{'File size: '}
                                        <span>1KB - 8MB</span>
                                        .
                                    </span>
                                    <div className="note" style={{ marginLeft: "9px", display: "block" }}>
                                        {image.frontIdentification && <img src={image.frontIdentification} alt="Select Image" width={610} height={250} />}
                                    </div>
                                </div>
                            </div>
                            <div className="w-40 d-flex">
                                <div className="file-uploader-block">
                                    <FileUploader value={formDataFile.BackImage ?? []} minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={data.IdentificationProofTypeText === "Government Issued ID" ? fileExtensions : fileExtensionPersonal} onValueChange={(file) => handleFileImageUpload(file, "backIdentification")} selectButtonText="Choose File" labelText="" accept={data.IdentificationProofTypeText === "Government Issued ID" ? "image/*" : ".pdf"} uploadMode="useForm" />
                                    <span className="note" style={{ marginLeft: "9px" }} >{'Allowed file extensions: '}
                                        <span>.jpeg, .jpg, .png</span>
                                        .
                                    </span> <br />
                                    <span className="note" style={{ marginLeft: "9px" }}>{'File size: '}
                                        <span>1KB - 8MB</span>
                                        .
                                    </span>
                                    <div className="note" style={{ marginLeft: "9px", display: "block" }}>
                                        {image.backIdentification && <img src={image.backIdentification} alt="Select Image" width={610} height={250} />}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="mt-4">
                            <Link to="" onClick={handleImageFrame}>
                                Image Hints and Tips
                            </Link>
                        </div>
                        <Form
                            colCount={1}
                            showColonAfterLabel={false}
                            readOnly={false}
                            // tabIndex={index}
                            showValidationSummary={true}
                            validationGroup="customerData"
                            labelLocation="top">
                            <GroupItem colCount={32}>
                                <ButtonItem
                                    horizontalAlignment="right"
                                    colSpan={28}
                                    cssClass={"buttonTxt mt-3"}
                                    buttonOptions={buttonOptionsPrevious}
                                />
                                <ButtonItem
                                    horizontalAlignment="right"
                                    colSpan={4}
                                    cssClass={"buttonTxt mt-3"}
                                    buttonOptions={buttonOptionsNextForm}
                                />
                            </GroupItem>
                        </Form>

                    </div>
                </div>
            </div>

        </>
    );
}

export default BeneficiaryDetail;
