import { CheckBox} from "devextreme-react";
import { Position, ToolbarItem } from "devextreme-react/autocomplete";
import { EventObject } from "devextreme/events";
import { useState } from "react";
import Control from "../../../components/control";
import Popup from "../../../components/Popup";
import CanvasModal from "./CanvasModal";

interface SignatureModalProps {
    open: boolean,
    setOpen: any,
    setShowCanvasModal: any
}

function SignatureModal({ open, setOpen, setShowCanvasModal }: SignatureModalProps) {
    const sendContinue = () => {
        try {

        } catch (error) {
            console.log(error)
        }
    }

    const handleContinue = () => {
        try {
            setShowCanvasModal(true)
            setOpen(false)
        } catch (error) {
            console.log(error);
        }
    }
    
    const continueButtonOptions = {
        icon: 'email',
        text: 'Continue',
        onClick: sendContinue()
    }

    const cancelButtonOptions = {
        icon: 'email',
        text: 'Continue'
    }

    return (
        <div>
            
            <Popup
                visible={open}
                //   onHiding={this.hideInfo}
                // closeOnOutsideClick={() => setOpen(!open)}
                dragEnabled={false}
                // hideOnOutsideClick={true}
                showCloseButton={true}
                showTitle={false}
                title="ELECTRONIC RECORDS AND SIGNATURE DISCLOSURE"
                container=".dx-viewport"
                width={350}
                height={290}
                open={open}
                setOpen={setOpen}
                className={"w-25"}
            >
                <div className="d-flex text-center">
                    <h5>
                        ELECTRONIC RECORDS AND SIGNATURE DISCLOSURE
                    </h5>
                </div>

                <div className="row mt-4">
                    <div className='col-md-auto mt-2'>
                        <CheckBox defaultValue={true} />
                    </div>
                    <div className='col-md-10'>
                        <p>
                            By checking the box "I agree to use Electronic Records and Signatures, you agree that you or the firm you represent will be legally bound by your electronic signature.”
                        </p>
                    </div>
                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <Control.Button className='btn btn-default bg-primary text-white button-width-icon' style={{ marginRight: "12px" }} icon="arrowright" text='Continue' onClick={handleContinue} />
                    <Control.Button className='btn btn-default bg-secondary text-white button-width-icon' text='Cancel' onClick={() => setOpen(false)} />
                </div>
            </Popup>
        </div>
    )
}

export default SignatureModal;