import React, { useState } from 'react';
import Control from '../../../components/control';
import "../../../Styles/components/Company/CompanyTabs.scss"
import { MdClose } from "react-icons/md"
import { useStore } from '../../../store/store';
import Loader from '../../../components/Loader/Loader';
import PersonalDetails from '../../user/personalDetail';
import IDinformation from '../../user/IDinformation';
import { Link } from 'react-router-dom';
import { FileUploader, Form, SelectBox } from 'devextreme-react';
import { ButtonItem, GroupItem } from 'devextreme-react/form';
import { ClickEvent } from 'devextreme/ui/button';
import { encryptFile, encryptFormData, encryptValue } from '../../../util/common';
import { Button } from 'devextreme-react';
import TabPanel, { Item } from "devextreme-react/tab-panel";

const simpleProducts = ["Government Issued ID", "Utility Bill & Passport"]
let fileExtensions = ['.jpeg', '.jpg', '.png'];
let billExtensions = ['.pdf']

function BeneficiaryTab() {
    const [beneficialOwner, setBeneficialOwner] = useState<number[]>([1])
    const [loading, setLoading] = useState<boolean>(false);
    const [state, dispatch] = useStore();
    const [selectedBeneficialOwner, setSelectedBeneficialOwner] = useState<number>(1);
    const [beneficialCertificate, setBeneficialCertificate] = useState<File | null>(null);
    const [personalFormData, setPersonalFormData] = useState<object>({});
    const [IdInformationData, setIdInformationData] = useState<object>({});
    const [IdentificationType, setIdentificationType] = useState<string>("Government Issued ID");
    const [LLCBeneficiaryMutationData, setLLCBeneficiaryMutationData] = useState<any>([])
    const [image, setImage] = useState({
        FrontImage: "",
        BackImage: ""
    })
    const [formData, setFormData] = useState<{
        IdentificationType: string,
        FrontImage: File | null,
        BackImage: File | null
    }>({
        IdentificationType: "1",
        FrontImage: null,
        BackImage: null
    });

    const BeneficialOwner = () => {
        try {
            let lastIndexValue = beneficialOwner[beneficialOwner.length - 1] + 1
            let BeneficialOwnerData = [...beneficialOwner]
            BeneficialOwnerData.push(lastIndexValue)
            setSelectedBeneficialOwner(lastIndexValue)
            setBeneficialOwner(BeneficialOwnerData)
        } catch (error) {
            console.log(error)
        }
    }

    const buttonOptionsPrevious = {
        text: 'Previous',
        type: 'normal',
        useSubmitBehavior: true,
        onClick: () => {
            handlePreviousButton()
        }
    }

    const handleSubmit = async (e: ClickEvent) => {
        const { isValid } = e.validationGroup.validate();
        if (isValid && (formData && formData.IdentificationType !== "" && formData.FrontImage !== null && formData.BackImage !== null)) {
            let benefiaryData = [...LLCBeneficiaryMutationData]
            let bneficiaryDataRecord = {
                ...encryptFormData(personalFormData),
                ...encryptFormData(IdInformationData),
                boForm: await encryptFile(beneficialCertificate!),
                IdentificationProofType: encryptValue(formData.IdentificationType),
                FrontIdentification: await encryptFile(formData.FrontImage!),
                BackIdentification: await encryptFile(formData.BackImage!)
            }
            benefiaryData.push(bneficiaryDataRecord)
            BeneficialOwner()
            e.component._refresh()
            // console.log(e.component)
        }
    }

    const buttonOptionsNext = {
        type: 'default',
        icon: "add",
        useSubmitBehavior: true,
        onClick: (e: any) => {
            handleSubmit(e)
        }
    }

    /*  move the stepper function backward start  */
    const previousForm = () => {
        try {
            // @ts-ignore
            dispatch({ type: 'STEPPER_INDEX', payload: --state.stepperIndex });
        } catch (error) {
            console.log(error)
        }
    }
    /*  move the stepper function backward End */

    /*  move the stepper function backward End */

    const handlePreviousButton = () => {
        try {
            previousForm()
        } catch (error) {
            console.log(error)
        }
    }
    /*  handle previous button function End */


    const handleGovtId = (e: any) => {
        try {
            if (e === "Government issued ID") {
                setIdentificationType(e)
                setFormData({
                    ...formData,
                    ["IdentificationType"]: "1"
                })
                fileExtensions = ['.jpeg', '.jpg', '.png']
            } else {
                setIdentificationType(e)
                setFormData({
                    ...formData,
                    ["IdentificationType"]: "2"
                })
                fileExtensions = ['.pdf'];
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleFileUpload = async (File: Array<File>, key: string) => {
        if (File && File.length > 0) {
            setFormData({ ...formData, [key]: File[0] });

            const reader = new FileReader();
            reader.onload = function (e) {
                setImage({ ...image, [key]: e.target!.result });
            }
            reader.readAsDataURL(File[0]);

        }
    }

    const handleBeneficialOwnerCross = (button_Index: number) => {
        try {
            if (button_Index !== undefined) {
                let updated_Beneficial_Deleted_record = button_Index + 1
                let BeneficialOwnerRecord = [...beneficialOwner]
                BeneficialOwnerRecord = BeneficialOwnerRecord.filter((item) => item !== updated_Beneficial_Deleted_record)
                setBeneficialOwner(BeneficialOwnerRecord)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <Loader loading={loading} />
            <h3> Beneficial Owner - </h3>
            <PersonalDetails beneficialCertificate={beneficialCertificate} setPersonal={setPersonalFormData} setBeneficialCertificate={setBeneficialCertificate} />
            <div className="col-md-12" style={{ border: "1px solid #e5e5e5" }}> </div>
            <IDinformation setIdInformationData={setIdInformationData} />
            <div className="col-md-12" style={{ border: "1px solid #e5e5e5" }}> </div>
            <div className="property-form">
                <div className="row">
                    <div className="align-center signUpBoxShadow col-md-12 imageUploadDiv mt-3 mb-3 mx-2">
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

                            {IdentificationType === "Government Issued ID" ? <b> Please upload a copy of the Applicant’s Government issued ID in jpeg format (Front and Back) </b> : <b>Please upload a copy of Your Utility Bill & Passport PDF format</b>}
                        </p>

                        <div className="w-100 d-flex fileuploader-container" >
                            <div className="w-40 d-flex">
                                <div className="file-uploader-block">
                                    <FileUploader minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={IdentificationType === "Government Issued ID" ? fileExtensions : billExtensions} onValueChange={(file) => handleFileUpload(file, "FrontImage")} selectButtonText="Choose File" labelText="" accept={IdentificationType === "Government Issued ID" ? "image/*" : ".pdf"} uploadMode="useForm" />

                                </div>
                            </div>
                            <div className="w-40 d-flex">
                                <div className="file-uploader-block">
                                    <FileUploader minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={IdentificationType === "Government Issued ID" ? fileExtensions : billExtensions} onValueChange={(file) => handleFileUpload(file, "BackImage")} selectButtonText="Choose File" labelText="" accept={IdentificationType === "Government Issued ID" ? "image/*" : ".pdf"} uploadMode="useForm" />
                                    <span className="note" style={{ marginLeft: "9px" }}>
                                        {image.BackImage && <img src={image.BackImage} alt="Select Image" width={400} height={250} />}
                                    </span>
                                </div>

                            </div>
                        </div>
                        <div className="mt-4">
                            <Link to="">
                                Image Hints and Tips
                            </Link>
                        </div>
                        <Form
                            colCount={1}
                            showColonAfterLabel={false}
                            formData="customer"
                            readOnly={false}
                            showValidationSummary={true}
                            validationGroup="customerData"
                            labelLocation="top">
                            <GroupItem colCount={25}>
                                <ButtonItem
                                    horizontalAlignment="right"
                                    colSpan={22}
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

                    </div>
                </div>
            </div>
        </div>
    )
}

export default BeneficiaryTab;