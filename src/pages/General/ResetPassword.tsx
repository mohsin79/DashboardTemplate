import { useForm } from '../../components/useFrom'
import signuplogo from '/assets/img/signuplogo.png';
import { ApiRequestAsync } from '../../services/httpservice'
import { CompareRule, Form, Label, PatternRule, RequiredRule, SimpleItem } from 'devextreme-react/form'
import Control from '../../components/control';
import { ClickEvent } from 'devextreme/ui/button';
import { useLocation, useNavigate, Link, useParams, Location } from 'react-router-dom';
import API from '../../services/urlservice';
import { useEffect, useState } from 'react';
import { toastError, toastSuccess } from '../../util/toaster/Toaster';
import { LoadPanel } from 'devextreme-react';
import SuccessPopUp from '../../components/SuccessPopUp/SuccessPopUp';
const position = { of: '#email_verification' };

const initialFValues = {
    createPassword: "",
    confirmPassword: ""
}

interface LocationData {

    token?: string
    email?: string
    userId?: string

}


function ResetPassword() {

    // const [userCode, setUserCode] = useState<string>("")
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationData;

    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("createPassword" in fieldValues)
            temp.createPassword =
                fieldValues.createPassword ? "" : "Create password is required.";
        temp.confirmPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/.test(fieldValues.confirmPassword!) ? "" : "Must contain atleast one Number, one uppercase, one lowercase, one special character, at least 8 characters and maximum 25 characters"

        setErrors({
            ...temp,
        });
        if (fieldValues == values) return Object.values(temp).every((x) => x == "");
    }

    useEffect(() => {

        if (!state?.token)
            navigate("/")

    }, [location])

    const passwordComparison = () => values.createPassword;

    const { values, setValues, errors, setErrors, handleInputChange } = useForm(initialFValues);

    const handleSubmit = (e: ClickEvent) => {

        if (validate()) {
            if (values.createPassword  && values.createPassword === values.confirmPassword) {
                //  let responce = location.state.
                if (state.token !== "" && state.userId !== "") {
                    ApiRequestAsync('POST', `/v2/auth/resetpassword`, {
                        code: encodeURIComponent(state.token!),
                        userID: state.userId,
                        password: values.createPassword
                    }).then(e => {
                        toastSuccess("Password reset successfully");
                        navigate("/")
                    }).catch(message => {
                        if (message.response.data[0].description !== undefined && message.response.data[0].description !== "") {
                            toastError(message.response.data[0].description);
                            // setShowSuccessModalMessage(message.response.data[0].description)
                            // setShowSuccessModal(true)
                            // setShowSuccessModalButtonMessage("Ok")
                            // setShowSuccessModalHeading("Error")
                        } else {
                            toastError("Something Went Wrong!");
                        }
                        // navigate("/")
                    })
                }
            }
        }



    }




    return (
        <div className="container-fluid">
            <div className="row" style={{ height: "100vh" }}>
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className='d-flex justify-content-center align-center'>
                        <div className="col-md-4">

                            <div className='forgotBoxShadow mt-4' id='email_verification'>

                                <>
                                    <h5 className='d-flex justify-content-center'>Reset Password</h5>
                                    <Form
                                        formData={initialFValues}
                                        colCount={1}
                                        labelLocation="top"
                                    >
                                        <SimpleItem dataField="createPassword" editorOptions={{
                                            mode: 'password'
                                        }} isRequired={true}>
                                            <Label text="Create Password" />
                                            <RequiredRule
                                                message="Password is required"
                                            />
                                            <PatternRule
                                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$"
                                                message="Must contain atleast one Number, one uppercase, one lowercase, one special character, at least 8 characters and maximum 25 characters"
                                            />
                                        </SimpleItem>
                                        <SimpleItem dataField="confirmPassword" editorOptions={{
                                            mode: 'password'
                                        }} isRequired={true}>
                                            <Label text="Confirm Password" />
                                            <RequiredRule
                                                message="Confirm Password is required"
                                            />
                                            <CompareRule
                                                message="Password and Confirm Password do not match"
                                                comparisonTarget={passwordComparison}
                                            />
                                            {/* <PatternRule
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$"
                                    message="Must contain atleast one Number, one uppercase, one lowercase, one special character, at least 8 characters and maximum 25 characters"
                                /> */}
                                        </SimpleItem>
                                    </Form>
                                    <div className='mt-3 mb-2 d-flex justify-content-center'>
                                        <Control.Button className='text-white button-color' onClick={handleSubmit} text='Submit' />
                                    </div>

                                </>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-4"></div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;  