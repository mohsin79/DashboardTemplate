import { useForm } from '../../components/useFrom'
import signuplogo from '/assets/img/signuplogo.png';
import { ApiRequestAsync } from '../../services/httpservice'
import { ButtonItem, Form, PatternRule, RequiredRule, SimpleItem } from 'devextreme-react/form'
import Control from '../../components/control';
import { ClickEvent } from 'devextreme/ui/button';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toastError } from '../../util/toaster/Toaster';
import { setUser } from '../../services/webstorage';
import { useAppDispatch } from '../../hooks/storehook';
import { getUserData } from '../../store/appreducer';
import { useRef } from 'react';

const initialFValues = {
    email: '',
    password: '',
}

function SignUp() {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const buttonOptions = {
        text: 'Submit',
        type: 'default',
        useSubmitBehavior: true,
        onClick: (e: any) => {
            handleSubmit(e)
        }
    }


    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("email" in fieldValues)
            temp.email = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(fieldValues.email!) ? "" : "Email is required.";
        if ("password" in fieldValues)
            temp.password =
                fieldValues.password ? "" : "Password is required.";
        if ("password" in fieldValues)
            temp.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/.test(fieldValues.password!) ? "" : "Password is Incorrect"

        setErrors({
            ...temp,
        });
        if (fieldValues == values) return Object.values(temp).every((x) => x == "");
    }

    const { values, errors, setErrors, handleInputChange } = useForm(initialFValues);

    const handleSubmit = (e: ClickEvent) => {
        if (validate()) {
            if (values.email !== "" && values.password !== "") {
                ApiRequestAsync('POST', `/v2/auth`, {
                    email: values.email,
                    password: values.password
                }).then(e => {
                    setUser({
                        email: values.email?.toLowerCase(),
                        role: e.data.role,
                        token: e.data.token,
                        formId: e.data.formId
                    });
                    if (e.data.role === "User") {
                        if (e.data?.formId) {
                            dispatch(getUserData(e.data?.formId))
                        }
                        if (e.data.applicationType && e.data.applicationType === "INDIV") {
                            navigate(`/home/${"1"}/${e.data?.formId}`);
                            // navigate(`/home`)s
                        } else if (e.data.applicationType && e.data.applicationType === "LLC") {
                            navigate(`/home/${"6"}/${e.data?.formId}`);
                        } else {
                            navigate(`/home`)
                        }
                    }
                    else {
                        navigate(`/admin/dashboard`)
                    }
                }).catch(e => {
                    console.log(e);
                    if (e.response.data.status !== undefined) {
                        if (e.response.data.status === 401) {
                            toastError("Email or Password is incorrect");
                        }
                    }
                })
            }
        }
    }

    const handleOpenAccount = () => {
        try {

        } catch (error) {

        }
    }

    return (
        <div className="container-fluid">
            <div className="container">
                <br /><br /><br />
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6 signUpBoxShadow my-auto">
                        <div className="reg_form modal-border my-auto">
                            <div className="col-md-12 d-flex justify-content-center">
                                <img className='img-fluid' style={{ width: "70%", height: "70%" }} src={signuplogo} alt="Guardian" />
                            </div>
                            <br />
                            <div className="long-title"> <h3 className="text-center Sign-up-header">{location.pathname === "/support" ? "Support" : "User"} Sign In</h3> </div>
                            <p className="text-center reg_btn_para">
                                {location.pathname !== "/support" && <Link to="register" className="reg_btn_customize"> <Control.Button className='text-white pl-4 pr-4 button-color' onClick={handleOpenAccount} text='Open an Account Now' /> </Link>}
                            </p>
                            <Form
                                onFieldDataChanged={handleInputChange}
                                formData={initialFValues}
                                colCount={1}
                                readOnly={false}
                                showValidationSummary={true}
                                validationGroup="customerData"
                                showColonAfterLabel={false}
                                labelMode={"hidden"}>
                                <SimpleItem dataField="email" editorOptions={{
                                    placeholder: 'Email',
                                    inputAttr: {
                                        id: 'emailDB',
                                        autocomplete: 'off' // 'off' //'new-password' //
                                    }
                                }}
                                    isRequired={true}>
                                    <RequiredRule
                                        message="Email is required"
                                    />
                                    <PatternRule
                                        pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$"
                                        message="Email is InValid"
                                    />
                                </SimpleItem>
                                <SimpleItem dataField="password" editorOptions={{
                                    placeholder: 'password',
                                    inputAttr: {
                                        id: 'password',
                                        autocomplete: 'off' // 'off' //'new-password' //
                                    },
                                    mode: 'password'
                                }} isRequired={true}>
                                    <RequiredRule
                                        message="Password is required"
                                    />
                                    <PatternRule
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$"
                                        message="Password is Incorect"
                                    />
                                </SimpleItem>
                                <ButtonItem horizontalAlignment="center"
                                    buttonOptions={buttonOptions}
                                />
                            </Form>


                            <div className='d-flex justify-content-between mt-2'>
                                <div>

                                </div>
                                <div className="mt-2">
                                    <Link to="/forgot-password">Forgot Password?</Link>
                                </div>
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