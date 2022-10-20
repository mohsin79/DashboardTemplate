import { CheckBox, Form, RadioGroup, SelectBox } from "devextreme-react"
import { ButtonItem, GroupItem } from "devextreme-react/form"
import { RequiredRule, Validator } from "devextreme-react/validator"
import { NativeEventInfo } from "devextreme/events"
import dxCheckBox from "devextreme/ui/check_box"
import { ValueChangedInfo } from "devextreme/ui/editor/editor"
import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Control from "../../../components/control"
import TextBox from "../../../components/textBox"
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook"
import { ApiRequestAsync } from "../../../services/httpservice"
import { next, previous, setDisAndSig } from "../../../store/appreducer"
import { useStore } from "../../../store/store"
import { base64Encrypt, encryptFile, encryptFormData, handleImageArray } from "../../../util/common"
import ImageIframe from "../../../util/ImageIframe/ImageIframe"
import { toastError, toastSuccess } from "../../../util/toaster/Toaster"
import CanvasModal from "./CanvasModal"
import SignatureModal from "./SignatureModal"

const user_responce_no = ['Yes', 'No']
const simpleProducts = ["Select W9 Certification", "S-Corp", "C-Corp", "Individual"]
const initialFValues = {
    accountTermsandConditions: false,
    dayTradingRiskDisclosure: false,
    pennyStockDisclosure: false,
    electronicAccessTradingAgreement: false,
    marginDisclosureStatement: false,
    stockLocateAgreement: false,
    marginAgreement: false,
    LiquidationNotice: false,
    softwarePreference: false,
    experienceInSelectedSoftware: false,
    isW8OrW9Forms: "",
    taxStatus: "",
    experienceInSelectedSoftwareReason: "",
    electronicMailDeliveryAgreement: false,
    UserSignature: "",
    UserSignatureName: ""
}

let Softwarepreference = ({
    Guardian: [
        {
            name: 'softwarepreference',
            heading: 'Das Trader Guardian Trading:',
            subHeading: '',
            labels: [
                {
                    labelHeading: 'Level 1 Software Costs will be waived for accounts generating $199 or more in commissions per month.',
                    labelText: 'Das Level 1 ($60)- Top Level Best Bid and Best Offer with quote size for NMS Listed Stocks.  OTC and Options Level 1 offered at additional cost',
                    labelValue: 'Das Level 1 ($60)',

                },
                {
                    labelHeading: 'Level 2 Software costs plus up to $100 in Add On Feeds will be waived for accounts generating $599 or more in commissions per month.',
                    labelText: 'Das Level 2 ($150)- Regional Market Depth, Top Level Bids and Offers with Quoted Size for Major Listed Exchanges.  Includes NMS Listed level 1 data.  Does not include Options or Pink Sheet level 1.   Additional ECN Book Feeds, Pink Sheet (OTC)  Level 2, and Options Level 2 are offered at additional cost.',
                    labelValue: 'Das Level 2 ($150)'
                }
            ]
        },
        {
            name: 'softwarepreference',
            heading: 'Guardian Professional Trader:',
            subHeading: 'For accounts Classified as Professional by either DasTrader or Sterling. Level 2 Software costs plus up to $100 in Add On Feeds will be waived for accounts generating $899 or more in commissions per month.',
            labels: [
                {
                    labelHeading: '',
                    labelText: 'Das Level 2 ($200)- Regional Market Depth, Top Level Bids and Offers with Quoted Size for Major Listed Exchanges. Includes NMS Listed level 1 data.  Does not include Options or Pink Sheet level 1. Additional ECN Book Feeds, Pink Sheet (OTC)  Level 2, and Options Level 2 are offered at additional cost.',
                    labelValue: 'Das Level 2 ($200)'
                }
            ]
        },
        {
            name: 'softwarepreference',
            heading: 'Sterling Trader Guardian Trading:',
            subHeading: 'Level 2 Software costs plus up to $275 will be waived for accounts generating $799 or more in commissions per month. Add On Data Waiver Not available.',
            labels: [
                {
                    labelHeading: '',
                    labelText: 'Sterling Trader $(275)- All in package of Sterling Trader Pro including Nasdaq Total View.   NYSE/AMEX/ARCA, Nasdaq Level 1, Direct Edge A, Direct Edge X, Options and OTC data are additional cost.',
                    labelValue: 'Sterling Trader $(275)'
                }
            ]
        }

    ],
    Boustead: []
})



