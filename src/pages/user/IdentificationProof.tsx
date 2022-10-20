import { FileUploader, Form, SelectBox } from "devextreme-react"
import { ButtonItem, GroupItem } from "devextreme-react/form";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import Control from "../../components/control"
import Loader from "../../components/Loader/Loader";
import { ApiRequestAsync } from "../../services/httpservice";
import { useStore } from "../../store/store";
import { encryptFile, encryptFormData, encryptValue, handleImageArray } from "../../util/common";
import { toastError, toastSuccess } from "../../util/toaster/Toaster";
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { next, previous, setIdentityProof } from "../../store/appreducer";
import ImageIframe from "../../util/ImageIframe/ImageIframe";
import axios from "axios";
import { token } from "../../services/webstorage";


const simpleProducts = ["Government Issued ID", "Utility Bill & Passport"]
const fileExtensions = ['.jpeg', '.jpg', '.png'];



function IdentificationProof() {
    const [errorShow, setErrorShow] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [IdentificationType, setIdentificationType] = useState<string>("Government Issued ID");
    const [fileUpload, setFileUpload] = useState<any>([]);
    const [ImageFrameFlag, setImageFrameFlag] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const identityProof = useAppSelector(e => { return e.appform.identityProof });
    const [errorShowApi, setErrorShowApi] = useState<Array<string>>([])

    const [image, setImage] = useState({
        FrontImage: "",
        BackImage: ""
    })
    const [formData, setFormData] = useState<{ FrontImage: File[] | undefined, BackImage: File[] | undefined }>({
        FrontImage: undefined,
        BackImage: undefined
    })
    // const [formData, setFormData] = useState<{
    //     IdentificationType: string,
    //     FrontImage: File | null,
    //     BackImage: File | null
    // }>({
    //     IdentificationType: "1",
    //     FrontImage: null,
    //     BackImage: null
    // });
    const { type } = useParams();

    const buttonOptionsPrevious = {
        text: 'Previous',
        type: 'normal',
        useSubmitBehavior: true,
        onClick: () => {
            dispatch(previous());
        }
    }

    const buttonOptionsNext = {
        text: 'Next',
        type: 'default',
        useSubmitBehavior: true,
        onClick: () => {
            handleSubmit()
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        if (identityProof && identityProof.IdentificationType !== "" && identityProof.FrontImage !== null && identityProof.BackImage !== null) {
            ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=8`, {
                IdentificationProofType: encryptValue(identityProof.IdentificationType),
                //@ts-ignore
                FrontIdentification: await encryptFile(formData.FrontImage[0]),
                //@ts-ignore
                BackIdentification: await encryptFile(formData.BackImage[0])
            }).then(c => {
                setLoading(false)
                dispatch(next());
                toastSuccess("Identification Proof added successfully");
            }).catch((error) => {
                setLoading(false)
                // toastError(error?.message);
                if (typeof error.response?.data === "object") {
                    setErrorShowApi(Object.values(error.response.data).flatMap(c => c) as Array<string>);
                } else {
                    toastError(error?.message);
                }
            })
        } else {
            setLoading(false)
            if (IdentificationType === "Government Issued ID") {
                setErrorShow("Government Issued ID is required.")
            } else {
                setErrorShow("Utility Bill & Passport are required.")
            }
        }
    }

    useEffect(() => {
        if (identityProof.FrontImage !== "" && identityProof.BackImage !== "" && typeof identityProof.FrontImage === "string" && typeof identityProof.BackImage === "string") {
            let front_Image = "";
            let back_Image = "";
            let FrontImage_Redux: File[] | undefined;
            let BackImage_Redux: File[] | undefined;
            let FrontImage_Api: any = null;
            let BackImage_Api: any = null;
            handleImageArray(identityProof.FrontImage).then((blob) => {
                FrontImage_Api = blob
                FrontImage_Redux = [new File([blob], "front-image." + blob.type.substring(blob.type.lastIndexOf('/') + 1), { type: blob.type })];
                const reader = new window.FileReader();
                reader.readAsDataURL(blob);
                reader.onload = () => {
                    const imageDataUrl = reader.result;
                    front_Image = imageDataUrl as string
                    console.log("front")
                }
                handleImageArray(identityProof.BackImage).then((_blob) => {
                    BackImage_Api = _blob
                    BackImage_Redux = [new File([_blob], "back-image." + _blob.type.substring(_blob.type.lastIndexOf('/') + 1), { type: _blob.type })];
                    const reader = new window.FileReader();
                    reader.readAsDataURL(_blob);
                    reader.onload = () => {
                        const imageDataUrl = reader.result;
                        back_Image = imageDataUrl as string
                        dispatch(setIdentityProof({
                            ...identityProof,
                            ["FrontImage"]: FrontImage_Api,
                            ["BackImage"]: BackImage_Api,
                        }))
                        setImage({
                            FrontImage: front_Image,
                            BackImage: back_Image
                        });
                        setFormData({
                            FrontImage: FrontImage_Redux,
                            BackImage: BackImage_Redux
                        });

                    }
                })
            })
        }
    }, [])

    useEffect(() => {
        try {
            if (identityProof.FrontImage !== null && identityProof.BackImage !== null && typeof identityProof.FrontImage === "object" && typeof identityProof.BackImage === "object") {
                let front_Image = "";
                let back_Image = "";
                let FrontImage_Redux = [new File([identityProof.FrontImage], "front-image." + identityProof.FrontImage.type.substring(identityProof.FrontImage.type.lastIndexOf('/') + 1), { type: identityProof.FrontImage.type })];
                let BackImage_Redux = [new File([identityProof.BackImage], "back-image." + identityProof.BackImage.type.substring(identityProof.BackImage.type.lastIndexOf('/') + 1), { type: identityProof.BackImage.type })]
                const reader = new window.FileReader();
                reader.readAsDataURL(identityProof.FrontImage);
                reader.onload = () => {
                    const imageDataUrl = reader.result;
                    front_Image = imageDataUrl as string
                }
                setTimeout(() => {
                    reader.readAsDataURL(identityProof.BackImage);
                    reader.onload = () => {
                        const imageDataUrl = reader.result;
                        back_Image = imageDataUrl as string
                        setImage({
                            FrontImage: front_Image,
                            BackImage: back_Image
                        });
                        setFormData({
                            FrontImage: FrontImage_Redux,
                            BackImage: BackImage_Redux
                        });
                    }
                }, 500);
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    const handleImageFrame = () => {
        setImageFrameFlag(!ImageFrameFlag)
        if (document.body.style.overflow !== "hidden") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "scroll";
        }
    }


    const handleFileUpload = async (File: Array<File>, key: string) => {
        if (File && File.length > 0) {

            setFormData({ ...formData, [key]: File });
            dispatch(setIdentityProof({ ...identityProof, [key]: File[0] }))
            const reader = new FileReader();
            reader.onload = function (e) {
                setImage({ ...image, [key]: e.target!.result });
            }
            reader.readAsDataURL(File[0]);

        }
    }

    const handleGovtId = (e: any) => {
        try {
            if (e === "Government issued ID") {
                setIdentificationType(e)
                dispatch(setIdentityProof({ ...identityProof, ["IdentificationType"]: "1" }))
                // setFormData({
                //     ...formData,
                //     ["IdentificationType"]: "1"
                // })
            } else {
                setIdentificationType(e)
                dispatch(setIdentityProof({ ...identityProof, ["IdentificationType"]: "2" }))
                // setFormData({
                //     ...formData,
                //     ["IdentificationType"]: "2"
                // })
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className={`${type !== "1" ? "my-5" : "mt-3 mb-3"}`}>
            <div className="property-form">
                {ImageFrameFlag && <ImageIframe Imageurl='http://localhost:3000/assets/pdf/PassportVERIFICATIONGuideline.pdf' ImageFrameFlag={ImageFrameFlag} setImageFrameFlag={setImageFrameFlag} />}
                <div className="row">
                    <Loader loading={loading} />
                    {/* <div className="col-md-1"></div> */}
                    <div className="align-center signUpBoxShadow col-md-12 imageUploadDiv">
                        <div className="long-title"><h3 className="fs-title">IDENTIFICATION PROOF UPLOAD</h3></div>
                        <br />
                        <p>
                            Government issued ID. If Driver's License is used and the address is not
                            the same as
                            on the application please provide a utility bill with your name and
                            address. You can
                            email a copy to guardian.newaccounts@velocityclearingllc.com
                        </p>
                        <SelectBox value={IdentificationType} items={simpleProducts} placeholder={""} onValueChange={handleGovtId} />

                        <p className="mt-4">
                            <b>Please upload a copy of Your Utility Bill & Passport PDF format</b>
                        </p>

                        <div className="w-100 d-flex fileuploader-container">
                            <div className="w-40 d-flex">
                                <div className="file-uploader-block">
                                    <FileUploader value={formData.FrontImage ?? []} minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={fileExtensions} onValueChange={(file) => handleFileUpload(file, "FrontImage")} selectButtonText="Choose File" labelText="" accept="image/*" uploadMode="useForm" />
                                    <span className="note" style={{ marginLeft: "9px" }} >{'Allowed file extensions: '}
                                        <span>.jpeg, .jpg, .png</span>
                                        .
                                    </span> <br />
                                    <span className="note" style={{ marginLeft: "9px" }}>{'File size: '}
                                        <span>1KB - 8MB</span>
                                        .
                                    </span>
                                    <div className="note" style={{ marginLeft: "9px", display: "block" }}>
                                        {image.FrontImage && <img src={image.FrontImage} alt="Select Image" width={400} height={250} />}
                                    </div>
                                </div>
                            </div>
                            <div className="w-40 d-flex">
                                <div className="file-uploader-block">
                                    <FileUploader value={formData.BackImage ?? []} minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={fileExtensions} onValueChange={(file) => handleFileUpload(file, "BackImage")} selectButtonText="Choose File" labelText="" accept="image/*" uploadMode="useForm" />
                                    <span className="note" style={{ marginLeft: "9px" }} >{'Allowed file extensions: '}
                                        <span>.jpeg, .jpg, .png</span>
                                        .
                                    </span> <br />
                                    <span className="note" style={{ marginLeft: "9px" }}>{'File size: '}
                                        <span>1KB - 8MB</span>
                                        .
                                    </span>
                                    <div className="note" style={{ marginLeft: "9px", display: "block" }}>
                                        {image.BackImage && <img src={image.BackImage} alt="Select Image" width={400} height={250} />}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="mt-4">
                            <Link to="" onClick={handleImageFrame}>
                                Image Hints and Tips
                            </Link>
                        </div>
                        <div className="d-flex justify-content-end" >
                            {errorShow && <span className="text-danger">{errorShow}</span>}
                        </div>
                        <Form
                            colCount={1}
                            showColonAfterLabel={false}
                            readOnly={false}
                            showValidationSummary={true}
                            validationGroup="customerData"
                            labelLocation="top">
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
                        {errorShowApi.map(c => <div className=" mt-2 dx-item dx-validationsummary-item"><div className="dx-item-content dx-validationsummary-item-content">{c}</div></div>)}
                        {/* <div className='d-flex justify-content-end mt-4'>
                        <Control.Button className='btn btn-default bg-primary text-white button-width' text='Previous' onClick={handlePreviousButton} />
                        <Control.Button className='btn btn-default bg-primary text-white button-width' text='Next' onClick={handleSubmit} />
                    </div> */}
                    </div>
                    {/* <div className="col-md-1"></div> */}
                </div>
            </div>
        </div>
    )
}

export default IdentificationProof