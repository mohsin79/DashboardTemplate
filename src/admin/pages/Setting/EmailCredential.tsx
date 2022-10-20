import { Form } from "devextreme-react";
import { RequiredRule } from "devextreme-react/data-grid";
import { PatternRule, SimpleItem, Label, ButtonItem } from "devextreme-react/form";
import { Link } from "react-router-dom";
import { useForm } from "../../../components/useFrom";
import "../../../Styles/Admin/Pages.scss"

let initialFValues = {
    SMTP_Host: '',
    SMTP_Port: '',
    Enter_Email: '',
    Enter_Password: '',
}

function EmailCredential() {

    const buttonOptionsSave = {
        text: 'Save',
        type: 'normal',
        useSubmitBehavior: true,
        // onClick: () => {
        //     handlePreviousButton()
        // }
    }

    const { values, setValues, errors, setErrors, handleInputChange } = useForm(initialFValues);
    return (
        <div className="content-wrapper" style={{ minHeight: "337px" }}>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h1 className="m-0 text-dark-pending">Email Credentials</h1>
                        </div>
                        <div className="align-self" >
                            <div className="breadcrumb float-sm-right">
                                <Link className="breadcrumb-item" to="" >Dashboard</Link>
                                <Link className="breadcrumb-item active" to="">Email Credentials</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card-admin">
                            <div className="col-md-6">
                                <div className="card-admin card-primary mt-4 mb-4 ml-4">
                                    <Form
                                        formData={initialFValues}
                                        // onContentReady={validateForm}
                                        onFieldDataChanged={handleInputChange}
                                        colCount={1}
                                        showColonAfterLabel={false}
                                        readOnly={false}
                                        showValidationSummary={true}
                                        className={"m-4"}
                                        validationGroup="customerData"
                                        labelLocation="left">
                                        <SimpleItem dataField="SMTP_Host" editorOptions={{
                                            placeholder: 'Please Enter SMTP Host',
                                            // maxLength: 50,
                                            mode: "alphabet",
                                            inputAttr: {
                                                id: 'SMTP_Host',
                                                autocomplete: 'off' // 'off' //'new-password' //
                                            }

                                        }}
                                            isRequired={true}>
                                            <Label text="SMTP Host" />
                                        </SimpleItem>
                                        <SimpleItem dataField="SMTP_Port" editorOptions={{
                                            placeholder: 'Please Enter SMTP Port',
                                            // maxLength: 50,
                                            mode: "alphabet",
                                            inputAttr: {
                                                id: 'firstNameDB',
                                                autocomplete: 'off' // 'off' //'new-password' //
                                            }

                                        }}
                                            isRequired={true}>
                                            <Label text="SMTP Port" />
                                        </SimpleItem>
                                        <SimpleItem dataField="Enter_Email" editorOptions={{
                                            placeholder: 'Please Enter Email',
                                            // maxLength: 50,
                                            mode: "alphabet",
                                            inputAttr: {
                                                id: 'Enter_Email',
                                                autocomplete: 'off' // 'off' //'new-password' //
                                            }

                                        }}
                                            isRequired={true}>
                                            <Label text="Enter Email" />
                                        </SimpleItem>
                                        <SimpleItem dataField="Enter_Password" editorOptions={{
                                            placeholder: 'Please Enter Password',
                                            // maxLength: 50,
                                            mode: "alphabet",
                                            inputAttr: {
                                                id: 'Enter_Password',
                                                autocomplete: 'off' // 'off' //'new-password' //
                                            }

                                        }}
                                            isRequired={true}>
                                            <Label text="Enter Password" />
                                        </SimpleItem>
                                        <ButtonItem
                                            horizontalAlignment="center"
                                            colSpan={28}
                                            cssClass={"adminButton"}
                                            buttonOptions={buttonOptionsSave}
                                        />
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmailCredential;