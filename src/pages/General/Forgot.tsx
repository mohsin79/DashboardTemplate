import { useForm } from '../../components/useFrom'
import signuplogo from '/assets/img/signuplogo.png';
import { ApiRequestAsync } from '../../services/httpservice'
import { Form, PatternRule, RequiredRule, SimpleItem } from 'devextreme-react/form'
import Control from '../../components/control';
import { ClickEvent } from 'devextreme/ui/button';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import API from '../../services/urlservice';
import { useEffect, useRef, useState } from 'react';
import { toastSuccess } from '../../util/toaster/Toaster';
import { LoadPanel } from 'devextreme-react';
import SuccessPopUp from '../../components/SuccessPopUp/SuccessPopUp';
const position = { of: '#email_verification' };

const initialFValues = {
    email: '',
}

function ForgotPassword() {

    const location = useLocation();
    const params = useParams();
    const isLoadFirst = useRef(true);
    const [forgotOrEmailScreen, setForgotOrEmailScreen] = useState<string>("forgotScreen")
    const [loader, setLoader] = useState<boolean>(false)
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [showSuccessModalMessage, setShowSuccessModalMessage] = useState<string>("");
    const [showSuccessModalButtonMessage, setShowSuccessModalButtonMessage] = useState<string>("");
    const [showSuccessModalHeading, setShowSuccessModalHeading] = useState<string>("");
    // const [userCode, setUserCode] = useState<string>("")
    const navigate = useNavigate();
    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("email" in fieldValues)
            temp.email = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(fieldValues.email!) ? "" : "Email is required.";


        setErrors({
            ...temp,
        });
        if (fieldValues == values) return Object.values(temp).every((x) => x == "");
    }


    const { values, setValues, errors, setErrors, handleInputChange } = useForm(initialFValues);

    const handleSubmit = (e: ClickEvent) => {
        if (validate()) {

            ApiRequestAsync('GET', `/v2/auth/forgetpassword`, {
                email: values.email,
            }).then(e => {

                setShowSuccessModalMessage("Please check your email for a confirmation link.")
                setShowSuccessModal(true)
                setShowSuccessModalButtonMessage("Confirm Email")
                setShowSuccessModalHeading("Email Verification")
            });
        }

    }
    //Confrim Email,Forgot Password 
    useEffect(() => {
        if(!isLoadFirst.current) return;
        setLoader(true);
        if (location.pathname.includes("confirm/Verify2FA")) {
            ApiRequestAsync('GET', `/v2/auth/confirmemail`, {
                code: encodeURIComponent(params.code!),
                userId: params.userId,
            }).then(responce => {
                if (responce.status === 200) {
                    setLoader(false)
                    toastSuccess("User confirm successfully");
                    navigate("/home")
                }
            }).catch(e => {
                setLoader(false)
                navigate("/register")
            })

        } else {
            if (params.code) {
                navigate("/reset-password", {
                    state: {
                        token: params.code,
                        userId: params.userId
                    }
                })
            }
        }
        isLoadFirst.current = false;


    }, [ ])



    return (
        <div className="container-fluid">
            <div className="row" style={{ height: "100vh" }}>
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className='d-flex justify-content-center align-center'>
                        <div className="col-md-4">
                            {!(location.pathname.includes("confirm/Verify2FA") || location.pathname.includes("reset/Verify2FA"))  ?
                                <div className='forgotBoxShadow mt-4' id='email_verification'>
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

                                    <>
                                        <h5 className='d-flex justify-content-center'>Forgot Password</h5>
                                        <Form
                                            formData={initialFValues}
                                            colCount={1}
                                            labelMode='hidden'
                                        >
                                            <SimpleItem dataField="email" editorOptions={{
                                                placeholder: 'Email',
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
                                        </Form>
                                        <div className='mt-3 mb-2 d-flex justify-content-center'>
                                            <Control.Button className='text-white button-color' onClick={handleSubmit} text='Submit' />
                                        </div>
                                    </>
                                </div> :
                                <LoadPanel
                                    shadingColor="rgba(0,0,0,0.4)"
                                    position={position}
                                    // onHiding={this.hideLoadPanel}
                                    visible={loader}
                                    showIndicator={true}
                                    shading={true}
                                    showPane={true}
                                // hideOnOutsideClick={false}
                                />
                            }
                        </div>
                    </div>
                    <div className="col-md-4"></div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;  