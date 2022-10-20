import { JSEncrypt } from "jsencrypt";
import CryptoJS from 'crypto-js';
import { nameCountries } from "./Data";
import { ApiGetCommonDataAsync, ApiRequestAsync } from "../services/httpservice";
import axios from "axios";
import { token } from "../services/webstorage";


const encryptionType = 'aes-256-cbc';
const encryptionEncoding = 'base64';
const bufferEncryption = 'utf-8';
const AesKey = "UQJh6GzSQdCOmxPGTJHoP0FKyBVoi6gV";
const AesIV = "RXuGV61itfE4Zelz";
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCobtNh/OJAuP1t9wnd2CEVfZ5xAG8G91dtC4bCLVrBjzdUhNsINTvF0C0vblijzUbCi+o++mFezlnuljcfLsS5adxyw/oX9nL89bOprC5mlgmn8sTEMc5ceF0HqO/iPwEVbQ/CLSYC1ucQYYVBqbNe8r4/2akAjplYZmpuB1gScQIDAQAB-----END PUBLIC KEY-----`

const jsEncrypt = new JSEncrypt({ default_key_size: (1024 * 1024 * 1024).toString() });
jsEncrypt.setPublicKey(PUBLIC_KEY);

const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const encryptValue = (value: any) => {
    return jsEncrypt.encrypt(value).toString();
}

export function encryptFile(file: File | undefined) {
    if (!file) return file;
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => {

            const key = CryptoJS.enc.Utf8.parse(AesKey);
            const iv = CryptoJS.enc.Utf8.parse(AesIV);

            // const wordArray = CryptoJS.lib.WordArray.create(JSON.stringify(reader.result)  as any);
            //@ts-ignore
            const base64 = reader.result?.split(",")[1];
            // Convert: ArrayBuffer -> WordArray
            const encrypted = CryptoJS.AES.encrypt(base64 as string, key, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC
            });
            // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)
            res(encrypted.ciphertext.toString(CryptoJS.enc.Base64));

        };
        reader.readAsDataURL(file);
    });

}

export const base64Encrypt = (_base64: string) => {
    const key = CryptoJS.enc.Utf8.parse(AesKey);
    const iv = CryptoJS.enc.Utf8.parse(AesIV);

    // const wordArray = CryptoJS.lib.WordArray.create(JSON.stringify(reader.result)  as any);
    //@ts-ignore
    const base64 = _base64?.split(",")[1];
    // Convert: ArrayBuffer -> WordArray
    const encrypted = CryptoJS.AES.encrypt(_base64, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);

}


export const encryptFormData = (values: any) => {
    jsEncrypt.setPublicKey(PUBLIC_KEY);
    const formData: any = {}

    Object.keys(values).forEach(key => {

        if (Array.isArray(values[key])) {

            let arrayOfEncryptedElements: any = [];

            values[key].forEach((_key: any, index: number) => {

                if (typeof _key === "object") {

                    Object.keys(_key).forEach(_insideKey => {
                        _key[_insideKey] = jsEncrypt.encrypt(_key[_insideKey]).toString()

                    })
                    arrayOfEncryptedElements.push(_key);
                }
                else {
                    arrayOfEncryptedElements.push(jsEncrypt.encrypt(values[key][index]).toString());
                }
            })

            formData[key] = JSON.stringify(arrayOfEncryptedElements)

        } else if (typeof values[key] === "string") {

            formData[key] = jsEncrypt.encrypt(values[key]);

        } else if (typeof values[key] === "boolean") {

            formData[key] = jsEncrypt.encrypt(values[key].toString());

        }

    });

    return formData;
}

export const handleValidGovtID = (validGovtIDType: any) => {
    if (validGovtIDType && validGovtIDType !== "") {
        if (validGovtIDType === "D") {
            return "Driver License"
        } else if (validGovtIDType === "P") {
            return "Passport"
        } else {
            return "Local ID"
        }
    } else {
        return ""
    }
}

export const handleCountryName = (countryIso2: string) => {
    try {
        ApiGetCommonDataAsync("GET", "/Countries").then(responce => {
          let countryNameData = responce.data.filter((element: { isO2: any; }) => element.isO2 === countryIso2)
          if(countryNameData && countryNameData[0]?.name !== "") return countryNameData[0]?.name
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const handleImageArray = async (dataurl: any) => {
    // let imageURLResponce = {}
    return await axios.get("https://localhost:7284/api/v2/Preview", {
        headers: {
            "Authorization": `Bearer ${token()}`
        },
        responseType: "blob", params: {
            filePath: dataurl
        }
    })
        .then((response) => {
            console.log(response);
            return response.data
            // var reader = new window.FileReader();
            // reader.readAsDataURL(response.data);
            // reader.onload = () => {
            //     var imageDataUrl = reader.result;
            //     imageURLResponce = {
            //         imageResponce: response,
            //         imageResponceDisplay: imageDataUrl
            //     }
            // }
        });
}

export const handleCountryValue = (countryName: string, countryData: Array<object>) => {
    try {
        if (countryName && countryName !== "") {
            //@ts-ignore
            var data_filter = countryData.filter(element => element.name == countryName)
            let countrydropdownCode = "";
            //@ts-ignore
            if (data_filter && data_filter[0].isO2 && data_filter[0].isO2 !== "") countrydropdownCode = data_filter[0].isO2
            //@ts-ignore
            return {
                countryNameApi: countryName,
                countryIso2: countrydropdownCode
            }
        }
    } catch (error) {
        console.log(error)
    }
}



const MartialStatus: Record<string, string> = {
    "S": "Single",
    "M": "Married",
    "D": "Divorced",
    "W": "Widowed"

}
export const handleMartialStatus = (martialStatus: string) => {
    return MartialStatus[martialStatus] ?? "Single"
}

export const handleCountryCode = (countryName: string) => {
    if (countryName && countryName !== "") {
        var data_filter = nameCountries.filter(element => element.country == countryName)
        if (data_filter && data_filter.length > 0 && data_filter[0].code !== "") {
            return data_filter[0].code
        }
    }
}

export const handleAplicationPersonalData = (data: any) => {
    const perosnalData = {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        aptOrSuite: data.aptOrSuite,
        country: data.country,
        state: data.state,
        city: data.city,
        zipCode: data.zipCode,
        phoneNumber: data.phoneNumber,
        numberOfDependents: data.numberOfDependents,
        maritalStatus: handleMartialStatus(data.maritalStatus),
        isMailingAddressDifferent: data.isMailingAddressDifferent === "true" ? true : false,
        maAddress: data.maAddress,
        maAptOrSuite: data.maAptOrSuite,
        maCountry: data.maCountry,
        maCity: data.maCity,
        maState: data.maState,
        maZipCode: data.maZipCode,
        isTrustedContactPersonAvailable: data.isTrustedContactPersonAvailable === "true" ? true : false,
        tcpName: data.tcpName,
        tcpPhoneNumber: data.tcpPhoneNumber,
        tcpAddress: data.tcpAddress,
        tcpEmail: data.tcpEmail,
        tcpCountry: data.tcpCountry,
        tcpState: data.tcpState,
        tcpCity: data.tcpCity,
        tcpZip: data.tcpZip,
        tcpRelationToAccountHolder: data.tcpRelationToAccountHolder,
        tcpDateOfBirth: data.tcpDateOfBirth
    }

    const professionalInformation = {
        employmentStatus: data.employmentStatus,
        employerOrBusinessName: data.employerOrBusinessName,
        occupationOrComapnyType: data.occupationOrComapnyType,
        address: data.address,
        employmentYearsOfExperience: data.employmentYearsOfExperience,
        country: data.country,
        state: data.state,
        city: data.city,
        aptOrSuite: data.aptOrSuite,
        employmentPhone: data.employmentPhone,
        employmentFax: data.employmentFax
    }

    const idInformation = {
        ssn: data.ssn,
        dateOfBirth: data.dateOfBirth,
        validGovtIDType: handleValidGovtID(data.validGovtIDType),
        idNumber: data.idNumber,
        issuingCountry: data.issuingCountry,
        issuingState: data.issuingState,
        taxCountry: data.taxCountry,
        taxState: data.taxState,
        issueDate: data.issueDate,
        expirationDate: data.expirationDate,
    }

    const identityProof = {
        IdentificationType: data.identificationProofType,
        FrontImage: handleImageArray(data.frontIdentification),
        BackImage: data.backIdentification
    }

    const investmentRiskTolerance = { investmentRiskTolerance: data.investmentRiskTolerance }

    return {
        perosnalDataResponce: perosnalData,
        professionalInformation: professionalInformation,
        idInformationResponce: idInformation,
        investmentRiskToleranceResponce: investmentRiskTolerance,
        identityProofResponce: identityProof

    }
}
export function capitalizeFirstLetter(value: string) {
    if (!value) return value
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export const handleAplicationOtherPersonalData = (data: any) => {
    const incomeDetail = {
        Annual_Income: Number(data.annualIncome) - 1,
        Net_Worth: Number(data.netWorthExcludingResidence) - 1,
        Liquid_Net_Worth: Number(data.liquidNetWorth) - 1,
        TAX_RATE: Number(data.taxRate) - 1
    }

    const financial = {
        ANNUAL_EXPENSES: Number(data.annualExpenses) - 1,
        Special_Expenses: Number(data.specialExpenses) - 1,
        Liquidity_Needs: Number(data.liquidityNeeds) - 1,
        financial_goal: Number(data.timeToAchieveFinancialGoal) - 1
    }

    const disclosure = {
        abilityToBorrowFunds: data.abilityToBorrowFunds === "true" ? true : false,
        guardianAddendumAgreement: data.guardianAddendumAgreement === "true" ? true : false,
        availableInvestmentCapital: data.availableInvestmentCapital === "true" ? true : false,
        involveHighRisk: data.involveHighRisk === "true" ? true : false,
        objectivesWithAccount: data.objectivesWithAccount,
        abilitytoWithstandLosingInvestment: data.abilitytoWithstandLosingInvestment === "true" ? true : false,
        abilitytoWithstandLosingInvestmentReason: data.abilitytoWithstandLosingInvestmentReason,
        initialDeposit: data.initialDeposit,
        haveOtherBrokerageAccounts: data.haveOtherBrokerageAccounts === "true" ? true : false,
        numberOfBrokerageAccounts: data.numberOfBrokerageAccounts,
        haveOtherVelocityAccounts: data.haveOtherVelocityAccounts === "true" ? true : false,
        haveOtherVelocityAccountsNumber: data.haveOtherVelocityAccountsNumber,
        haveOtherVelocityAccountsName: data.haveOtherVelocityAccountsName,
        knowAnyVelocityAccountHolder: data.knowAnyVelocityAccountHolder === "true" ? true : false,
        knowAnyVelocityAccountHolderNumber: data.knowAnyVelocityAccountHolderNumber,
        knowAnyVelocityAccountHolderName: data.knowAnyVelocityAccountHolderName,
        knowAnyVelocityAccountHolderRelationship: data.knowAnyVelocityAccountHolderRelationship,
        shareholderInPubliclyTradedCompany: data.shareholderInPubliclyTradedCompany === "true" ? true : false,
        shareholderInPubliclyTradedCompanyName: data.shareholderInPubliclyTradedCompanyName,
        shareholderInPubliclyTradedCompanyAddress: data.shareholderInPubliclyTradedCompanyAddress,
        shareholderInPubliclyTradedCompanyRelationship: data.shareholderInPubliclyTradedCompanyRelationship,
        registeredBrokerDealerSecuritiesExchangeOrFINRA: data.registeredBrokerDealerSecuritiesExchangeOrFINRA === "true" ? true : false,
        registeredBrokerDealerSecuritiesExchangeOrFINRAName: data.registeredBrokerDealerSecuritiesExchangeOrFINRAName,
        registeredBrokerDealerSecuritiesExchangeOrFINRAAddress: data.registeredBrokerDealerSecuritiesExchangeOrFINRAAddress,
        registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile: data.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile,
        seniorOfficerAtFinancialInstitution: data.seniorOfficerAtFinancialInstitution === "true" ? true : false,
        seniorOfficerAtFinancialInstitutionName: data.seniorOfficerAtFinancialInstitutionName,
        seniorOfficerAtFinancialInstitutionAddress: data.seniorOfficerAtFinancialInstitutionAddress,
        seniorOfficerAtFinancialInstitutionPosition: data.seniorOfficerAtFinancialInstitutionPosition,
        knowAnyPublicOrPoliticalFigure: data.knowAnyPublicOrPoliticalFigure === "true" ? true : false,
        knowAnyPublicOrPoliticalFigureName: data.knowAnyPublicOrPoliticalFigureName,
        knowAnyPublicOrPoliticalFigurePosition: data.knowAnyPublicOrPoliticalFigurePosition,
        knowAnyPublicOrPoliticalFigureRelationship: data.knowAnyPublicOrPoliticalFigureRelationship,
        TaxWithholdingCertifications: data.taxWithholdingCertifications,
        IsSubjectToBackupWitholding: data.IsSubjectToBackupWitholding === "true" ? true : false,
        subjectToBackupWitholdingReason: data.subjectToBackupWitholdingReason
    }

    const signature = {
        accountTermsandConditions: data.accountTermsandConditions === "true" ? true : false,
        dayTradingRiskDisclosure: data.dayTradingRiskDisclosure === "true" ? true : false,
        pennyStockDisclosure: data.pennyStockDisclosure === "true" ? true : false,
        electronicAccessTradingAgreement: data.electronicAccessTradingAgreement === "true" ? true : false,
        marginDisclosureStatement: data.marginDisclosureStatement === "true" ? true : false,
        stockLocateAgreement: data.stockLocateAgreement === "true" ? true : false,
        marginAgreement: data.marginAgreement === "true" ? true : false,
        LiquidationNotice: data.LiquidationNotice === "true" ? true : false,
        softwarePreference: data.softwarePreference === "true" ? true : false,
        experienceInSelectedSoftware: data.experienceInSelectedSoftware === "true" ? true : false,
        isW8OrW9Forms: data.isW8OrW9Forms,
        taxStatus: data.taxStatus,
        experienceInSelectedSoftwareReason: data.experienceInSelectedSoftwareReason,
        electronicMailDeliveryAgreement: data.experienceInSelectedSoftwareReason === "true" ? true : false,
        UserSignature: data.UserSignature,
        UserSignatureName: ""
    }

    return {
        incomeDetailResponce: incomeDetail,
        financialResponce: financial,
        disclosureResponce: disclosure,
        signatureResponce: signature,
    }
}

export const handleAplicationCompanyData = (data: any) => {
    const companyDetails = {
        Name: data.name,
        address: data.address,
        aptOrSuite: data.aptOrSuite,
        country: data.country,
        state: data.state,
        city: data.city,
        zipCode: data.zipCode,
        phoneNumber: data.phoneNumber,
        email: data.email,
        taxIdNum: data.taxIdNum,
        isMailingAddressDifferent: data.isMailingAddressDifferent === "true" ? true : false,
        maAddress: data.maAddress,
        mACountry: data.maCountry,
        mAAptOrSuite: data.maAptOrSuite,
        mACity: data.maCity,
        mAState: data.maState,
        mAZipCode: data.maZipCode,
        IdentificationProofType: data.IdentificationProofType ? data.IdentificationProofType : "1",
        front: data.front,
        back: data.back,
        corporateDocumentOne: data.corporateDocumentOne,
        corporateDocumentTwo: data.corporateDocumentTwo,
        corporateDocumentThree: data.corporateDocumentThree,
        corporateDocumentFour: data.corporateDocumentFour
    }

    const financial = {
        ANNUAL_EXPENSES: Number(data.annualExpenses) - 1,
        Special_Expenses: Number(data.specialExpenses) - 1,
        Liquidity_Needs: Number(data.liquidityNeeds) - 1,
        financial_goal: Number(data.timeToAchieveFinancialGoal) - 1
    }

    const investmentRiskTolerance = { investmentRiskTolerance: data.investmentRiskTolerance }

    return {
        companyDetailsResponce: companyDetails,
        investmentRiskToleranceResponce: investmentRiskTolerance,
        financialResponce: financial,
    }
}

export const handleAplicationBeneficiaryCompanyData = (data: any) => {
    try {
        if (data && data.length > 0) {
            let BeneficialArray: any = []
            let BeneficiaryDataMutate = data.map((Benefiary: any) => {
                let BeneficialArrayObject = {
                    firstName: Benefiary.firstName,
                    lastName: Benefiary.lastName,
                    address: Benefiary.address,
                    aptOrSuite: Benefiary.aptOrSuite,
                    country: Benefiary.country,
                    countrycode: handleCountryCode(Benefiary.country),
                    validatePhoneNumber: false,
                    state: Benefiary.state,
                    city: Benefiary.city,
                    zipCode: Benefiary.zipCode,
                    phoneNumber: Benefiary.phoneNumber,
                    numberOfDependents: Benefiary.numberOfDependents,
                    maritalStatus: handleMartialStatus(Benefiary.maritalStatus),
                    isMailingAddressDifferent: Benefiary.isMailingAddressDifferent === "true" ? true : false,
                    maAddress: Benefiary.maAddress,
                    maAptOrSuite: Benefiary.maAptOrSuite,
                    maCountry: Benefiary.maCountry,
                    maCity: Benefiary.maCity,
                    maState: Benefiary.maState,
                    maZipCode: Benefiary.maZipCode,
                    isTrustedContactPersonAvailable: Benefiary.isTrustedContactPersonAvailable === "true" ? true : false,
                    tcpName: Benefiary.tcpName,
                    tcpPhoneNumber: Benefiary.tcpPhoneNumber,
                    countrytcpCode: handleCountryCode(Benefiary.country),
                    validateTcpCountryCode: false,
                    tcpAddress: Benefiary.tcpAddress,
                    tcpEmail: Benefiary.tcpEmail,
                    tcpCountry: Benefiary.tcpCountry,
                    tcpCity: Benefiary.tcpCity,
                    tcpZip: Benefiary.tcpZip,
                    tcpRelationToAccountHolder: Benefiary.tcpRelationToAccountHolder,
                    tcpDateOfBirth: Benefiary.tcpDateOfBirth,
                    boForm: Benefiary.boForm,
                    ssn: Benefiary.ssn,
                    dateOfBirth: Benefiary.dateOfBirth,
                    validGovtIDType: handleValidGovtID(Benefiary.validGovtIDType),
                    idNumber: Benefiary.idNumber,
                    issuingCountry: Benefiary.issuingCountry,
                    issuingState: Benefiary.issuingState,
                    taxCountry: Benefiary.taxCountry,
                    taxState: Benefiary.taxState,
                    IssueDate: Benefiary.issueDate,
                    expirationDate: Benefiary.expirationDate,
                    IdentificationProofType: Benefiary.IdentificationProofType !== undefined ? Benefiary.IdentificationProofType : "1",
                    IdentificationProofTypeText: Benefiary.IdentificationProofType === "2" || Benefiary.IdentificationProofType !== undefined ? "Utility Bill & Passport" : "Government Issued ID",
                    FrontImage: Benefiary.frontIdentification,
                    BackImage: Benefiary.backIdentification,
                }
                BeneficialArray.push(BeneficialArrayObject)
            })
            return {
                BeneficialArrayResponce: BeneficialArray
            }
        }

    } catch (error) {
        console.log(error)
    }
}

export const handleAplicationFundingData = (data: any) => {
    let applicationArray = []
    if (data.incomeSource && data.incomeSource !== "") applicationArray = JSON.parse(data.incomeSource)
    const fundingData = {
        Wages_Income: applicationArray.includes("1") ? true : false,
        Savings: applicationArray.includes("2") ? true : false,
        Pension: applicationArray.includes("3") ? true : false,
        fundFromAnotherAccount: applicationArray.includes("4") ? true : false,
        gift_Inheritance: applicationArray.includes("5") ? true : false,
        other: applicationArray.includes("6") ? true : false,
        saleofasset: applicationArray.includes("7") ? true : false,
        otherIncomeSource: data.otherIncomeSource,
        bankName: data.bankName,
        ABAOrSWIFT: data.abaOrSWIFT,
        bankAccountNumber: data.bankAccountNumber,
        bankAccountType: data.bankAccountType,
        accountTitle: data.accountTitle
    }

    return {
        fundingDataResponce: fundingData,
    }
}