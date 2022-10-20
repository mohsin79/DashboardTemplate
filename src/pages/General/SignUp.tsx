import { useForm } from '../../components/useFrom'
import { ApiRequestAsync } from '../../services/httpservice'
import Form, { ButtonItem, CompareRule, Item, PatternRule, RequiredRule } from 'devextreme-react/form';
import Control from '../../components/control';
import { ClickEvent } from 'devextreme/ui/button';
import { useLocation, useNavigate, Link } from 'react-router-dom';
// import View from "../../Asset/view.png"
import API from '../../services/urlservice';
import { useState } from 'react';
import SuccessPopUp from '../../components/SuccessPopUp/SuccessPopUp';
import { toastError, toastSuccess } from '../../util/toaster/Toaster';
import { useStore } from '../../store/store';

const initialFValues = {
    email: '',
    promoCode: "",
    createPassword: "",
    confirmPassword: ""
}

const validationRules = {
    email: [
        { type: 'required', message: 'Email is required.' },
    ],
    hireDate: [
        { type: 'required', message: 'Hire Date is required.' },
    ],
};

function SignUp() {
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [showSuccessModalMessage, setShowSuccessModalMessage] = useState<string>("");
    const [showSuccessModalButtonMessage, setShowSuccessModalButtonMessage] = useState<string>("");
    const [showSuccessModalHeading, setShowSuccessModalHeading] = useState<string>("");
    const location = useLocation();
    const navigate = useNavigate();
    const [state, dispatch] = useStore();

    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("email" in fieldValues)
            temp.email = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(fieldValues.email!) ? "" : "Email is required.";
        if ("createPassword" in fieldValues)
            temp.createPassword =
                fieldValues.createPassword ? "" : "Create password is required.";
        temp.confirmPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/.test(fieldValues.confirmPassword!) ? "" : "Must contain atleast one Number, one uppercase, one lowercase, one special character, at least 8 characters and maximum 25 characters"

        setErrors({
            ...temp,
        });
        if (fieldValues == values) return Object.values(temp).every((x) => x == "");
    }

    const { values, setValues, errors, setErrors, handleInputChange } = useForm(initialFValues);

    const buttonOptions = {
        text: 'Submit',
        type: 'default',
        useSubmitBehavior: true,
        onClick: (e: any) => {
            handleSubmit(e)
        }
    }


    const handleSubmit = (_e: ClickEvent) => {
        if (validate()) {
            if (values.email !== "" && values.createPassword !== "" && values.confirmPassword !== "") {
                ApiRequestAsync('POST', `/v2/auth/register`, {
                    email: values.email,
                    password: values.confirmPassword
                }).then(e => {
                    if (e) {
                        if (e.status === 200) {
                            toastSuccess("User register successfully");
                            setShowSuccessModalMessage("Please check your email for a confirmation link.")
                            setShowSuccessModal(true)
                            setShowSuccessModalButtonMessage("Confirm Email")
                            setShowSuccessModalHeading("Email Verification")
                        }
                    }
                }).catch(message => {
                    toastError(message.response.data?.message ?? "Kindly check your email and password")
                })
            }
        }
    }

    const passwordComparison = () => {
        try {
            return values.createPassword
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = () => {
        try {

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container-fluid">
            {showSuccessModal && <SuccessPopUp
                open={showSuccessModal}
                setOpen={setShowSuccessModal}
                title={showSuccessModalHeading}
                showTitle={true}
                message={showSuccessModalMessage}
                showCloseButton={true}
                dragEnabled={true}
                buttonMessage={showSuccessModalButtonMessage}
            />}
            <div className="container">
                <br /><br /><br />
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6 signUpBoxShadow">
                        <div className="long-title"> <h3 className="text-center">Begin an Online Application</h3></div>

                        <p className="text-center">
                            Already have an account? <Link to="/">Sign in</Link>
                        </p>
                        <div className="demo-container">
                            <div className="form-container">
                                <Form
                                    // onContentReady={validateForm}
                                    id="form"
                                    colCount={1}
                                    showColonAfterLabel={false}
                                    readOnly={false}
                                    formData={initialFValues}>
                                    <Item dataField="email"
                                        editorOptions={{
                                            value: values.email,
                                            placeholder: '',
                                            mode: 'email',
                                            inputAttr: {
                                                id: 'emailDB',
                                                autocomplete: 'off' // 'off' //'new-password' //
                                            }
                                        }}
                                    >
                                        <RequiredRule
                                            message="Email is required"
                                        />
                                        <PatternRule
                                            pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$"
                                            message="Email is InValid"
                                        />
                                    </Item>
                                    <Item dataField="promoCode" editorOptions={{
                                        mode: 'text',
                                        inputAttr: {
                                            id: 'promoCodeDB',
                                            autocomplete: 'off' // 'off' //'new-password' //
                                        }
                                    }} />
                                    <Item dataField="createPassword" editorOptions={{
                                        mode: 'password',
                                        inputAttr: {
                                            id: 'createPasswordDB',
                                            autocomplete: 'off' // 'off' //'new-password' //
                                        }
                                    }} isRequired={true}>
                                        <RequiredRule
                                            message="Password is required"
                                        />
                                        <PatternRule
                                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$"
                                            message="Must contain atleast one Number, one uppercase, one lowercase, one special character, at least 8 characters and maximum 25 characters"
                                        />
                                    </Item>
                                    <Item dataField="confirmPassword" editorOptions={{
                                        mode: 'password',
                                        inputAttr: {
                                            id: 'confirmPasswordDB',
                                            autocomplete: 'off' // 'off' //'new-password' //
                                        }
                                    }} isRequired={true} >
                                        <RequiredRule
                                            message="Confirm Password is required"
                                        />
                                        <CompareRule
                                            message="Password and Confirm Password do not match"
                                            comparisonTarget={passwordComparison}
                                        />
                                    </Item>
                                    <ButtonItem horizontalAlignment="center"
                                        buttonOptions={buttonOptions}
                                    />
                                </Form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3"></div>
                </div>
                <br /><br /><br />
            </div>
        </div>
    )
}

export default SignUp