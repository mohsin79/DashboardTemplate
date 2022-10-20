import { FileUploader, Form, NumberBox, RadioGroup, } from "devextreme-react";
import { ButtonItem, GroupItem, Label, SimpleItem } from "devextreme-react/form";
import {
    Validator,
    RequiredRule,
    CompareRule,
    EmailRule,
    PatternRule,
    StringLengthRule,
    RangeRule,
    AsyncRule,
} from 'devextreme-react/validator';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Control from "../../components/control";
import Loader from "../../components/Loader/Loader";
import TextBox from "../../components/textBox";
import { ApiRequestAsync } from "../../services/httpservice";
import { useStore } from "../../store/store";
import { encryptFile, encryptFormData, handleImageArray } from "../../util/common";
import { toastError, toastSuccess } from "../../util/toaster/Toaster";
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { next, previous, setDisclosure } from "../../store/appreducer";
const user_responce = ['Yes', 'No, (I disagree)']
const fileExtensions = ['.jpeg', '.jpg', '.png'];
const user_responce_no = ['Yes', 'No']
const INITIAL_FORMDATA = {
    abilityToBorrowFunds: false,
    guardianAddendumAgreement: false,
    availableInvestmentCapital: false,
    involveHighRisk: false,
    objectivesWithAccount: "",
    abilitytoWithstandLosingInvestment: true,
    abilitytoWithstandLosingInvestmentReason: "",
    initialDeposit: "",
    haveOtherBrokerageAccounts: false,
    numberOfBrokerageAccounts: "",
    haveOtherVelocityAccounts: false,
    haveOtherVelocityAccountsNumber: "",
    haveOtherVelocityAccountsName: "",
    knowAnyVelocityAccountHolder: false,
    knowAnyVelocityAccountHolderNumber: "",
    knowAnyVelocityAccountHolderName: "",
    knowAnyVelocityAccountHolderRelationship: "",
    shareholderInPubliclyTradedCompany: false,
    shareholderInPubliclyTradedCompanyName: "",
    shareholderInPubliclyTradedCompanyAddress: "",
    shareholderInPubliclyTradedCompanyRelationship: "",
    registeredBrokerDealerSecuritiesExchangeOrFINRA: false,
    registeredBrokerDealerSecuritiesExchangeOrFINRAName: "",
    registeredBrokerDealerSecuritiesExchangeOrFINRAAddress: "",
    registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile: null,
    seniorOfficerAtFinancialInstitution: false,
    seniorOfficerAtFinancialInstitutionName: "",
    seniorOfficerAtFinancialInstitutionAddress: "",
    seniorOfficerAtFinancialInstitutionPosition: "",
    knowAnyPublicOrPoliticalFigure: false,
    knowAnyPublicOrPoliticalFigureName: "",
    knowAnyPublicOrPoliticalFigurePosition: "",
    knowAnyPublicOrPoliticalFigureRelationship: "",
    TaxWithholdingCertifications: "USP",
    IsSubjectToBackupWitholding: true,
}

const INITIAL_ERROR_STATE = {
    haveOtherBrokerageAccounts: false,
    haveOtherVelocityAccounts: false,
    knowAnyVelocityAccountHolder: false,
    shareholderInPubliclyTradedCompany: false,
    registeredBrokerDealerSecuritiesExchangeOrFINRA: false,
    seniorOfficerAtFinancialInstitution: false,
    knowAnyPublicOrPoliticalFigure: false,
    guardianAddendumAgreement: false,
    availableInvestmentCapital: false,
    involveHighRisk: false,
    abilitytoWithstandLosingInvestment: false,
}

const INITIAL_BOOLEAN_DATA = {
    abilityToBorrowFunds: "No, (I disagree)",
    haveOtherBrokerageAccounts: "",
    haveOtherVelocityAccounts: "",
    knowAnyVelocityAccountHolder: "",
    shareholderInPubliclyTradedCompany: "",
    registeredBrokerDealerSecuritiesExchangeOrFINRA: "",
    seniorOfficerAtFinancialInstitution: "",
    knowAnyPublicOrPoliticalFigure: "",
    guardianAddendumAgreement: "",
    availableInvestmentCapital: "",
    involveHighRisk: "",
    abilitytoWithstandLosingInvestment: ""
}



let certificationData = ({
    Guardian: [
        {
            label: ['Certification Instruction:'],
            text: 'I cannot certify that I am not subject to backup withholding, meaning that I have been notified by the IRS that I am currently subject to backup withholding because I have failed to report all interest and dividends on my tax return.',
        },
        {
            label: ['Non Resident Alien:'],
            text: 'I certify that I am not a U.S. resident alien or other U.S. person for U.S. tax purpose and I am submitting the applicable Form W-8 with this application to certify my foreign status and if applicable, claim tax treaty benefits.',

        },
    ],
    Boustead: []
})

let support_User = ({
    Guardian: [
        {
            label: ["U.S. Person: under penalty of perjury, I certify that:"],
            label_radio: ["1. I am a U.S citizen or a U.S. Resident Alien or other U.S. Person and the Social Security Number or Taxpayer identification Number provided in this application is correct", "2. I am not subject to backup Withholding because"],
            label_subject_to: ["a. I am exempt from backup withholding or", "b. I have not been notified by the internal Revenue Services (IRS) that I am subject to backup withholding as a result of failure to report all interest or dividends or", "c.  the IRS has notified me that I am no longer subject to backup withholding."],
            label_certification: ["Certification Instruction: I cannot certify that I am not subject to backup up withholding, meaning that I have been notified by the IRS that I am currently subject to backup withholding because I have failed to report all interest and dividends on my tax return.", "Non Residence Alien: I certify that I am not a U.S resident alien or other U.S. person for U.S. tax purpose and I am submitting the applicable Form W-8 with this Application to certify my foreign status and if applicable, claim tax treaty benefits."]
        },
    ],
    Boustead: []
})

