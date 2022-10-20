import { FileUploader, Form, SelectBox } from "devextreme-react";
import { ButtonItem, GroupItem } from "devextreme-react/form";
import { PropTypes } from "inferno-compat";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { ApiRequestAsync } from "../../../services/httpservice";
import { next, previous, setCompany } from "../../../store/appreducer";
import { useStore } from "../../../store/store";
import { encryptFile, encryptFormData, encryptValue, handleImageArray } from "../../../util/common";
import ImageIframe from "../../../util/ImageIframe/ImageIframe";
import { toastError, toastSuccess } from "../../../util/toaster/Toaster";
import ErrorPopUp from "./ErrorPopUp";
const simpleProducts = ["Government issued ID", "Utility Bill & Passport"]
const fileExtensions = ['.jpeg', '.jpg', '.png'];
// interface IDproofProps {
//     formData_modal: any
// }

function IDproof() {
    const [errorShow, setErrorShow] = useState<string>("");
    const [showErrorPopUp, setShowErrorPopUp] = useState<boolean>(false);
    const [ImageFrameFlag, setImageFrameFlag] = useState<boolean>(false);
    const [IdentificationType, setIdentificationType] = useState<string>("Government issued ID");
    const [loading, setLoading] = useState<boolean>(false);
    const company = useAppSelector(e => e.appform.company);
    const { type } = useParams();
    const [formData, setFormData] = useState<{ front: File[] | undefined, back: File[] | undefined, corporateDocumentOne: File[] | undefined, corporateDocumentTwo: File[] | undefined, corporateDocumentThree: File[] | undefined, corporateDocumentFour: File[] | undefined }>({
        front: undefined,
        back: undefined,
        corporateDocumentOne: undefined,
        corporateDocumentTwo: undefined,
        corporateDocumentThree: undefined,
        corporateDocumentFour: undefined
    })
    const [image, setImage] = useState({
        front: "",
        back: "",
        corporateDocumentOne: "",
        corporateDocumentTwo: "",
        corporateDocumentThree: "",
        corporateDocumentFour: ""
    })
    // const [formData, setFormData] = useState<{
    //     IdentificationProofType: string,
    //     front: File | null,
    //     back: File | null,
    //     corporateDocumentOne: File | null,
    //     corporateDocumentTwo: File | null,
    //     corporateDocumentThree: File | null,
    //     corporateDocumentFour: File | null
    // }>({
    //     IdentificationProofType: "1",
    //     front: null,
    //     back: null,
    //     corporateDocumentOne: null,
    //     corporateDocumentTwo: null,
    //     corporateDocumentThree: null,
    //     corporateDocumentFour: null
    // });

    const dispatch = useAppDispatch();
    /*  move the stepper function backward start  */

    /*  move the stepper function backward End */

    const buttonOptionsPrevious = {
        text: 'Previous',
        type: 'normal',
        useSubmitBehavior: true,
        onClick: () => {
            dispatch(previous());
        }
    }

    const handleImageFrame = () => {
        setImageFrameFlag(!ImageFrameFlag)
        if (document.body.style.overflow !== "hidden") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "scroll";
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

    const handleFileUpload = async (File: Array<File>, key: string) => {
        if (File && File.length > 0) {
            // setFormData({ ...formData, [key]: File[0] });
            dispatch(setCompany({ [key]: File[0] }))
            const reader = new FileReader();
            reader.onload = function (e) {
                setImage({ ...image, [key]: e.target!.result });
            }
            reader.readAsDataURL(File[0]);

        }
    }

    useEffect(() => {
        try {
            if (company.front !== "" && company.back !== "" && typeof company.front === "string" && typeof company.back === "string") {
                let front = "";
                let front_Redux: File[] | undefined;
                let front_Api: any = null;

                let back = "";
                let back_Redux: File[] | undefined;
                let back_Api: any = null;

                let corporateDocumentOne = "";
                let corporateDocumentOne_Redux: File[] | undefined;
                let corporateDocumentOne_Api: any = null;

                let corporateDocumentTwo = "";
                let corporateDocumentTwo_Redux: File[] | undefined;
                let corporateDocumentTwo_Api: any = null;

                let corporateDocumentThree = "";
                let corporateDocumentThree_Redux: File[] | undefined;
                let corporateDocumentThree_Api: any = null;

                let corporateDocumentFour = "";
                let corporateDocumentFour_Redux: File[] | undefined;
                let corporateDocumentFour_Api: any = null;

                handleImageArray(company.front).then((blob) => {
                    front_Api = blob
                    front_Redux = [new File([blob], "front-image." + blob.type.substring(blob.type.lastIndexOf('/') + 1), { type: blob.type })];
                    const reader = new window.FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = () => {
                        const imageDataUrl = reader.result;
                        front = imageDataUrl as string
                    }

                    handleImageArray(company.back).then((blob) => {
                        back_Api = blob
                        back_Redux = [new File([blob], "front-image." + blob.type.substring(blob.type.lastIndexOf('/') + 1), { type: blob.type })];
                        const reader = new window.FileReader();
                        reader.readAsDataURL(blob);
                        reader.onload = () => {
                            const imageDataUrl = reader.result;
                            back = imageDataUrl as string
                        }

                        handleImageArray(company.corporateDocumentOne).then((blob) => {
                            corporateDocumentOne_Api = blob
                            corporateDocumentOne_Redux = [new File([blob], "front-image." + blob.type.substring(blob.type.lastIndexOf('/') + 1), { type: blob.type })];
                            const reader = new window.FileReader();
                            reader.readAsDataURL(blob);
                            reader.onload = () => {
                                const imageDataUrl = reader.result;
                                corporateDocumentOne = imageDataUrl as string
                            }

                            handleImageArray(company.corporateDocumentTwo).then((blob) => {
                                corporateDocumentTwo_Api = blob
                                corporateDocumentTwo_Redux = [new File([blob], "front-image." + blob.type.substring(blob.type.lastIndexOf('/') + 1), { type: blob.type })];
                                const reader = new window.FileReader();
                                reader.readAsDataURL(blob);
                                reader.onload = () => {
                                    const imageDataUrl = reader.result;
                                    corporateDocumentTwo = imageDataUrl as string
                                }
                                handleImageArray(company.corporateDocumentThree).then((blob) => {
                                    corporateDocumentThree_Api = blob
                                    corporateDocumentThree_Redux = [new File([blob], "front-image." + blob.type.substring(blob.type.lastIndexOf('/') + 1), { type: blob.type })];
                                    const reader = new window.FileReader();
                                    reader.readAsDataURL(blob);
                                    reader.onload = () => {
                                        const imageDataUrl = reader.result;
                                        corporateDocumentThree = imageDataUrl as string
                                    }

                                    handleImageArray(company.corporateDocumentFour).then((blob) => {
                                        corporateDocumentFour_Api = blob
                                        corporateDocumentFour_Redux = [new File([blob], "front-image." + blob.type.substring(blob.type.lastIndexOf('/') + 1), { type: blob.type })];
                                        const reader = new window.FileReader();
                                        reader.readAsDataURL(blob);
                                        reader.onload = () => {
                                            const imageDataUrl = reader.result;
                                            corporateDocumentFour = imageDataUrl as string;
                                            dispatch(setCompany({
                                                ...company,
                                                ["front"]: front_Api,
                                                ["back"]: back_Api,
                                                ["corporateDocumentOne"]: corporateDocumentOne_Api,
                                                ["corporateDocumentTwo"]: corporateDocumentTwo_Api,
                                                ["corporateDocumentThree"]: corporateDocumentThree_Api,
                                                ["corporateDocumentFour"]: corporateDocumentFour_Api,
                                            }))
                                            setImage({
                                                front: front,
                                                back: back,
                                                corporateDocumentOne: corporateDocumentOne,
                                                corporateDocumentTwo: corporateDocumentTwo,
                                                corporateDocumentThree: corporateDocumentThree,
                                                corporateDocumentFour: corporateDocumentFour
                                            });
                                            setFormData({
                                                front: front_Redux,
                                                back: back_Redux,
                                                corporateDocumentOne: corporateDocumentOne_Redux,
                                                corporateDocumentTwo: corporateDocumentTwo_Redux,
                                                corporateDocumentThree: corporateDocumentThree_Redux,
                                                corporateDocumentFour: corporateDocumentFour_Redux
                                            });
                                        }
                                    })


                                })

                            })

                        })



                    })
                })

            }
        } catch (error) {
            console.log(error)
        }
    }, [company.front])


    useEffect(() => {
        try {
            if (company.front !== null && company.back !== null && typeof company.front === "object" && typeof company.back === "object") {
                let front = "";
                let back = "";
                let corporateDocumentOne = "";
                let corporateDocumentTwo = "";
                let corporateDocumentThree = "";
                let corporateDocumentFour = "";
                let FrontImage_Redux = [new File([company.front], "front-image." + company.front.type.substring(company.front.type.lastIndexOf('/') + 1), { type: company.front.type })];
                let BackImage_Redux = [new File([company.back], "back-image." + company.back.type.substring(company.back.type.lastIndexOf('/') + 1), { type: company.back.type })]
                let corporateDocumentOne_Redux = [new File([company.corporateDocumentOne], "back-image." + company.corporateDocumentOne.type.substring(company.corporateDocumentOne.type.lastIndexOf('/') + 1), { type: company.corporateDocumentOne.type })]
                let corporateDocumentTwo_Redux = [new File([company.corporateDocumentTwo], "back-image." + company.corporateDocumentTwo.type.substring(company.corporateDocumentTwo.type.lastIndexOf('/') + 1), { type: company.corporateDocumentTwo.type })]
                let corporateDocumentThree_Redux = [new File([company.corporateDocumentThree], "back-image." + company.corporateDocumentThree.type.substring(company.corporateDocumentThree.type.lastIndexOf('/') + 1), { type: company.corporateDocumentThree.type })]
                let corporateDocumentFour_Redux = [new File([company.corporateDocumentFour], "back-image." + company.corporateDocumentFour.type.substring(company.corporateDocumentFour.type.lastIndexOf('/') + 1), { type: company.corporateDocumentFour.type })]
                const readerFront = new window.FileReader();
                readerFront.readAsDataURL(company.front);
                readerFront.onload = () => {
                    const imageDataUrlFront = readerFront.result;
                    front = imageDataUrlFront as string
                }
                const readerBack = new window.FileReader();
                readerBack.readAsDataURL(company.back);
                readerBack.onload = () => {
                    const imageDataUrlBack = readerBack.result;
                    back = imageDataUrlBack as string
                }
                const readercorporateDocumentOne = new window.FileReader();
                readercorporateDocumentOne.readAsDataURL(company.corporateDocumentOne);
                readercorporateDocumentOne.onload = () => {
                    const imageDataUrlcorporateDocumentOne = readercorporateDocumentOne.result;
                    corporateDocumentOne = imageDataUrlcorporateDocumentOne as string
                }
                const readercorporateDocumentTwo = new window.FileReader();
                readercorporateDocumentTwo.readAsDataURL(company.corporateDocumentTwo);
                readercorporateDocumentTwo.onload = () => {
                    const imageDataUrlcorporateDocumentTwo = readercorporateDocumentTwo.result;
                    corporateDocumentTwo = imageDataUrlcorporateDocumentTwo as string
                }
                const readercorporateDocumentThree = new window.FileReader();
                readercorporateDocumentThree.readAsDataURL(company.corporateDocumentThree);
                readercorporateDocumentThree.onload = () => {
                    const imageDataUrlcorporateDocumentThree = readercorporateDocumentThree.result;
                    corporateDocumentThree = imageDataUrlcorporateDocumentThree as string
                }
                const readercorporateDocumentFour = new window.FileReader();
                readercorporateDocumentFour.readAsDataURL(company.corporateDocumentFour);
                readercorporateDocumentFour.onload = () => {
                    const imageDataUrlcorporateDocumentFour = readercorporateDocumentFour.result;
                    corporateDocumentFour = imageDataUrlcorporateDocumentFour as string
                    setImage({
                        front: front,
                        back: back,
                        corporateDocumentOne: corporateDocumentOne,
                        corporateDocumentTwo: corporateDocumentTwo,
                        corporateDocumentThree: corporateDocumentThree,
                        corporateDocumentFour: corporateDocumentFour
                    });
                    setFormData({
                        front: FrontImage_Redux,
                        back: BackImage_Redux,
                        corporateDocumentOne: corporateDocumentOne_Redux,
                        corporateDocumentTwo: corporateDocumentTwo_Redux,
                        corporateDocumentThree: corporateDocumentThree_Redux,
                        corporateDocumentFour: corporateDocumentFour_Redux
                    });
                }


            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    const handleGovtId = (e: any) => {
        try {
            if (e === "Government issued ID") {
                setIdentificationType(e)
                dispatch(setCompany({ ["IdentificationProofType"]: "1" }))
                // setFormData({
                //     ...formData,
                //     ["IdentificationProofType"]: "1"
                // })
            } else {
                setIdentificationType(e)
                dispatch(setCompany({ ["IdentificationProofType"]: "2" }))
                // setFormData({
                //     ...formData,
                //     ["IdentificationProofType"]: "2"
                // })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async () => {
        if (company.front === null || company.back === null) {
            if (company.IdentificationProofType === "1") {
                setErrorShow("Government Issued ID is required.")
            } else if (company.IdentificationProofType === "2") {
                setErrorShow("Utility Bill & Passport are required.")
            }
            return;
        }

        if (company.corporateDocumentOne === null || company.corporateDocumentTwo === null || company.corporateDocumentThree === null || company.corporateDocumentFour === null) {
            setErrorShow("Please upload Corporate Documents.")
            return;
        }
        setLoading(true)
        let formData_modal = {
            Name: company.Name,
            address: company.address,
            aptOrSuite: company.aptOrSuite,
            country: company.country,
            state: company.state,
            city: company.city,
            zipCode: company.zipCode,
            phoneNumber: company.phoneNumber,
            email: company.email,
            taxIdNum: company.taxIdNum,
            isMailingAddressDifferent: company.isMailingAddressDifferent,
            mACompanyAddress: company.mACompanyAddress,
            mACountry: company.mACountry,
            mAAptOrSuite: company.mAAptOrSuite,
            mACity: company.mACity,
            mAState: company.mAState,
            mAZipCode: company.mAZipCode,
        }
        ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=1`, {
            ...encryptFormData({ ...formData_modal }),
            IdentificationProofType: encryptValue(company.IdentificationProofType),
            front: await encryptFile(company.front!),
            back: await encryptFile(company.back!),
            corporateDocumentOne: await encryptFile(company.corporateDocumentOne!),
            corporateDocumentTwo: await encryptFile(company.corporateDocumentTwo!),
            corporateDocumentThree: await encryptFile(company.corporateDocumentThree!),
            corporateDocumentFour: await encryptFile(company.corporateDocumentFour!),
        }).then(c => {
            setLoading(false)
            dispatch(next());
            toastSuccess("Company Details added successfully");
        }).catch((error) => {
            setLoading(false)
            toastError(error?.message);
        })

        // setErrorShow(true)
        // setShowErrorPopUp(true)
        // NextStep()
    }
    /*  handle the form submission start */
    return (
        <div className="row">
            <ErrorPopUp open={showErrorPopUp} setOpen={setShowErrorPopUp} />
            {ImageFrameFlag && <ImageIframe Imageurl='http://localhost:3000/assets/pdf/PassportVERIFICATIONGuideline.pdf' ImageFrameFlag={ImageFrameFlag} setImageFrameFlag={setImageFrameFlag} />}
            <div className="long-title mt-3"> <h3 className="fs-title">IDENTIFICATION PROOF UPLOAD</h3></div>
            <Loader loading={loading} />
            <br></br>
            <p>
                Government issued ID. If Driver's License is used and the address is not the same as on the application please provide a utility bill with your name and address. You can email a copy to guardian.newaccounts@velocityclearingllc.com
            </p>
            <div className="col-sm-12 col-md-12">
                <SelectBox value={IdentificationType} items={simpleProducts} placeholder={""} onValueChange={handleGovtId} />
            </div>
            <p className="mt-4">
                {
                    IdentificationType === "Government issued ID" ? <b>Please upload a copy of the Applicant’s Government issued ID in jpeg format (Front and Back)</b> : <b>Please upload a copy of Your Utility Bill & Passport PDF format</b>
                }


            </p>
            <div className="w-100 d-flex fileuploader-container" >
                <div className="w-40 d-flex">
                    <div className="file-uploader-block">
                        <FileUploader value={formData.front ?? []} minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={fileExtensions} onValueChange={(file) => handleFileUpload(file, "front")} selectButtonText="Choose File" labelText="" accept="image/*" uploadMode="useForm" />
                        <span className="note" style={{ marginLeft: "9px" }} >{'Allowed file extensions: '}
                            <span>.jpeg, .jpg, .png</span>
                            .
                        </span> <br />
                        <span className="note" style={{ marginLeft: "9px" }}>{'File size: '}
                            <span>1KB - 8MB</span>
                            .
                        </span>
                        <div className="note" style={{ marginLeft: "9px", display: "block" }}>
                            {image.front && <img src={image.front} alt="Select Image" width={630} height={300} />}
                        </div>
                    </div>
                </div>
                <div className="w-40 d-flex">
                    <div className="file-uploader-block">
                        <FileUploader value={formData.back ?? []} minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={fileExtensions} onValueChange={(file) => handleFileUpload(file, "back")} selectButtonText="Choose File" labelText="" accept="image/*" uploadMode="useForm" />
                        <span className="note" style={{ marginLeft: "9px" }} >{'Allowed file extensions: '}
                            <span>.jpeg, .jpg, .png</span>
                            .
                        </span> <br />
                        <span className="note" style={{ marginLeft: "9px" }}>{'File size: '}
                            <span>1KB - 8MB</span>
                            .
                        </span>
                        <div className="note" style={{ marginLeft: "9px", display: "block" }}>
                            {image.back && <img src={image.back} alt="Select Image" width={630} height={300} />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <Link to="" onClick={handleImageFrame}>
                    Image Hints and Tips
                </Link>
            </div>
            <p className="mt-4">
                In addition to your ID, please submit Article of Incorporation, Certificate of Incorporation, Articles of Organization and Certification of Beneficial Ownership. (If foreign please submit W8 BEN-E)
            </p>
            <p className="my-2">
                <b>Please upload a copy of the Applicant’s Government issued ID in jpeg format (Front and Back)</b>
            </p>
            <div className="w-100 d-flex fileuploader-container" >
                <div className="w-40 d-flex">
                    <div className="file-uploader-block">
                        <FileUploader value={formData.corporateDocumentOne ?? []} minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={fileExtensions} onValueChange={(file) => handleFileUpload(file, "corporateDocumentOne")} selectButtonText="Choose File" labelText="" accept="image/*" uploadMode="useForm" />
                        <span className="note" style={{ marginLeft: "9px" }} >{'Allowed file extensions: '}
                            <span>.jpeg, .jpg, .png</span>
                            .
                        </span> <br />
                        <span className="note" style={{ marginLeft: "9px" }}>{'File size: '}
                            <span>1KB - 8MB</span>
                            .
                        </span>
                        <div className="note" style={{ marginLeft: "9px", display: "block" }}>
                            {image.corporateDocumentOne && <img src={image.corporateDocumentOne} alt="Select Image" width={630} height={300} />}
                        </div>
                    </div>
                </div>
                <div className="w-40 d-flex">
                    <div className="file-uploader-block">
                        <FileUploader value={formData.corporateDocumentTwo ?? []} minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={fileExtensions} onValueChange={(file) => handleFileUpload(file, "corporateDocumentTwo")} selectButtonText="Choose File" labelText="" accept="image/*" uploadMode="useForm" />
                        <span className="note" style={{ marginLeft: "9px" }} >{'Allowed file extensions: '}
                            <span>.jpeg, .jpg, .png</span>
                            .
                        </span> <br />
                        <span className="note" style={{ marginLeft: "9px" }}>{'File size: '}
                            <span>1KB - 8MB</span>
                            .
                        </span>
                        <div className="note" style={{ marginLeft: "9px", display: "block" }}>
                            {image.corporateDocumentTwo && <img src={image.corporateDocumentTwo} alt="Select Image" width={630} height={300} />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-100 d-flex fileuploader-container" >
                <div className="w-40 d-flex">
                    <div className="file-uploader-block">
                        <FileUploader value={formData.corporateDocumentThree ?? []} minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={fileExtensions} onValueChange={(file) => handleFileUpload(file, "corporateDocumentThree")} selectButtonText="Choose File" labelText="" accept="image/*" uploadMode="useForm" />
                        <span className="note" style={{ marginLeft: "9px" }} >{'Allowed file extensions: '}
                            <span>.jpeg, .jpg, .png</span>
                            .
                        </span> <br />
                        <span className="note" style={{ marginLeft: "9px" }}>{'File size: '}
                            <span>1KB - 8MB</span>
                            .
                        </span>
                        <div className="note" style={{ marginLeft: "9px", display: "block" }}>
                            {image.corporateDocumentThree && <img src={image.corporateDocumentThree} alt="Select Image" width={630} height={300} />}
                        </div>
                    </div>
                </div>
                <div className="w-40 d-flex">
                    <div className="file-uploader-block">
                        <FileUploader value={formData.corporateDocumentFour ?? []} minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={fileExtensions} onValueChange={(file) => handleFileUpload(file, "corporateDocumentFour")} selectButtonText="Choose File" labelText="" accept="image/*" uploadMode="useForm" />
                        <span className="note" style={{ marginLeft: "9px" }} >{'Allowed file extensions: '}
                            <span>.jpeg, .jpg, .png</span>
                            .
                        </span> <br />
                        <span className="note" style={{ marginLeft: "9px" }}>{'File size: '}
                            <span>1KB - 8MB</span>
                            .
                        </span>
                        <div className="note" style={{ marginLeft: "9px", display: "block" }}>
                            {image.corporateDocumentFour && <img src={image.corporateDocumentFour} alt="Select Image" width={630} height={300} />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mr-2 mt-2">
                <Form
                    colCount={1}
                    showColonAfterLabel={false}
                    readOnly={false}
                    showValidationSummary={true}
                    validationGroup="customerData"
                    labelLocation="top">
                    <ButtonItem
                        horizontalAlignment="right"
                        colSpan={1}
                        buttonOptions={buttonOptionsNext}
                    />
                </Form>
            </div>
            <div className="d-flex justify-content-start" >
                {errorShow !== "" && <span className="text-danger">{errorShow}</span>}
            </div>
        </div>
    )
}

export default IDproof; 