import { CheckBox, FileUploader, SelectBox } from "devextreme-react";
import { Position, ToolbarItem } from "devextreme-react/autocomplete";
import { EventObject, NativeEventInfo } from "devextreme/events";
import { SelectBoxInstance } from "devextreme/ui/select_box";
import SignatureCanvas from 'react-signature-canvas'
import { useState } from "react";
import Control from "../../../components/control";
import Popup from "../../../components/Popup";

interface SignatureModalProps {
    open: boolean,
    setOpen: any,
}

function ErrorPopUp({ open, setOpen }: SignatureModalProps) {

    const handleContinue = () => {
        try {
            setOpen(false)
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div>
            <Popup
                visible={open}
                //   onHiding={this.hideInfo}
                // closeOnOutsideClick={() => setOpen(!open)}
                dragEnabled={false}
                // hideOnOutsideClick={true}
                showCloseButton={false}
                showTitle={false}
                title="ELECTRONIC RECORDS AND SIGNATURE DISCLOSURE"
                container=".dx-viewport"
                // width={500}
                height={300}
                open={open}
                setOpen={setOpen}
            >
                <div className="text-center">
                    <h5>
                        Backoffice Number
                    </h5>
                </div>
                
                <div className="col-md-12 mt-2" style={{ border: "1px solid #e5e5e5" }}> </div>
                <div className="row my-2">
                    <p>
                    If this user already has a backoffice account number, please put in the complete account number, eg: 1GDN-GDN-145154-M, if this field is empty a new account will get opened in IClear. Both Margin and Cash account will be opened.
                    </p>
                </div>
                <div className="col-md-12 mt-2" style={{ border: "1px solid #e5e5e5" }}> </div>

                <div className='d-flex justify-content-center mt-4'>
                    <Control.Button className='btn btn-default bg-primary text-white button-width-icon-submit' style={{ marginRight: "12px" }} text='OK' onClick={handleContinue} />
                </div>
            </Popup>
        </div>
    )
}

export default ErrorPopUp;