function Disclosure() {
    const [formData, setFormData] = useState({ ...INITIAL_FORMDATA });
    const [formDataBoolean, setFormDataBoolean] = useState<any | null>({ ...INITIAL_BOOLEAN_DATA });
    const [formDataValidation, setFormDataValidation] = useState<any | null>({ ...INITIAL_ERROR_STATE });
    const [taxWithHolding, setTaxWithHolding] = useState("U.S. Person: under penalty of perjury, I certify that:");
    const [taxWithHoldingUS, setTaxWithHoldingUS] = useState("1. I am a U.S citizen or a U.S. Resident Alien or other U.S. Person and the Social Security Number or Taxpayer identification Number provided in this application is correct");
    const [subjectToBackupWitholding, setSubjectToBackupWitholding] = useState<string>("");
    const [requiredErrorFlagOnAbilityToBorrowFunds, setRequiredErrorFlagOnAbilityToBorrowFunds] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorValidation, setErrorValidation] = useState<boolean>(false);
    const [errorShow, setErrorShow] = useState<Array<string>>([])
    const disclosure = useAppSelector(e => e.appform.disclosure);
    const [registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImageViewer, setRegisteredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImageViewer] = useState<any>("")
    const [registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImage, setRegisteredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImage] = useState<File[] | undefined>([]);

    const investQuestion = ({
        Guardian: [
            {
                name: 'Radio',
                text: 'I want the ability to borrow funds in my account and would like to open a margin account.'
                    + 'I have read the client agreement and disclosures understand my right and' +
                    'obligation under it',
                field: 'abilityToBorrowFunds',
                value: formDataBoolean.abilityToBorrowFunds,
                responce: user_responce,
                default_value: user_responce[0],
                validation: requiredErrorFlagOnAbilityToBorrowFunds
            },
            {
                name: 'Number',
                text1: 'Pattern day trading accounts are only offered to an account that maintains balance greater than $30,000.',
                text2: 'Guardian requires an initial deposit of at least $30,000.',
                text3: 'Please state your approximate initial deposit.',
                default_value: user_responce[0],
                max_length: 999999999999
            },
            {
                name: 'Radio',
                text: 'Do you maintain any other Brokerage accounts?',
                responce: user_responce_no,
                field: 'haveOtherBrokerageAccounts',
                value: formDataBoolean.haveOtherBrokerageAccounts,
                haveAdditionalField: "Yes",
                validation: formDataValidation.haveOtherBrokerageAccounts,
                additionalField: [
                    {
                        inputText: "Number Of Accounts (total)",
                        inputValue: disclosure.numberOfBrokerageAccounts,
                        field: "numberOfBrokerageAccounts",
                        RequiredRuleText: "Number Of Accounts is required",
                        type: "text",
                        max_length: 20
                    }
                ]
            },
            {
                name: 'Radio',
                text: 'Do you currently maintain an account at Velocity Clearing LLC in which you have control, beneficial interest, or trading authority?',
                responce: user_responce_no,
                field: 'haveOtherVelocityAccounts',
                value: formDataBoolean.haveOtherVelocityAccounts,
                haveAdditionalField: "Yes",
                validation: formDataValidation.haveOtherVelocityAccounts,
                additionalField: [
                    {
                        inputText: "Account Number",
                        inputValue: disclosure.haveOtherVelocityAccountsNumber,
                        field: "haveOtherVelocityAccountsNumber",
                        RequiredRuleText: "Account Number is required",
                        type: "text",
                        max_length: 20
                    },
                    {
                        inputText: "Account Name",
                        inputValue: disclosure.haveOtherVelocityAccountsName,
                        field: "haveOtherVelocityAccountsName",
                        RequiredRuleText: "Account name is required",
                        type: "text",
                        max_length: 50
                    }
                ]

            },
            {
                name: 'Radio',
                text: 'Do you have a relationship with an entity that currently maintains an account at Velocity Clearing LLC, such as employee, officer, shareholder, member, partner or owner?',
                responce: user_responce_no,
                field: 'knowAnyVelocityAccountHolder',
                value: formDataBoolean.knowAnyVelocityAccountHolder,
                haveAdditionalField: "Yes",
                validation: formDataValidation.knowAnyVelocityAccountHolder,
                additionalField: [
                    {
                        inputText: "Account Number",
                        inputValue: disclosure.knowAnyVelocityAccountHolderNumber,
                        field: "knowAnyVelocityAccountHolderNumber",
                        RequiredRuleText: "Account Number is required",
                        type: "text",
                        max_length: 50
                    },
                    {
                        inputText: "Account Name",
                        inputValue: disclosure.knowAnyVelocityAccountHolderName,
                        field: "knowAnyVelocityAccountHolderName",
                        RequiredRuleText: "Account name is required",
                        type: "text",
                        max_length: 50
                    },
                    {
                        inputText: "Relationship",
                        inputValue: disclosure.knowAnyVelocityAccountHolderRelationship,
                        field: "knowAnyVelocityAccountHolderRelationship",
                        RequiredRuleText: "Relationship is required",
                        type: "text",
                        max_length: 50
                    }
                ]
            },
            {
                name: 'Radio',
                text: 'Are either you or an immediate family member an officer, director or at least a 10% shareholder in a publicly traded company?',
                responce: user_responce_no,
                field: 'shareholderInPubliclyTradedCompany',
                value: formDataBoolean.shareholderInPubliclyTradedCompany,
                haveAdditionalField: "Yes",
                validation: formDataValidation.shareholderInPubliclyTradedCompany,
                additionalField: [
                    {
                        inputText: "Company Name",
                        inputValue: disclosure.shareholderInPubliclyTradedCompanyName,
                        field: "shareholderInPubliclyTradedCompanyName",
                        RequiredRuleText: "Company Name is required",
                        type: "text",
                        max_length: 50
                    },
                    {
                        inputText: "Company Address",
                        inputValue: disclosure.shareholderInPubliclyTradedCompanyAddress,
                        field: "shareholderInPubliclyTradedCompanyAddress",
                        RequiredRuleText: "Company Address is required",
                        type: "text",
                        max_length: 100
                    },
                    {
                        inputText: "Relationship with entity",
                        inputValue: disclosure.shareholderInPubliclyTradedCompanyRelationship,
                        field: "shareholderInPubliclyTradedCompanyRelationship",
                        RequiredRuleText: "Relationship with entity is required",
                        type: "text",
                        max_length: 22
                    }
                ]

            },
            {
                name: 'Radio',
                text: 'Are either you or an immediate family member employed by FINRA, a registered broker dealer or a securities exchange?',
                responce: user_responce_no,
                field: 'registeredBrokerDealerSecuritiesExchangeOrFINRA',
                value: formDataBoolean.registeredBrokerDealerSecuritiesExchangeOrFINRA,
                haveAdditionalField: "Yes",
                validation: formDataValidation.registeredBrokerDealerSecuritiesExchangeOrFINRA,
                additionalField: [
                    {
                        inputText: "Name of the Firm Or Exchange",
                        inputValue: disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAName,
                        field: "registeredBrokerDealerSecuritiesExchangeOrFINRAName",
                        RequiredRuleText: "Company Name is required",
                        type: "text",
                        max_length: 50
                    },
                    {
                        inputText: "Firm Address",
                        inputValue: disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAAddress,
                        field: "registeredBrokerDealerSecuritiesExchangeOrFINRAAddress",
                        RequiredRuleText: "Company Address is required",
                        type: "text",
                        max_length: 100
                    },
                    {
                        inputText: "Permission to open the account",
                        type: "file",
                        inputValue: disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile,
                        field: "registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile",
                        RequiredRuleText: "Relationship with entity is required",
                    }
                ]
            },
            {
                name: 'Radio',
                text: 'Are you a senior officer at a bank, savings and loan institution, investment company, investment advisory firm, or other financial institution?',
                responce: user_responce_no,
                field: 'seniorOfficerAtFinancialInstitution',
                value: formDataBoolean.seniorOfficerAtFinancialInstitution,
                haveAdditionalField: "Yes",
                validation: formDataValidation.seniorOfficerAtFinancialInstitution,
                additionalField: [
                    {
                        inputText: "Name of the Firm",
                        inputValue: disclosure.seniorOfficerAtFinancialInstitutionName,
                        field: "seniorOfficerAtFinancialInstitutionName",
                        RequiredRuleText: "Firm is required",
                        type: "text",
                        max_length: 50
                    },
                    {
                        inputText: "Firm Address",
                        inputValue: disclosure.seniorOfficerAtFinancialInstitutionAddress,
                        field: "seniorOfficerAtFinancialInstitutionAddress",
                        RequiredRuleText: "Firm Address is required",
                        type: "text",
                        max_length: 100
                    },
                    {
                        inputText: "Position in Firm",
                        inputValue: disclosure.seniorOfficerAtFinancialInstitutionPosition,
                        field: "seniorOfficerAtFinancialInstitutionPosition",
                        RequiredRuleText: "Position in Firm is required",
                        type: "text",
                        max_length: 50
                    }
                ]
            },
            {
                name: 'Radio',
                text: 'Are any principals or authorized individuals a senior political figure, a family member, or relative of a senior political figure?',
                responce: user_responce_no,
                field: 'knowAnyPublicOrPoliticalFigure',
                value: formDataBoolean.knowAnyPublicOrPoliticalFigure,
                haveAdditionalField: "Yes",
                validation: formDataValidation.knowAnyPublicOrPoliticalFigure,
                additionalField: [
                    {
                        inputText: "Name of the political figure",
                        inputValue: disclosure.knowAnyPublicOrPoliticalFigureName,
                        field: "knowAnyPublicOrPoliticalFigureName",
                        RequiredRuleText: "Firm is required",
                        type: "text",
                        max_length: 50
                    },
                    {
                        inputText: "Position of the political figure",
                        inputValue: disclosure.knowAnyPublicOrPoliticalFigurePosition,
                        field: "knowAnyPublicOrPoliticalFigurePosition",
                        RequiredRuleText: "Firm Address is required",
                        type: "text",
                        max_length: 100
                    },
                    {
                        inputText: "Relationship with the political figure",
                        inputValue: disclosure.knowAnyPublicOrPoliticalFigureRelationship,
                        field: "knowAnyPublicOrPoliticalFigureRelationship",
                        RequiredRuleText: "Position in Firm is required",
                        type: "text",
                        max_length: 50
                    }
                ]
            },

            //I want the ability to borrow fund .. last 4  yes no MISSING in the backend modal
            {
                name: 'Radio',
                text: 'Have you read, viewed, and agree to the “Guardian Addendum to Customer Agreement Net Trading” form ?',
                responce: user_responce,
                field: 'guardianAddendumAgreement',
                value: formDataBoolean.guardianAddendumAgreement,
                validation: formDataValidation.guardianAddendumAgreement,
                default_value: user_responce[0]
            },
            {
                name: 'Radio',
                text: 'If you are opening a daytrading account with Guardian Trading, do you have $25,000 in available investment capital?',
                responce: user_responce_no,
                field: 'availableInvestmentCapital',
                value: formDataBoolean.availableInvestmentCapital,
                validation: formDataValidation.availableInvestmentCapital,
                default_value: user_responce_no[0]
            },
            {
                name: 'Radio',
                text: 'Does your sole objective with this account involve high risk?',
                responce: user_responce_no,
                field: 'involveHighRisk',
                value: formDataBoolean.involveHighRisk,
                default_value: user_responce_no[0],
                validation: formDataValidation.involveHighRisk,
                haveAdditionalField: "Yes",
                additionalField: [
                    {
                        inputText: "If not high risk, what your objectives with this account?",
                        inputValue: disclosure.objectivesWithAccount,
                        field: "objectivesWithAccount",
                        RequiredRuleText: "Field is required",
                        type: "text",
                        max_length: 100
                    },
                ]
            },
            {
                name: 'Radio',
                text: 'Are you able to withstand losing more or all of your investment in your Guardian Trading account?',
                responce: user_responce_no,
                field: 'abilitytoWithstandLosingInvestment',
                value: formDataBoolean.abilitytoWithstandLosingInvestment,
                validation: formDataValidation.abilitytoWithstandLosingInvestment,
                default_value: user_responce_no[0],
                haveAdditionalField: "Yes",
                additionalField: [
                    {
                        inputText: "If no, please elaborate",
                        inputValue: disclosure.abilitytoWithstandLosingInvestmentReason,
                        field: "abilitytoWithstandLosingInvestmentReason",
                        RequiredRuleText: "This Field is required",
                        type: "text",
                        max_length: 100
                    },
                ]
            },
        ],
        Boustead: []
    })

    const dispatch = useAppDispatch();

    /*  handle previous button function End */

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

    const handleInitialDeposit = (e: any) => {
        // setFormData({
        //     ...formData,
        //     ["initialDeposit"]: e.toString()
        // })
        dispatch(setDisclosure({ ["initialDeposit"]: e.toString() }))
    }

    const handleRadioChange = (field: string, e: any) => {
        if (errorValidation) {
            handleValidation()
        }
        dispatch(setDisclosure({ [field]: e.toString() }))

        // setFormData({
        //     ...formData,
        //     [field]: e
        // })
    }

    const SettingInitialFormStructureOnYes = (fieldName: string) => {
        try {
            if (fieldName === "involveHighRisk") {
                dispatch(setDisclosure({ ["objectivesWithAccount"]: "" }))
            } else if (fieldName === "abilitytoWithstandLosingInvestment") {
                dispatch(setDisclosure({ ["abilitytoWithstandLosingInvestmentReason"]: "" }))
            } else if (fieldName === "knowAnyPublicOrPoliticalFigure") {
                dispatch(setDisclosure({ ["knowAnyPublicOrPoliticalFigureName"]: "" }))
                dispatch(setDisclosure({ ["knowAnyPublicOrPoliticalFigurePosition"]: "" }))
                dispatch(setDisclosure({ ["knowAnyPublicOrPoliticalFigureRelationship"]: "" }))
            } else if (fieldName === "seniorOfficerAtFinancialInstitution") {
                dispatch(setDisclosure({ ["seniorOfficerAtFinancialInstitutionName"]: "" }))
                dispatch(setDisclosure({ ["seniorOfficerAtFinancialInstitutionAddress"]: "" }))
                dispatch(setDisclosure({ ["seniorOfficerAtFinancialInstitutionPosition"]: "" }))
            } else if (fieldName === "registeredBrokerDealerSecuritiesExchangeOrFINRA") {
                dispatch(setDisclosure({ ["registeredBrokerDealerSecuritiesExchangeOrFINRAName"]: "" }))
                dispatch(setDisclosure({ ["registeredBrokerDealerSecuritiesExchangeOrFINRAAddress"]: "" }))
                dispatch(setDisclosure({ ["registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile"]: null }))
            } else if (fieldName === "shareholderInPubliclyTradedCompany") {
                dispatch(setDisclosure({ ["shareholderInPubliclyTradedCompanyName"]: "" }))
                dispatch(setDisclosure({ ["shareholderInPubliclyTradedCompanyAddress"]: "" }))
                dispatch(setDisclosure({ ["shareholderInPubliclyTradedCompanyRelationship"]: "" }))
            } else if (fieldName === "knowAnyVelocityAccountHolder") {
                dispatch(setDisclosure({ ["knowAnyVelocityAccountHolderName"]: "" }))
                dispatch(setDisclosure({ ["knowAnyVelocityAccountHolderNumber"]: "" }))
                dispatch(setDisclosure({ ["knowAnyVelocityAccountHolderRelationship"]: "" }))
            } else if (fieldName === "haveOtherVelocityAccounts") {
                dispatch(setDisclosure({ ["haveOtherVelocityAccountsName"]: "" }))
                dispatch(setDisclosure({ ["haveOtherVelocityAccountsNumber"]: "" }))
            } else if (fieldName === "haveOtherBrokerageAccounts") {
                dispatch(setDisclosure({ ["numberOfBrokerageAccounts"]: "" }))
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (disclosure && disclosure.abilityToBorrowFunds) {
            let DISCLOSURE_DATA = {
                abilityToBorrowFunds: disclosure.abilityToBorrowFunds ? 'Yes' : "No, (I disagree)",
                haveOtherBrokerageAccounts: disclosure.haveOtherBrokerageAccounts ? 'Yes' : 'No',
                haveOtherVelocityAccounts: disclosure.haveOtherVelocityAccounts ? 'Yes' : 'No',
                knowAnyVelocityAccountHolder: disclosure.knowAnyVelocityAccountHolder ? 'Yes' : 'No',
                shareholderInPubliclyTradedCompany: disclosure.shareholderInPubliclyTradedCompany ? 'Yes' : 'No',
                registeredBrokerDealerSecuritiesExchangeOrFINRA: disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRA ? 'Yes' : 'No',
                seniorOfficerAtFinancialInstitution: disclosure.seniorOfficerAtFinancialInstitution ? 'Yes' : 'No',
                knowAnyPublicOrPoliticalFigure: disclosure.knowAnyPublicOrPoliticalFigure ? 'Yes' : 'No',
                guardianAddendumAgreement: disclosure.guardianAddendumAgreement ? 'Yes' : 'No',
                availableInvestmentCapital: disclosure.availableInvestmentCapital ? 'Yes' : 'No',
                involveHighRisk: disclosure.involveHighRisk ? 'Yes' : 'No',
                abilitytoWithstandLosingInvestment: disclosure.abilitytoWithstandLosingInvestment ? 'Yes' : 'No'
            }
            setFormDataBoolean({ ...DISCLOSURE_DATA })
            if (disclosure.subjectToBackupWitholdingReason) {
                if (disclosure.subjectToBackupWitholdingReason === "1") {
                    setSubjectToBackupWitholding("a. I am exempt from backup withholding or")
                } else if (disclosure.subjectToBackupWitholdingReason === "2") {
                    setSubjectToBackupWitholding("b. I have not been notified by the internal Revenue Services (IRS) that I am subject to backup withholding as a result of failure to report all interest or dividends or")
                } else if (disclosure.subjectToBackupWitholdingReason === "3") {
                    setSubjectToBackupWitholding("c.  the IRS has notified me that I am no longer subject to backup withholding.")
                }
            }
        }
    }, [])


    useEffect(() => {
        try {
            if (disclosure && typeof disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile === "string") {
                let registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile_Redux: File[] | undefined;
                handleImageArray(disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile).then((blob) => {
                    dispatch(setDisclosure({ ["registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile"]: blob }));
                    setRegisteredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImage([new File([blob], "front-image." + blob.type.substring(blob.type.lastIndexOf('/') + 1), { type: blob.type })])
                    const reader = new window.FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = () => {
                        const imageDataUrl = reader.result;
                        setRegisteredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImageViewer(imageDataUrl as string);
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        try {
            if (disclosure && typeof disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile === "object" && disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile !== null) {
                setRegisteredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImage([new File([disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile], "front-image." + disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile.type.substring(disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile.type.lastIndexOf('/') + 1), { type: disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile.type })]);
                const reader = new window.FileReader();
                reader.readAsDataURL(disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile);
                reader.onload = () => {
                    const imageDataUrl = reader.result;
                    setRegisteredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImageViewer(imageDataUrl as string);
                }

            }
        } catch (error) {
            console.log(error)
        }
    }, [])

    const handleRadioRange = (e: any, field: any) => {
        try {
            if (e === "Yes") {
                dispatch(setDisclosure({ [field]: true }))
                setFormDataBoolean({
                    ...formDataBoolean,
                    [field]: e
                })
                if (errorValidation) {
                    handleValidation()
                }
            } else {
                dispatch(setDisclosure({ [field]: false }))
                SettingInitialFormStructureOnYes(field)
                setFormDataBoolean({
                    ...formDataBoolean,
                    [field]: e
                })
                setTimeout(() => {
                    if (errorValidation) {
                        handleValidation()
                    }
                }, 1000);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const clearUSPersonData = () => {
        dispatch(setDisclosure({ ["IsSubjectToBackupWitholding"]: true }))
        setTaxWithHoldingUS("")
    }

    const handleTaxWithHolding = (e: any, field: any) => {
        try {

            if (field === "U.S Person" && e === "U.S. Person: under penalty of perjury, I certify that:") {
                dispatch(setDisclosure({ ["TaxWithholdingCertifications"]: "USP" }))
                setTaxWithHolding("U.S. Person: under penalty of perjury, I certify that:")
            } else if (field === "certification" && e === "Certification Instruction: I cannot certify that I am not subject to backup up withholding, meaning that I have been notified by the IRS that I am currently subject to backup withholding because I have failed to report all interest and dividends on my tax return.") {
                dispatch(setDisclosure({ ["TaxWithholdingCertifications"]: "CI" }))
                setTaxWithHolding("Certification Instruction: I cannot certify that I am not subject to backup up withholding, meaning that I have been notified by the IRS that I am currently subject to backup withholding because I have failed to report all interest and dividends on my tax return.")
                clearUSPersonData()
            } else if (field === "certification" && e === "Non Residence Alien: I certify that I am not a U.S resident alien or other U.S. person for U.S. tax purpose and I am submitting the applicable Form W-8 with this Application to certify my foreign status and if applicable, claim tax treaty benefits.") {
                dispatch(setDisclosure({ ["TaxWithholdingCertifications"]: "NRA" }))
                setTaxWithHolding("Non Residence Alien: I certify that I am not a U.S resident alien or other U.S. person for U.S. tax purpose and I am submitting the applicable Form W-8 with this Application to certify my foreign status and if applicable, claim tax treaty benefits.")
                clearUSPersonData()
            } else if (field === "ApplicationIsCorrect" && e === "1. I am a U.S citizen or a U.S. Resident Alien or other U.S. Person and the Social Security Number or Taxpayer identification Number provided in this application is correct") {
                dispatch(setDisclosure({ ["IsSubjectToBackupWitholding"]: true }))
                setTaxWithHoldingUS("1. I am a U.S citizen or a U.S. Resident Alien or other U.S. Person and the Social Security Number or Taxpayer identification Number provided in this application is correct")
            } else if (field === "ApplicationIsCorrect" && e === "2. I am not subject to backup Withholding because") {
                dispatch(setDisclosure({ ["IsSubjectToBackupWitholding"]: false }))
                setTaxWithHoldingUS("2. I am not subject to backup Withholding because")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubjectToBackupWitholding = (e: any) => {
        if (e === "a. I am exempt from backup withholding or") {
            dispatch(setDisclosure({ ["subjectToBackupWitholdingReason"]: "1" }))
        } else if (e === "b. I have not been notified by the internal Revenue Services (IRS) that I am subject to backup withholding as a result of failure to report all interest or dividends or") {
            dispatch(setDisclosure({ ["subjectToBackupWitholdingReason"]: "2" }))
        } else {
            dispatch(setDisclosure({ ["subjectToBackupWitholdingReason"]: "3" }))
        }
        setSubjectToBackupWitholding(e)
    }

    const handleValidation = () => {
        try {
            let Validation_Object = {}
            let validation_result = false;
            let errorResonceText = []
            debugger
            if (disclosure && (formDataBoolean.abilityToBorrowFunds === "" || formDataBoolean.abilityToBorrowFunds === "No, (I disagree)")) {
                setRequiredErrorFlagOnAbilityToBorrowFunds(true)
                validation_result = true
            } else {
                setRequiredErrorFlagOnAbilityToBorrowFunds(false)
            }

            if (disclosure && disclosure.initialDeposit === "" || (Number(disclosure.initialDeposit) < 30000)) {
                Object.assign(Validation_Object, { initialDeposit: true });
                if (!validation_result) validation_result = true
                errorResonceText.push("Deposit amount must be greater than or equal to $30000")
            } else {
                Object.assign(Validation_Object, { initialDeposit: false });
            }

            if (disclosure && (formDataBoolean.haveOtherBrokerageAccounts === "" || (formDataBoolean.haveOtherBrokerageAccounts === "Yes" && disclosure.numberOfBrokerageAccounts === ""))) {
                Object.assign(Validation_Object, { haveOtherBrokerageAccounts: true });
                if (!validation_result) validation_result = true
            } else {
                Object.assign(Validation_Object, { haveOtherBrokerageAccounts: false });
            }

            if (disclosure && (formDataBoolean.haveOtherVelocityAccounts === "" || (formDataBoolean.haveOtherVelocityAccounts === "Yes" && (disclosure.haveOtherVelocityAccountsNumber === "" || disclosure.haveOtherVelocityAccountsName === "")))) {
                Object.assign(Validation_Object, { haveOtherVelocityAccounts: true });
                if (!validation_result) validation_result = true
                if (formDataBoolean.haveOtherVelocityAccounts === "Yes" && disclosure.haveOtherVelocityAccountsName === "") errorResonceText.push("Account name is required")
                if (formDataBoolean.haveOtherVelocityAccounts === "Yes" && disclosure.haveOtherVelocityAccountsNumber === "") errorResonceText.push("Account Number is required")
            } else {
                Object.assign(Validation_Object, { haveOtherVelocityAccounts: false });
            }

            if (disclosure && (formDataBoolean.knowAnyVelocityAccountHolder === "" || (formDataBoolean.knowAnyVelocityAccountHolder === "Yes" && (disclosure.knowAnyVelocityAccountHolderNumber === "" || disclosure.knowAnyVelocityAccountHolderName === "" || disclosure.knowAnyVelocityAccountHolderRelationship === "")))) {
                Object.assign(Validation_Object, { knowAnyVelocityAccountHolder: true });
                if (!validation_result) validation_result = true;
                if (formDataBoolean.knowAnyVelocityAccountHolder === "Yes" && disclosure.knowAnyVelocityAccountHolderNumber === "") errorResonceText.push("Account Number is required")
                if (formDataBoolean.knowAnyVelocityAccountHolder === "Yes" && disclosure.knowAnyVelocityAccountHolderName === "") errorResonceText.push("Account name is required")
                if (formDataBoolean.knowAnyVelocityAccountHolder === "Yes" && disclosure.knowAnyVelocityAccountHolderRelationship === "") errorResonceText.push("Relationship is required")
            } else {
                Object.assign(Validation_Object, { knowAnyVelocityAccountHolder: false });
            }

            if (disclosure && (formDataBoolean.shareholderInPubliclyTradedCompany === "" || (formDataBoolean.shareholderInPubliclyTradedCompany === "Yes" && (disclosure.shareholderInPubliclyTradedCompanyName === "" || disclosure.shareholderInPubliclyTradedCompanyAddress === "" || disclosure.shareholderInPubliclyTradedCompanyRelationship === "")))) {
                Object.assign(Validation_Object, { shareholderInPubliclyTradedCompany: true });
                if (!validation_result) validation_result = true;
                if (formDataBoolean.shareholderInPubliclyTradedCompany === "Yes" && disclosure.shareholderInPubliclyTradedCompanyName === "") errorResonceText.push("Company Name is required")
                if (formDataBoolean.shareholderInPubliclyTradedCompany === "Yes" && disclosure.shareholderInPubliclyTradedCompanyAddress === "") errorResonceText.push("Company Address is required")
                if (formDataBoolean.shareholderInPubliclyTradedCompany === "Yes" && disclosure.shareholderInPubliclyTradedCompanyRelationship === "") errorResonceText.push("Relationship with entity is required")
            } else {
                Object.assign(Validation_Object, { shareholderInPubliclyTradedCompany: false });
            }

            if (disclosure && (formDataBoolean.registeredBrokerDealerSecuritiesExchangeOrFINRA === "" || (formDataBoolean.registeredBrokerDealerSecuritiesExchangeOrFINRA === "Yes" && (disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAName === "" || disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAAddress === "" || disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile === null)))) {
                Object.assign(Validation_Object, { registeredBrokerDealerSecuritiesExchangeOrFINRA: true });
                if (!validation_result) validation_result = true;
                if (formDataBoolean.registeredBrokerDealerSecuritiesExchangeOrFINRA === "Yes" && disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAName === "") errorResonceText.push("Company Name is required")
                if (formDataBoolean.registeredBrokerDealerSecuritiesExchangeOrFINRA === "Yes" && disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAAddress === "") errorResonceText.push("Company Address is required")
                if (formDataBoolean.registeredBrokerDealerSecuritiesExchangeOrFINRA === "Yes" && disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile === null) errorResonceText.push("Relationship with entity is required")
            } else {
                Object.assign(Validation_Object, { registeredBrokerDealerSecuritiesExchangeOrFINRA: false });
            }

            if (disclosure && (formDataBoolean.seniorOfficerAtFinancialInstitution === "" || (formDataBoolean.seniorOfficerAtFinancialInstitution === "Yes" && (disclosure.seniorOfficerAtFinancialInstitutionName === "" || disclosure.seniorOfficerAtFinancialInstitutionAddress === "" || disclosure.seniorOfficerAtFinancialInstitutionPosition === "")))) {
                Object.assign(Validation_Object, { seniorOfficerAtFinancialInstitution: true });
                if (!validation_result) validation_result = true
                if (formDataBoolean.seniorOfficerAtFinancialInstitution === "Yes" && disclosure.seniorOfficerAtFinancialInstitutionName === "") errorResonceText.push("Firm is required")
                if (formDataBoolean.seniorOfficerAtFinancialInstitution === "Yes" && disclosure.seniorOfficerAtFinancialInstitutionAddress === "") errorResonceText.push("Firm Address is required")
                if (formDataBoolean.seniorOfficerAtFinancialInstitution === "Yes" && disclosure.seniorOfficerAtFinancialInstitutionPosition === "") errorResonceText.push("Position in Firm is required")
            } else {
                Object.assign(Validation_Object, { seniorOfficerAtFinancialInstitution: false });
            }
            if (disclosure && (formDataBoolean.knowAnyPublicOrPoliticalFigure === "" || (formDataBoolean.knowAnyPublicOrPoliticalFigure === "Yes" && (disclosure.knowAnyPublicOrPoliticalFigureName === "" || disclosure.knowAnyPublicOrPoliticalFigureRelationship === "" || disclosure.knowAnyPublicOrPoliticalFigurePosition === "")))) {
                Object.assign(Validation_Object, { knowAnyPublicOrPoliticalFigure: true });
                if (!validation_result) validation_result = true
                if (formDataBoolean.knowAnyPublicOrPoliticalFigure === "Yes" && disclosure.knowAnyPublicOrPoliticalFigureName === "") errorResonceText.push("Firm is required")
                if (formDataBoolean.knowAnyPublicOrPoliticalFigure === "Yes" && disclosure.knowAnyPublicOrPoliticalFigureRelationship === "") errorResonceText.push("Firm Address is required")
                if (formDataBoolean.knowAnyPublicOrPoliticalFigure === "Yes" && disclosure.knowAnyPublicOrPoliticalFigurePosition === "") errorResonceText.push("Position in Firm is required")
            } else {
                Object.assign(Validation_Object, { knowAnyPublicOrPoliticalFigure: false });
            }
            if (disclosure && (formDataBoolean.guardianAddendumAgreement === "" || formDataBoolean.guardianAddendumAgreement === "No")) {
                Object.assign(Validation_Object, { guardianAddendumAgreement: true });
                if (!validation_result) validation_result = true
            } else {
                Object.assign(Validation_Object, { guardianAddendumAgreement: false });
            }

            if (disclosure && (formDataBoolean.guardianAddendumAgreement === "" || formDataBoolean.guardianAddendumAgreement === "No")) {
                Object.assign(Validation_Object, { guardianAddendumAgreement: true });
                if (!validation_result) validation_result = true
            } else {
                Object.assign(Validation_Object, { guardianAddendumAgreement: false });
            }

            if (disclosure && (formDataBoolean.availableInvestmentCapital === "")) {
                Object.assign(Validation_Object, { availableInvestmentCapital: true });
                if (!validation_result) validation_result = true
            } else {
                Object.assign(Validation_Object, { availableInvestmentCapital: false });
            }

            if (disclosure && (formDataBoolean.involveHighRisk === "" || (formDataBoolean.involveHighRisk === "No" && disclosure.objectivesWithAccount === ""))) {
                Object.assign(Validation_Object, { involveHighRisk: true });
                if (!validation_result) validation_result = true
            } else {
                Object.assign(Validation_Object, { involveHighRisk: false });
                if (disclosure.objectivesWithAccount === "") errorResonceText.push("Objective with account is required")
            }

            if (disclosure && (formDataBoolean.abilitytoWithstandLosingInvestment === "" || (formDataBoolean.abilitytoWithstandLosingInvestment === "No" && disclosure.abilitytoWithstandLosingInvestmentReason === ""))) {
                if (!validation_result) validation_result = true
            }

            if (disclosure && !disclosure.IsSubjectToBackupWitholding && disclosure.subjectToBackupWitholdingReason === "") {
                if (!validation_result) validation_result = true
            } else {
                Object.assign(Validation_Object, { IsSubjectToBackupWitholding: false });
                if (disclosure.subjectToBackupWitholdingReason === "") errorResonceText.push("Subject To backupwithholding with account is required")

            }
            setFormDataValidation({ ...Validation_Object })
            if (errorResonceText && errorResonceText.length > 0) {
                setErrorShow(errorResonceText);
            } else {
                setErrorShow([])
            }
            return validation_result
        } catch (error) {
            console.log(error)
        }
    }


    const handleFileUpload = async (File: any, imageType: string) => {
        try {
            if (File && File.length > 0) {
                dispatch(setDisclosure({ [`${imageType}`]: File[0] }))
                setRegisteredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImage(File)
                const reader = new FileReader();
                reader.onload = function (e) {
                    setRegisteredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImageViewer(e.target!.result);
                }
                reader.readAsDataURL(File[0]);
            }
        } catch (error) {
            console.log(error)
        }
    }
    const { type } = useParams();

    const handleSubmit = async (e: any) => {
        setErrorShow([]);
        let validationFunctionReturn = handleValidation()
        setErrorValidation(true)
        if (!validationFunctionReturn) {
            const { isValid } = e.validationGroup.validate();
            if (isValid) {
                setLoading(true)
                ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=${type === "1" ? "10" : "8"}`, {
                    ...encryptFormData(disclosure),
                    registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile: disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile ? await encryptFile(disclosure.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile!) : ""
                }).then(() => {
                    toastSuccess("ID Information added successfully");
                    setLoading(false)
                    dispatch(next());
                }).catch((error) => {
                    setLoading(false)
                    if (typeof error.response?.data === "object") {
                        setErrorShow(Object.values(error.response.data).flatMap(c => c) as Array<string>);
                    } else {
                        toastError(error?.message);
                    }
                });
            }
        }
        // NextStep()
    }
    /*  handle the form submission start */
    return (
        <div className="my-4">
            <div className="row">
                {/* <div className="col-md-1"></div> */}
                <div className="col-md-12 signUpBoxShadow">
                    <div className="long-title"> <h3 className="fs-title">DISCLOSURES</h3> </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <p>
                                Borrowing Money to Buy Securities(Buying "on
                                Margin") - (Please read carefully)
                            </p>
                            <p>
                                You chose to have a "margin loan account"
                                (customerly known as "margin account") by checking
                                the boxes below. To help you decide whether a margin
                                loan account is right for you.Please read the
                                information below and the client agreement.
                            </p>
                        </div>
                    </div>
                    {
                        investQuestion.Guardian.map((guardian, index) => {
                            if (guardian.name === 'Radio') {
                                return (
                                    <div className="row">
                                        <Loader loading={loading} />
                                        <div className="col-sm-12 text-left sas">
                                            <br />
                                            <p className="mb-0">{guardian.text} <span className="text-danger"> *</span>
                                                <div className="optRadio-error"></div>
                                            </p>
                                        </div>
                                        {guardian.validation && <div className=" mt-0 optRadio-error mt-3 mb-1  "><span style={{ color: "red" }}> Required ! </span></div>}
                                        {guardian.validation}
                                        <div className="col-sm-12 text-left ynoption mt-2">
                                            <RadioGroup items={guardian.responce} value={guardian.value} onValueChange={(e) => handleRadioRange(e, guardian.field)} />
                                            {/* <br /> */}
                                            {/* <br /> */}
                                        </div>
                                        <div className="row">
                                            {
                                                guardian.haveAdditionalField === "Yes" && ((guardian.field === 'involveHighRisk' && guardian.value === "No") || (guardian.field === 'abilitytoWithstandLosingInvestment' && guardian.value === "No") || (guardian.field !== 'involveHighRisk' && guardian.field !== 'abilitytoWithstandLosingInvestment' && guardian.value === "Yes")) && guardian.additionalField.map((additionalField) => {
                                                    if (additionalField.type === "text" && additionalField.inputText !== "Number Of Accounts (total)" && additionalField.inputText !== "Account Number") {
                                                        return (
                                                            <div className="col-sm-4 text-left ynoption mt-4">
                                                                <label > {additionalField.inputText} <span className="text-danger"> *</span></label>
                                                                {additionalField.inputText !== "Account Number" ? <TextBox value={additionalField.inputValue?.toString()!} maxLength={additionalField.max_length} placeholder="" validationStatus={(additionalField.inputValue === "" && errorValidation) ? "invalid" : "valid"} onValueChange={(e) => handleRadioChange(additionalField.field, e)} /> :
                                                                    <TextBox value={additionalField.inputValue?.toString()!} maxLength={additionalField.max_length} placeholder="" validationStatus={(additionalField.inputValue === "" && errorValidation) ? "invalid" : "valid"} onValueChange={(e) => handleRadioChange(additionalField.field, e)} />
                                                                }
                                                                {(additionalField.inputValue === "" && errorValidation) && <span className="my-2" style={{ color: "red" }}> {additionalField.RequiredRuleText} </span>}
                                                            </div>
                                                        )
                                                    } else if (additionalField.inputText === "Number Of Accounts (total)" || additionalField.inputText === "Account Number") {
                                                        return (
                                                            <div className="col-sm-4 text-left ynoption mt-4">
                                                                <label > {additionalField.inputText} <span className="text-danger"> *</span></label>
                                                                <NumberBox
                                                                    value={+additionalField.inputValue!}
                                                                    // format={"#.#"}
                                                                    min={1}
                                                                    max={additionalField.max_length}
                                                                    onValueChange={(e) => handleRadioChange(additionalField.field, e)} />
                                                                {(additionalField.inputValue === "" && errorValidation) && <span className="my-2" style={{ color: "red" }}> {additionalField.RequiredRuleText} </span>}
                                                            </div>
                                                        )
                                                    } else {
                                                        return (
                                                            <div className="col-sm-4 mt-4">
                                                                <div className="file-uploader-block">
                                                                    <FileUploader value={registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImage ?? []} minFileSize={10000} maxFileSize={8000000} allowedFileExtensions={fileExtensions} onValueChange={(file) => handleFileUpload(file, "registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile")} selectButtonText="Choose File" labelText="" accept="image/*" uploadMode="useForm" />
                                                                    <div className="note" style={{ marginLeft: "9px", display: "block" }}>
                                                                        {registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImageViewer !== "" && <img src={registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFileImageViewer} alt="Select Image" width={400} height={100} />}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            } else if (guardian.name === 'Number')
                                return (
                                    <div className="row">
                                        <div className="col-md-12 text-left">

                                            <p>{guardian.text1} <br /> {guardian.text2}
                                                <br />
                                                {guardian.text3} <span
                                                    className="text-danger"> *</span>
                                            </p>
                                            <div className="input-box w-50">
                                                <NumberBox
                                                    format="$ #,##0.##"
                                                    value={disclosure.initialDeposit ? Number(+disclosure.initialDeposit!) : Number("0.00")}
                                                    min={30000}
                                                    max={guardian.max_length}
                                                    onValueChange={handleInitialDeposit}
                                                    defaultValue={disclosure.initialDeposit ? +disclosure.initialDeposit! : Number("0.00")}
                                                />
                                                {((disclosure.initialDeposit === "" || Number(disclosure.initialDeposit) < 30000) && errorValidation) && <span className="my-2" style={{ color: "red" }}> Deposit amount must be greater than or equal to $30000 </span>}
                                                {/* <TextBox value={formData.initialDeposit} placeholder="" onValueChange={handleInitialDeposit} /> */}
                                            </div>
                                        </div>
                                    </div>
                                )
                        }
                        )
                    }
                    <div className="row mt-3" style={{ marginLeft: "8px", marginRight: "5px" }}>
                        <div className="col-md-12" style={{ backgroundColor: "#dedede" }}>
                            <br />
                            {(errorValidation && (!disclosure.IsSubjectToBackupWitholding && disclosure.subjectToBackupWitholdingReason === "")) && <span className="my-2" style={{ color: "red" }}> </span>}
                            <p><b>Tax Withholding Certifications - Choose One</b></p>
                            <div className="col-sm-12 text-left ynoption">
                                <RadioGroup value={taxWithHolding} items={support_User.Guardian[0].label} onValueChange={(e) => handleTaxWithHolding(e, "U.S Person")} />
                                {disclosure.TaxWithholdingCertifications === "USP" && <div style={{ marginLeft: "30px" }} >
                                    <RadioGroup value={taxWithHoldingUS} items={support_User.Guardian[0].label_radio} onValueChange={(e) => handleTaxWithHolding(e, "ApplicationIsCorrect")} /> </div>}
                                {disclosure.IsSubjectToBackupWitholding === false && <div style={{ marginLeft: "30px" }}>
                                    <RadioGroup value={subjectToBackupWitholding} items={support_User.Guardian[0].label_subject_to} onValueChange={(e) => handleSubjectToBackupWitholding(e)} />
                                </div>}
                                <RadioGroup value={taxWithHolding} items={support_User.Guardian[0].label_certification} onValueChange={(e) => handleTaxWithHolding(e, "certification")} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Form
                                formData={INITIAL_FORMDATA}
                                colCount={1}
                                showColonAfterLabel={false}
                                readOnly={false}
                                showValidationSummary={true}
                                validationGroup="customerData"
                                labelLocation="top">
                                <GroupItem colCount={31}>
                                    <ButtonItem
                                        horizontalAlignment="right"
                                        colSpan={27}
                                        cssClass={"buttonTxt mt-3"}
                                        buttonOptions={buttonOptionsPrevious}
                                    />
                                    <ButtonItem
                                        horizontalAlignment="right"
                                        colSpan={4}
                                        cssClass={"buttonTxt mt-3"}
                                        buttonOptions={buttonOptionsNext}
                                    />
                                </GroupItem>
                            </Form>
                            {errorShow.map(c => <div className=" mt-2 dx-item dx-validationsummary-item"><div className="dx-item-content dx-validationsummary-item-content">{c}</div></div>)}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Disclosure;