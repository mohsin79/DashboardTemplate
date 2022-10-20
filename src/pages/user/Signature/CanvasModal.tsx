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
    DataURL: any,
    DataSignatureURL: any
}

const simpleProducts = ["Draw Signature", "Upload Image"]

// const INITIAL_FORM_VALUE = {
//     signatureType: "Upload Image"
// }

function CanvasModal({ open, setOpen, DataURL, DataSignatureURL }: SignatureModalProps) {
    // const [formData, setFormData] = useState<{ signatureType: string }>({
    //     signatureType: "Upload Image"
    // });

    const [signatureType, setSignatureType] = useState<any>("Draw Signature")
    const [sigPad, setSigPad] = useState<any>({})

    const sendContinue = () => {
        try {

        } catch (error) {
            console.log(error)
        }
    }

    const handleContinue = () => {
        try {
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

    const handleOnChange = (e: NativeEventInfo<SelectBoxInstance, Event>) => {
        try {
            setSignatureType(e)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSignatureEnd = () => {
        try {
            DataURL(sigPad.getTrimmedCanvas().toDataURL('image/png'))
            sigPad._canvas.toBlob((blob: Blob) => {
                let file = new File([blob], "file.png", { type: "image/png" })
                DataSignatureURL(file)
            }, 'image/png')
        } catch (error) {
            console.log(error)
        }
    }



    const handleFileUpload = async (File: Array<File>, key: string) => {
        if (File && File.length > 0) {
            DataSignatureURL(File[0]);
            const reader = new FileReader();
            reader.onload = function (e) {
                DataURL(e.target!.result);
            }
            reader.readAsDataURL(File[0]);

        }
    }

    const handleCanvasClear = () => {
        try {
            sigPad.clear()
        } catch (error) {
            console.log(error)
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
                width={300}
                height={signatureType === "Draw Signature" ? 480 : 420}
                open={open}
                setOpen={setOpen}
            >
                <div className="text-center">
                    <h5>
                        Signature
                    </h5>
                </div>

                <div className="row mt-4">
                    <div className="col-12">
                        <div className="">
                            <SelectBox defaultValue={signatureType} onValueChange={handleOnChange} items={simpleProducts} placeholder={""} />
                        </div>
                    </div>
                    {
                        signatureType === "Draw Signature" ? <div className="signatureTypes mt-4">
                            <p className="drawItDesc">Draw your New Signature</p>
                            <div className="sig sigWrapper">
                                <div className="typed"></div>
                                <SignatureCanvas penColor='black'
                                    ref={(ref) => setSigPad(ref)}
                                    onEnd={handleSignatureEnd}
                                    canvasProps={{ width: 255, height: 200, className: 'sigCanvas' }} />
                            </div>
                            <div className="d-flex justify-content-end" style={{ marginRight: "7px" }} onClick={handleCanvasClear}>
                                Clear
                            </div>
                        </div> : <div id="uploadImage" className="signatureTypes mt-4">
                            <div className="form-group">
                                <p className="drawItDesc">Upload Your Signature Picture(.png, .jpeg, .jpg)*	</p>
                                <span id="signerror"></span>
                                <FileUploader selectButtonText="Choose File" labelText="" onValueChange={(file) => handleFileUpload(file, "BackImage")} accept="image/*" uploadMode="useForm" />
                            </div>
                        </div>

                    }

                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <Control.Button className='btn btn-default bg-primary text-white button-width-icon-submit' style={{ marginRight: "12px" }} text='Submit Image' onClick={handleContinue} />
                </div>
            </Popup>
        </div>
    )
}

export default CanvasModal;