function Signature() {
    const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);
    const [showCanvasModal, setShowCanvasModal] = useState<boolean>(false);
    const [trimmedDataURL, setTrimmedDataURL] = useState<any>({})
    const [errorShow, setErrorShow] = useState<boolean>(false);
    const [softwarepreferencestate, setsoftwarePreferenceState] = useState<string>("");
    const [certificationType, setCertificationType] = useState<string>("");
    const [experienceInSelcetedSoftware, setExperienceInSelcetedSoftware] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [wCertification, setWCertification] = useState<boolean>(false);
    const [formData, setFormData] = useState({ ...initialFValues });
    const [trimmedApiSignature, setTrimmedApiSignature] = useState<any>({})
    const [accountModal, setAccountModal] = useState<boolean>(false);
    const [pennyDisclosureModal, setPennyDisclosureModal] = useState<boolean>(false);
    const [dayTradingModal, setDayTradingModal] = useState<boolean>(false);
    const [electronicsModal, setElectronicsModal] = useState<boolean>(false);
    const [marginDisclosureModal, setMarginDisclosureModal] = useState<boolean>(false);
    const [WdisclosureModal, setWdisclosureModal] = useState<boolean>(false);
    const [stockLocateAgreementModal, setStockLocateAgreementModal] = useState<boolean>(false);
    const [marginAgreementModal, setMarginAgreementModal] = useState<boolean>(false);
    const [liquidationNoticeModal, setLiquidationNoticeModal] = useState<boolean>(false);
    const dislosureAndSig = useAppSelector(e => e.appform.dislosureAndSig);

    let signatureDisclosure = ({
        Guardian: [
            {
                text: 'Account Terms & Conditions',
                name: "accountTermsandConditions",
                value: dislosureAndSig.accountTermsandConditions
            },
            {
                text: 'Day Trading Risk Disclosure',
                name: "dayTradingRiskDisclosure",
                value: dislosureAndSig.dayTradingRiskDisclosure
            },
            {
                text: 'Penny Stocks Disclosure',
                name: "pennyStockDisclosure",
                value: dislosureAndSig.pennyStockDisclosure
            },
            {
                text: 'Electronic Access & Trading Agreement',
                name: "electronicAccessTradingAgreement",
                value: dislosureAndSig.electronicAccessTradingAgreement
            },
            {
                text: 'Margin Disclosure Statement',
                name: "marginDisclosureStatement",
                value: dislosureAndSig.marginDisclosureStatement
            },
            {
                text: 'W-9 Certification',
                name: "wCertification",
                value: wCertification
            },
            {
                text: 'Stock Locate Agreement',
                name: "stockLocateAgreement",
                value: dislosureAndSig.stockLocateAgreement
            },
            {
                text: "Margin Agreement",
                name: "marginAgreement",
                value: dislosureAndSig.marginAgreement
            },
            {
                text: "Liquidation Notice",
                name: "LiquidationNotice",
                value: dislosureAndSig.LiquidationNotice
            }
        ],
        Boustead: []
    })


    const handleName = (e: any) => {
        try {
            // setFormData({
            //     ...formData,
            //     ["UserSignatureName"]: e
            // });
            dispatch(setDisAndSig({ ["UserSignatureName"]: e }))
        } catch (error) {
            console.log(error)
        }
    }
    const dispatch = useAppDispatch();


    const handleValidation = () => {
        try {
            if (dislosureAndSig && (!dislosureAndSig.accountTermsandConditions || !dislosureAndSig.dayTradingRiskDisclosure || !dislosureAndSig.pennyStockDisclosure || !dislosureAndSig.electronicAccessTradingAgreement || !dislosureAndSig.marginDisclosureStatement || !dislosureAndSig.LiquidationNotice)) {
                setErrorShow(true)
                return true
            } else if (dislosureAndSig && (!dislosureAndSig.softwarePreference || dislosureAndSig.experienceInSelectedSoftwareReason === "" || !dislosureAndSig.electronicMailDeliveryAgreement || trimmedDataURL === "")) {
                setErrorShow(false)
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleSubmit = async (e: any) => {
        let validationResponce = await handleValidation();
        const { isValid } = e.validationGroup.validate();
        if (isValid) {
            if (!validationResponce) {
                setLoading(true)
                ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=${type === "1" ? "11" : "9"}`, {
                    ...encryptFormData(dislosureAndSig),
                    UserSignature: await encryptFile(trimmedApiSignature),
                }).then(c => {
                    dispatch(next());
                    toastSuccess("Identification Proof added successfully");
                }).catch((error) => {
                    setLoading(false)
                    toastError(error?.message);
                })
            }
        }
        // NextStep()
        // setErrorShow(true)
    }
    /*  handle the form submission start */

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
        onClick: (e: any) => {
            handleSubmit(e)
        }
    }

    const { type } = useParams();


    useEffect(() => {
        if (dislosureAndSig && dislosureAndSig.accountTermsandConditions) {
            if (dislosureAndSig.experienceInSelectedSoftware) {
                setExperienceInSelcetedSoftware('Yes')
            } else {
                setExperienceInSelcetedSoftware('No')
            }
        }
    }, [])


    useEffect(() => {
        try {
            if (dislosureAndSig && typeof dislosureAndSig.UserSignature === "string") {
                handleImageArray(dislosureAndSig.UserSignature).then((blob) => {
                    // dispatch(setDisAndSig({ ["UserSignature"]: blob }))
                    let file = new File([blob], "file.png", { type: "image/png" })
                    setTrimmedApiSignature(file)
                    setTrimmedDataURL(URL.createObjectURL(file))
                })
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    // useEffect(() => {
    //     try {
    //         if (dislosureAndSig && typeof dislosureAndSig.UserSignature === "object" && dislosureAndSig.UserSignature !== null) {
    //             setTrimmedApiSignature([new File([dislosureAndSig.UserSignature], "front-image." + dislosureAndSig.UserSignature.type.substring(dislosureAndSig.UserSignature.type.lastIndexOf('/') + 1), { type:  dislosureAndSig.UserSignature.type })]);

    //             const reader = new window.FileReader();
    //             reader.readAsDataURL(dislosureAndSig.UserSignature);
    //             reader.onload = () => {
    //                 const imageDataUrl = reader.result;
    //                 setTrimmedApiSignature(imageDataUrl as string);
    //             }

    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }, [])



    const handleW9Certificate = (e: any) => {
        try {
            if (e === "Select W9 Certification") {
                setCertificationType(e)
                dispatch(setDisAndSig({ ["taxStatus"]: "" }))
            } else if (e === "S-Corp") {
                setCertificationType(e)
                dispatch(setDisAndSig({ ["taxStatus"]: "S-Corp" }))
            } else if (e === "C-Corp") {
                setCertificationType(e)
                dispatch(setDisAndSig({ ["taxStatus"]: "C-Corp" }))
            } else if (e === "Individual") {
                setCertificationType(e)
                dispatch(setDisAndSig({ ["taxStatus"]: "Individual" }))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChanges = (e: NativeEventInfo<any, Event> & ValueChangedInfo) => {
        //@ts-ignore
        dispatch(setDisAndSig({ [e.element.children[0].name]: e.value }))
    }

    const handlewCertification = (e: NativeEventInfo<any, Event> & ValueChangedInfo) => {
        setWCertification(e.value)
        if (e.value) {
            dispatch(setDisAndSig({ ["isW8OrW9Forms"]: "9" }))
        } else {
            dispatch(setDisAndSig({ ["isW8OrW9Forms"]: "8" }))
        }
    }

    const handlePleaseElaborate = (e: any) => {
        try {
            dispatch(setDisAndSig({ ["experienceInSelectedSoftwareReason"]: e }))
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangesRadio = (e: any, labelHeading?: string) => {
        dispatch(setDisAndSig({ ["softwarePreference"]: true }))
        if (labelHeading === 'Das Level 1 ($60)') {
            setsoftwarePreferenceState(e)
        } else if (labelHeading === 'Das Level 2 ($150)') {
            setsoftwarePreferenceState(e)
        } else if (labelHeading === 'Das Level 2 ($200)') {
            setsoftwarePreferenceState(e)
        } else if (labelHeading === 'Sterling Trader $(275)') {
            setsoftwarePreferenceState(e)
        } else if (e.element.children[0].name === "experienceInSelectedSoftware") {
            if (e.value === 'Yes') {
                dispatch(setDisAndSig({ ["experienceInSelectedSoftware"]: true }))
                setExperienceInSelcetedSoftware('Yes')
            } else {
                dispatch(setDisAndSig({ ["experienceInSelectedSoftware"]: false }))
                setExperienceInSelcetedSoftware('No')
            }
        }
    }

    const handleImageFrame = (linkName: any) => {
        try {

            if (linkName === "accountTermsandConditions") {
                setAccountModal(true)
            } else if (linkName === "pennyStockDisclosure") {
                setPennyDisclosureModal(true)
            } else if (linkName === "dayTradingRiskDisclosure") {
                setDayTradingModal(true)
            } else if (linkName === "electronicAccessTradingAgreement") {
                setElectronicsModal(true)
            } else if (linkName === "marginDisclosureStatement") {
                setMarginDisclosureModal(true)
            } else if (linkName === "wCertification") {
                setWdisclosureModal(true)
            } else if (linkName === "stockLocateAgreement") {
                setStockLocateAgreementModal(true)
            } else if (linkName === "marginAgreement") {
                setMarginAgreementModal(true)
            } else if (linkName === "LiquidationNotice") {
                setLiquidationNoticeModal(true)
            }


            document.body.style.overflow = "hidden";
        } catch (error) {
            console.log(error)
        }
    }

    /*  handle previous button function End */

    return (
        <div className="my-4">
            <div className="row">
                {accountModal && <ImageIframe Imageurl='http://localhost:3000/assets/pdf/AccountTermsConditions.pdf' ImageFrameFlag={accountModal} setImageFrameFlag={setAccountModal} />}
                {pennyDisclosureModal && <ImageIframe Imageurl='http://localhost:3000/assets/pdf/PennyStockRiskDisclosure.pdf' ImageFrameFlag={pennyDisclosureModal} setImageFrameFlag={setPennyDisclosureModal} />}
                {dayTradingModal && <ImageIframe Imageurl='http://localhost:3000/assets/pdf/DayTradingRiskDisclosure.pdf' ImageFrameFlag={dayTradingModal} setImageFrameFlag={setDayTradingModal} />}
                {electronicsModal && <ImageIframe Imageurl='http://localhost:3000/assets/pdf/ElectronicAccessTradingAgreement.pdf' ImageFrameFlag={electronicsModal} setImageFrameFlag={setElectronicsModal} />}
                {marginDisclosureModal && <ImageIframe Imageurl='http://localhost:3000/assets/pdf/MarginDisclosureStatement.pdf' ImageFrameFlag={marginDisclosureModal} setImageFrameFlag={setMarginDisclosureModal} />}
                {WdisclosureModal && <ImageIframe Imageurl='http://localhost:3000/assets/pdf/W9Certification.pdf' ImageFrameFlag={WdisclosureModal} setImageFrameFlag={setWdisclosureModal} />}
                {stockLocateAgreementModal && <ImageIframe Imageurl='http://localhost:3000/assets/pdf/Stockslocateagreement.pdf' ImageFrameFlag={stockLocateAgreementModal} setImageFrameFlag={setStockLocateAgreementModal} />}
                {marginAgreementModal && <ImageIframe Imageurl='http://localhost:3000/assets/pdf/MarginAgreement.pdf' ImageFrameFlag={marginAgreementModal} setImageFrameFlag={setMarginAgreementModal} />}
                {liquidationNoticeModal && <ImageIframe Imageurl='http://localhost:3000/assets/pdf/AutoLiquidationNotice.pdf' ImageFrameFlag={liquidationNoticeModal} setImageFrameFlag={setLiquidationNoticeModal} />}
                <div className="col-md-1"></div>
                <div className="col-md-10 signUpBoxShadow">
                    <SignatureModal open={showSignatureModal} setOpen={setShowSignatureModal} setShowCanvasModal={setShowCanvasModal} />
                    <CanvasModal DataURL={setTrimmedDataURL} DataSignatureURL={setTrimmedApiSignature} open={showCanvasModal} setOpen={setShowCanvasModal} />
                    <div className="long-title"> <h3 className="fs-title">Disclosures & Signatures</h3> </div>
                    <div className="maincontent">
                        <div className="utility-coonections">
                            <div className="row clientagreerow" style={{ marginTop: "20px" }}>
                                <div className="col-md-12 text-left pdfagreement">
                                    {errorShow && <p className="text-danger">Required !</p>}
                                    <div id="disclosureErrors" className="mb-3"></div>
                                    <p> Please select the disclosures below and the check the box noting you
                                        have read and
                                        understood these disclosures.</p>
                                    {
                                        signatureDisclosure.Guardian.map((signature, index) => {
                                            return (
                                                <div className="row">
                                                    {
                                                        signature.text === 'W-9 Certification' ?
                                                            type === "1" ? <>
                                                                <div className="col-md-5">
                                                                    <label className="labelholder" style={{ paddingLeft: "0px" }}>
                                                                        {signature.text} <span className="text-danger"> *</span>
                                                                    </label>
                                                                </div>
                                                                <div className="col-md-1 viewholder-txt">
                                                                    <Link to={""} onClick={() => handleImageFrame(signature.name)}>
                                                                        View
                                                                    </Link>
                                                                </div>
                                                                <div className="col-md-1">
                                                                    <CheckBox
                                                                        // name={signature.name}
                                                                        value={wCertification}
                                                                        onValueChanged={(e) => handlewCertification(e)}
                                                                        validationStatus={(signature.value || !errorShow) ? "valid" : "invalid"}
                                                                        text=""
                                                                    />
                                                                </div>
                                                                <div className="col-md-4 viewholder-txt">
                                                                    <p>I provide my consent </p>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-9">
                                                                        <div className="d-flex justify-content-end mb-2">
                                                                            <SelectBox style={{ width: "250px" }} name={"W9-certificate"} items={simpleProducts} placeholder={""} onValueChange={handleW9Certificate} />
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </> :
                                                                <>
                                                                    {/* <div className="col-md-5">
                                                                        <label className="labelholder" style={{ paddingLeft: "0px" }}>
                                                                            {signature.text} <span className="text-danger"> *</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="col-md-1 viewholder-txt">
                                                                        <Link to={""}>
                                                                            View
                                                                        </Link>
                                                                    </div>
                                                                    <div className="col-md-1">
                                                                        <CheckBox
                                                                            name={signature.name}
                                                                            value={signature.value}
                                                                            onValueChanged={(e) => handleChanges(e)}
                                                                            text=""
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-4 viewholder-txt">
                                                                        <p>I provide my consent </p>
                                                                    </div> */}
                                                                </>
                                                            : <>
                                                                <div className="col-md-5">
                                                                    <label className="labelholder" style={{ paddingLeft: "0px" }}>
                                                                        {signature.text} <span className="text-danger"> *</span>
                                                                    </label>
                                                                </div>
                                                                <div className="col-md-1 viewholder-txt">
                                                                    <Link to={""} onClick={() => handleImageFrame(signature.name)}>
                                                                        View
                                                                    </Link>
                                                                </div>
                                                                <div className="col-md-1">
                                                                    <CheckBox
                                                                        name={signature.name}
                                                                        value={signature.value}
                                                                        onValueChanged={(e) => handleChanges(e)}
                                                                        validationStatus={(signature.value || !errorShow) ? "valid" : "invalid"}
                                                                        text=""
                                                                    />
                                                                </div>
                                                                <div className="col-md-4 viewholder-txt">
                                                                    <p>I provide my consent </p>
                                                                </div>
                                                            </>
                                                    }

                                                </div>
                                            )
                                        })
                                    }
                                </div>


                                <div className="row">

                                    <div className="col-lg-12">
                                        <div className="softwarepreference-error"></div>
                                        <div style={{ borderBottom: "1px solid #e5e5e5", paddingTop: "20px" }} />

                                        {errorShow && <p className="text-danger">Please select atleast one option.</p>}
                                        <div className="long-title mt-2"> <h3 className="fs-title">SOFTWARE PREFERENCE</h3> </div>
                                        <p className="mt-3">What Software would you like to use:</p>
                                    </div>
                                    <br />
                                    {
                                        Softwarepreference.Guardian.map((GuardianRecord) => {
                                            return (
                                                <>
                                                    <div className="row" key={GuardianRecord.heading}>
                                                        <div className="col-md-12 text-left">
                                                            <p className="mt-3">
                                                                <strong> {GuardianRecord.heading} </strong>
                                                                {
                                                                    GuardianRecord.heading === "Guardian Professional Trader:" && GuardianRecord.subHeading
                                                                }
                                                                {
                                                                    GuardianRecord.heading === "Sterling Trader Guardian Trading:" && GuardianRecord.subHeading
                                                                }
                                                            </p>
                                                        </div>
                                                        {
                                                            GuardianRecord.labels.map((GuardianRecordData, index) => {
                                                                return (
                                                                    <div className="row" key={GuardianRecordData.labelHeading + index}>
                                                                        <div className="col-md-12 text-left">
                                                                            <p className="mt-3">
                                                                                {GuardianRecordData.labelHeading}
                                                                            </p>
                                                                        </div>
                                                                        <div className="col-md-12 text-left ynoption">
                                                                            <RadioGroup value={softwarepreferencestate} name={GuardianRecordData.labelValue} items={[GuardianRecordData.labelText]} onValueChange={(e) => handleChangesRadio(e, GuardianRecordData.labelValue)} />
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </div>
                                <div className="row">
                                    <div className="col-md-12 text-left">
                                        <br />
                                        <div className="experienceSoftware-error"></div>
                                        {errorShow && <p className="text-danger">This field is required.</p>}
                                        <p>Do you have experience in your selected software?<span
                                            className="text-danger">
                                            *</span>
                                        </p>
                                    </div>
                                    <div className="col-md-12 text-left ynoption">
                                        <RadioGroup value={experienceInSelcetedSoftware} name={"experienceInSelectedSoftware"} items={user_responce_no} onValueChanged={(e) => handleChangesRadio(e)} layout="horizontal" />
                                    </div>
                                    <br></br>
                                </div>
                                <div className="col-sm-4 text-left ynoption mt-4 mb-4">
                                    <label >Please elaborate<span className="text-danger"> *</span></label>
                                    <TextBox value={dislosureAndSig.experienceInSelectedSoftwareReason} placeholder="" validationStatus={(dislosureAndSig && dislosureAndSig.experienceInSelectedSoftwareReason === "") && errorShow ? "invalid" : "valid"} onValueChange={handlePleaseElaborate} />
                                    {(dislosureAndSig && dislosureAndSig.experienceInSelectedSoftwareReason === "") && errorShow && <span className="my-2" style={{ color: "red" }}>This Field is Required </span>}
                                </div>
                                <div style={{ borderBottom: "1px solid #e5e5e5", paddingTop: "20px" }} />
                                <div className="row mt-2">
                                    <div className="col-md-12 text-left">
                                        <p>Consent for mail delivery of statements and confirms otherwise they will be delivered electronically</p>
                                        <p><strong>Additional charges will apply if you do NOT check the below box for electronic delivery of statements, confirmations and tax documents</strong></p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-md-auto mt-2'>
                                        <CheckBox
                                            name={"electronicMailDeliveryAgreement"}
                                            value={dislosureAndSig && dislosureAndSig.electronicMailDeliveryAgreement}
                                            onValueChanged={(e) => handleChanges(e)}
                                            validationStatus={((dislosureAndSig && dislosureAndSig.electronicMailDeliveryAgreement) || !errorShow) ? "valid" : "invalid"}
                                            text=""
                                        />
                                    </div>
                                    <div className='col-md-11'>
                                        <p>
                                            Please check this box if you wish only to receive communications
                                            electronically,
                                            including trade confirmations, prospectuses, account statements,
                                            proxy
                                            materials, tax‐related documents, and marketing and sales documents.
                                            If you do
                                            not check this box, all such Communications will be delivered to you
                                            by standard
                                            mail.
                                        </p>
                                    </div>
                                </div>
                                <div style={{ borderBottom: "1px solid black", paddingTop: "20px" }} />
                                <br />
                                {
                                    type !== "2" && <>
                                        <div className="mt-4">
                                            <div className="pagebreak"></div>
                                            <p className="f11">By signing below, I/We attest to the accuracy of the information provided on this form. I/We acknowledge
                                                that we have received, read and agree to the terms and conditions contained in the attached Account
                                                Agreement, including the arbitration clause.
                                                By executing this agreement, I/We agree to be bound by the terms and conditions contained here in.</p>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="signature-error"></div>
                                                {errorShow && trimmedDataURL === null && <p className="text-danger">Signature is required</p>}
                                                <h6> ACCOUNT OWNER:<small style={{ marginLeft: "8px" }}>Signature</small> </h6>
                                                <p>
                                                    <Control.Button className='btn btn-default bg-primary text-white button-width' text='Signature' onClick={() => setShowSignatureModal(true)} />
                                                </p>
                                                <br />
                                                <div className="signatureName">
                                                    {
                                                        trimmedDataURL !== null && !showCanvasModal &&
                                                        <img src={trimmedDataURL} style={{ width: 150, height: 150 }} />

                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-12 mt-4">
                                                <p>By entering your full name, you are signing this Agreement electronically. You agree your electronic signature is the legal
                                                    equivalent of your manual/handwritten signature on this Agreement. By entering your name using any device, means or
                                                    action, you consent to the legally binding terms and conditions of this Agreement. You further agree that your signature on
                                                    this document (hereafter referred to as your "E-Signature") is as valid as if you signed the document in writing. You also agree
                                                    that no certification authority or other third-party verification is necessary to validate your E-Signature, and that the lack of
                                                    such certification or third-party verification will not in any way affect the enforceability of your E-Signature or any resulting
                                                    agreement between you and Velocity Clearing LLC or any of it's subsidiaries, affiliates or partners.</p>
                                            </div>
                                            <div className="col-md-4">
                                                <TextBox value={dislosureAndSig.UserSignatureName} placeholder="Your Name" validationStatus={(dislosureAndSig && dislosureAndSig.UserSignatureName === "") && errorShow ? "invalid" : "valid"} onValueChange={handleName} />
                                                {((dislosureAndSig && dislosureAndSig.UserSignatureName === "") && errorShow) && <span className="my-2" style={{ color: "red" }}> Name is Required </span>}
                                            </div>
                                        </div>
                                    </>
                                }

                            </div>
                        </div>
                    </div>
                    <Form
                        colCount={1}
                        showColonAfterLabel={false}
                        readOnly={false}
                        showValidationSummary={true}
                        validationGroup="customerData"
                        labelLocation="top">
                        <GroupItem colCount={22}>
                            <ButtonItem
                                horizontalAlignment="right"
                                colSpan={19}
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
                <div className="col-md-1"></div>
            </div>




            {/* <div className='d-flex justify-content-end mt-4 ml-4'>
                    <Control.Button className='btn btn-default bg-primary text-white button-width' text='Previous' onClick={handlePreviousButton} />
                    <Control.Button className='btn btn-default bg-primary text-white button-width' text='Next' onClick={handleSubmit} />
                </div> */}
        </div>
    )
}

export default Signature




