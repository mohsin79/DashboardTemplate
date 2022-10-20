import { Form } from "devextreme-react";
import { RequiredRule } from "devextreme-react/data-grid";
import { PatternRule, SimpleItem, Label, ButtonItem } from "devextreme-react/form";
import HtmlEditor, {
    Toolbar, MediaResizing, Item
} from 'devextreme-react/html-editor';
import { Link } from "react-router-dom";
import TextBox from "../../../components/textBox";
import { useForm } from "../../../components/useFrom";
import "../../../Styles/Admin/Pages.scss"
import { markup, markupAcceptedEmail } from "./Data";

const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];
const headerValues = [false, 1, 2, 3, 4, 5];

function AcceptedEmailCredential() {

    return (
        <div className="content-wrapper" style={{ minHeight: "337px" }}>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h1 className="m-0 text-dark-pending">Accepted E-mail Template</h1>
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
                            <div className="card-admin-header"></div>
                            <div className="col-md-10 m-auto">
                                <div className="mt-4 mb-4">
                                    <h3 className="mt-4 admin-h3 mb-4">Subject</h3>
                                </div>
                                <div className="form-group">
                                    <TextBox value={"Your Application has been Approved"} placeholder="" />
                                </div>
                                <div className="mt-4 mb-4">
                                    <h3 className="mt-4 admin-h3 mb-4">Message sent to user (Template)</h3>
                                </div>
                                <div className="form-group">
                                    <div className="widget-container">
                                        <HtmlEditor
                                            // height="725px"+
                                            mediaResizing={{
                                                enabled:true,
                                                allowedTargets:["table"]
                                            }}
                                            defaultValue={markupAcceptedEmail}
                                        >
                                           
                                            {/* <ImageUpload tabs={this.state.currentTab} fileUploadMode="base64" />    */}
                                            <Toolbar multiline={false}>
                                                <Item name="undo" />
                                                <Item name="redo" />
                                                <Item name="separator" />
                                                <Item
                                                    name="size"
                                                    acceptedValues={sizeValues}
                                                />
                                                <Item
                                                    name="font"
                                                    acceptedValues={fontValues}
                                                />
                                                <Item name="separator" />
                                                <Item name="bold" />
                                                <Item name="italic" />
                                                <Item name="strike" />
                                                <Item name="underline" />
                                                <Item name="separator" />
                                                <Item name="alignLeft" />
                                                <Item name="alignCenter" />
                                                <Item name="alignRight" />
                                                <Item name="alignJustify" />
                                                <Item name="separator" />
                                                <Item name="orderedList" />
                                                <Item name="bulletList" />
                                                <Item name="separator" />
                                                <Item
                                                    name="header"
                                                    acceptedValues={headerValues}
                                                />
                                                <Item name="separator" />
                                                <Item name="color" />
                                                <Item name="background" />
                                                <Item name="separator" />
                                                <Item name="link" />
                                                <Item name="image" />
                                                <Item name="separator" />
                                                <Item name="clear" />
                                                <Item name="codeBlock" />
                                                <Item name="blockquote" />
                                                <Item name="separator" />
                                                <Item name="insertTable" />
                                                <Item name="deleteTable" />
                                                <Item name="insertRowAbove" />
                                                <Item name="insertRowBelow" />
                                                <Item name="deleteRow" />
                                                <Item name="insertColumnLeft" />
                                                <Item name="insertColumnRight" />
                                                <Item name="deleteColumn" />
                                            </Toolbar>
                                        </HtmlEditor>
                                    </div>
                                    <p className="mt-4 mb-4">Note: <strong>@name</strong> denotes username</p>
                                </div>
                                <div className="card-footer text-center">
                                    <button type="submit" className="btn btn-block btn-primary btn-sm w-100">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AcceptedEmailCredential;