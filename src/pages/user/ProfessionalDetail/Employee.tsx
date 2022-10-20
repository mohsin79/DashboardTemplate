import React, { useContext, useRef, useState } from 'react'
import { ApiRequestAsync } from '../../../services/httpservice'
import { FaBriefcase, FaUser, FaUserCircle } from "react-icons/fa"
import { Form, SimpleItem, GroupItem, RequiredRule, PatternRule, Label, ButtonItem } from 'devextreme-react/form'
import PhoneInput from 'react-phone-input-2';
import { useForm } from '../../../components/useFrom'
import Control from '../../../components/control'
import { ClickEvent } from 'devextreme/ui/button';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { countryName, nameCountries, provinceName } from '../../../util/Data';
import { useStore } from '../../../store/store';
import axios from 'axios';
import { encryptFormData } from '../../../util/common'
import Loader from '../../../components/Loader/Loader'
import { toastError, toastSuccess } from '../../../util/toaster/Toaster'
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook'
import { next, previous, setProfessional } from '../../../store/appreducer'
import { FieldDataChangedEvent } from 'devextreme/ui/form'

const initialFValues = {
    employmentStatus: "E",
    employerOrBusinessName: "",
    occupationOrComapnyType: "",
    address: "",
    aptOrSuite: "",
    employmentYearsOfExperience: "",
    country: "",
    state: "",
    city: "",
    employmentPhone: "",
    employmentFax: ""
}

const phonesEditorOptions = {
    mask: '+1 (X00) 000-0000',
    maskRules: { X: /[02-9]/ },
    placeholder: 'Please add country code for the area your number is in ex: the United States +1',
    maxLength: 11,
    inputAttr: {
        id: 'EmploymentPhoneDB',
        autocomplete: 'off' // 'off' //'new-password' //
    }
}

const rules = { X: /[02-9]/ };


const Employee = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [countryCode, setCountryCode] = useState("us");
    const [validateCountryCode, setValidateCountryCode] = useState(false);
    const [validatePhoneNumber, setValidatePhoneNumber] = useState(true);
    const [validateNumber, setValidateNumber] = useState(false);
    const dispatch = useAppDispatch();
    const professional = useAppSelector(e => e.appform.professional);
    const [errorShow, setErrorShow] = useState<Array<string>>([])
    const professionalState = useRef<typeof professional>({ ...professional }).current;

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

    const resetCountryPhoneNumber = () => {
        setValidateCountryCode(false)
        // setValidatePhoneNumber(true)
        setValidateNumber(false)
    }

    const handlePhoneInput = (e: any) => {
        if (e.length > 10 && e.length < 18) {
            setValidatePhoneNumber(false)
        } else {
            setValidatePhoneNumber(true)
        }
    }

    const handlePhoneNumberBlur = (e: any) => {
        dispatch(setProfessional({ ["employmentPhone"]: e.target.value }))
        if (e.target.value.length > 9) {
            resetCountryPhoneNumber()
        }
    }

    const hanldeStoreState = (e: FieldDataChangedEvent) => {
        const { dataField: name, value } = e;
        dispatch(setProfessional({ [name as string]: value }))
        if (name === "country") {
            var data_filter = nameCountries.filter(element => element.country == value)
            if (data_filter && data_filter[0].code && data_filter[0].code !== "") {
                setCountryCode(data_filter[0].code)
            }
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
                        value={professional.employmentPhone}
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

    const handleSubmit = (e: ClickEvent) => {

        const { isValid } = e.validationGroup.validate();
        if (isValid && !validatePhoneNumber) {
            setLoading(true)
            ApiRequestAsync('POST', `/v2/Registration?applicationType=1&pageId=2`, encryptFormData(professionalState)).then(() => {
                toastSuccess("Professional details added successfully");
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
        } else if (validatePhoneNumber) {
            setValidateCountryCode(true)
        }
    }
    /*  handle the form submission end */

    return (
        <>
            <Loader loading={loading} />
            <Form
                onFieldDataChanged={hanldeStoreState}
                // onContentReady={validateForm}
                formData={professionalState}
                colCount={1}
                showColonAfterLabel={false}
                readOnly={false}
                showValidationSummary={true}
                validationGroup="customerData"
                labelLocation="top">
                <GroupItem colCount={6}>
                    <SimpleItem dataField="employerOrBusinessName" editorOptions={{
                        placeholder: '',
                        maxLength: 30,
                        inputAttr: {
                            id: 'employerOrBusinessNameDB',
                            autocomplete: 'off' // 'off' //'new-password' //
                        }
                    }}
                        colSpan={4}
                        isRequired={true}>
                        <Label text="Employee Name" />
                        <RequiredRule
                            message="Employee Name is required"
                        />
                    </SimpleItem>
                    <SimpleItem dataField="occupationOrComapnyType" editorOptions={{
                        placeholder: '',
                        maxLength: 50,
                        inputAttr: {
                            id: 'occupationOrComapnyTypeDB',
                            autocomplete: 'off' // 'off' //'new-password' //
                        }
                    }}
                        colSpan={2}
                        isRequired={true}>
                        <Label text="Occupation" />
                        <RequiredRule
                            message="Employee Name is required"
                        />
                    </SimpleItem>
                </GroupItem>
                <GroupItem colCount={6}>
                    <SimpleItem dataField="Address" editorOptions={{
                        placeholder: '',
                        maxLength: 100,
                        inputAttr: {
                            id: 'AddressDB',
                            autocomplete: 'off' // 'off' //'new-password' //
                        }
                    }}
                        colSpan={4}
                        isRequired={true}>
                        <Label text="Address Of Employer" />
                        <RequiredRule
                            message="Address is required"
                        />
                    </SimpleItem>
                    <SimpleItem dataField="employmentYearsOfExperience" editorType="dxNumberBox" editorOptions={{
                        placeholder: '',
                        maxLength: 3,
                        inputAttr: {
                            id: 'EmploymentYearsOfExperienceDB',
                            autocomplete: 'off', // 'off' //'new-password' //,
                            maxLength: 3
                        }
                    }}
                        colSpan={2}
                        isRequired={true}>
                        <Label text="Year With Employer" />
                        <RequiredRule
                            message="Years With Employer is required"
                        />
                    </SimpleItem>
                </GroupItem>
                <GroupItem colCount={6}>
                    <SimpleItem dataField="country" colSpan={2} editorType="dxSelectBox" editorOptions={{
                        dataSource: countryName,
                        searchEnabled: true,
                        placeholder: 'Please Select',
                        inputAttr: {
                            id: 'countryDB',
                            autocomplete: 'off' // 'off' //'new-password' //
                        }
                    }} validationRules={[{ type: 'required', message: 'Country is required.' }]}>
                        <Label text="Country" />

                    </SimpleItem>
                    <SimpleItem dataField="state" colSpan={2} editorType="dxSelectBox" editorOptions={{
                        dataSource: provinceName,
                        searchEnabled: true,
                        placeholder: 'Please Select',
                        inputAttr: {
                            id: 'stateDB',
                            autocomplete: 'off' // 'off' //'new-password' //
                        }
                    }} validationRules={[{ type: 'required', message: 'States/Province is required.' }]}>
                        <Label text="States/Province" />
                    </SimpleItem>
                    <SimpleItem dataField="city" colSpan={2} editorOptions={{
                        placeholder: '',
                        maxLength: 50,
                        inputAttr: {
                            id: 'cityDB',
                            autocomplete: 'off' // 'off' //'new-password' //
                        }
                    }}
                        isRequired={true}>
                        <Label text="City" />
                        <RequiredRule
                            message="City is required"
                        />
                        <PatternRule
                            pattern="^[a-z A-Z]+$"
                            message="Characters from A-Z accepted only"
                        />
                    </SimpleItem>
                </GroupItem>
                <GroupItem colCount={6}>
                    <SimpleItem colSpan={2} dataField="aptOrSuite" editorOptions={{
                        placeholder: '',
                        maxLength: 5,
                        inputAttr: {
                            id: 'aptOrSuiteDB',
                            autocomplete: 'off' // 'off' //'new-password' //
                        }
                    }}>
                        <Label text="Apt/Suite" />
                    </SimpleItem>
                    <SimpleItem
                        dataField="employmentPhone"
                        render={phoneNumberRenderer}
                        colSpan={2}
                        editorOptions={phonesEditorOptions}
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
                    <SimpleItem dataField="employmentFax" editorOptions={{
                        placeholder: '',
                        maxLength: 15,
                        inputAttr: {
                            id: 'EmploymentFaxDB',
                            autocomplete: 'off' // 'off' //'new-password' //
                        }
                    }}
                        colSpan={2}
                    >
                        <Label text="Fax" />
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
            {errorShow.map(c => <div className=" mt-2 dx-item dx-validationsummary-item"><div className="dx-item-content dx-validationsummary-item-content">{c}</div></div>)}
            {/* <div className='d-flex justify-content-end mt-4'>
                <Control.Button className='btn btn-default bg-primary text-white button-width' text='Previous' onClick={handlePreviousButton} />
                <Control.Button className='btn btn-default bg-primary text-white button-width' text='Next' onClick={handleSubmit} />
            </div> */}
        </>
    )
}

export default Employee;