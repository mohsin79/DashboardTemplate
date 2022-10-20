import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios";
import { BaseURL, BaseURLCommon } from "../services/httpservice";
import { token } from "../services/webstorage";
import { handleCountryCode, handleCountryName, handleImageArray, handleMartialStatus, handleValidGovtID } from "../util/common";
import { IAppSetting, IBeneficiary, IBeneficiaryDetail, ICompany, IDisclosure, IDisclosureSig, IFinancial, IFunding, IIdentityInformation, IIdentityProof, IIncomeDetail, IInvestment, IPersonal, IProfessional } from "./Interfaces"


interface IApplicationState {
    perosnal: IPersonal,
    professional: IProfessional,
    identityInfo: IIdentityInformation,
    incomeDetail: IIncomeDetail,
    investmentRiskTolerance: string,
    financial: IFinancial,
    investment: IInvestment,
    identityProof: IIdentityProof,
    funding: IFunding,
    disclosure: IDisclosure,
    dislosureAndSig: IDisclosureSig,
    company: ICompany,
    beneficialList: Array<IBeneficiary>,
    identityInfoList: Array<IIdentityInformation>,
    stepper: number,
    selectedItem: IBeneficiary,
    selectedBeneficiaryIndex: number,
    beneficialDetailScreen: IBeneficiaryDetail,
    beneficialPhoneValidation: boolean,
    applicationType: number,
    applicationAlreadyUpdated: boolean,
    appSettings: IAppSetting
    countryData: Array<object>;
}

const defaulPersonal: IPersonal = {
    firstName: '',
    lastName: '',
    address: '',
    aptOrSuite: '',
    country: '',
    countryName: '',
    state: '',
    city: '',
    zipCode: '',
    phoneNumber: '',
    numberOfDependents: '',
    maritalStatus: 'Single',
    isMailingAddressDifferent: false,
    maAddress: '',
    maAptOrSuite: '',
    maCountry: '',
    maCity: '',
    maState: '',
    maZipCode: '',
    isTrustedContactPersonAvailable: false,
    tcpName: '',
    tcpPhoneNumber: '',
    tcpAddress: '',
    tcpEmail: '',
    tcpCountry: '',
    tcpcountryName: '',
    tcpState: '',
    tcpCity: '',
    tcpZip: '',
    tcpRelationToAccountHolder: '',
    tcpDateOfBirth: null
}

const defaultBeneficiary: IBeneficiary = {
    firstName: '',
    lastName: '',
    address: '',
    aptOrSuite: '',
    country: '',
    countrycode: 'us',
    validatePhoneNumber: false,
    phoneNumber: '',
    validateNumber: false,
    state: '',
    city: '',
    zipCode: '',
    numberOfDependents: '',
    maritalStatus: 'Single',
    isMailingAddressDifferent: false,
    maAddress: '',
    maAptOrSuite: '',
    maCountry: '',
    maCity: '',
    maState: '',
    maZipCode: '',
    isTrustedContactPersonAvailable: false,
    tcpName: '',
    tcpPhoneNumber: '',
    countrytcpCode: 'us',
    validateTcpCountryCode: false,
    validateTcpNumber: false,
    tcpAddress: '',
    tcpEmail: '',
    tcpCountry: '',
    tcpCity: '',
    tcpZip: '',
    tcpRelationToAccountHolder: '',
    tcpDateOfBirth: null,
    boForm: null,
    ssn: '',
    dateOfBirth: null,
    validGovtIDType: '',
    idNumber: '',
    issuingCountry: '',
    issuingState: '',
    taxCountry: '',
    taxState: '',
    IssueDate: null,
    expirationDate: null,
    IdentificationProofType: "1",
    IdentificationProofTypeText: "Government Issued ID",
    frontIdentification: null,
    backIdentification: null,
}

const defaultIdentity: IIdentityInformation = {
    ssn: '',
    dateOfBirth: null,
    validGovtIDType: '',
    idNumber: '',
    taxCountry: '',
    taxState: '',
    issuingCountry: '',
    issuingState: '',
    issueDate: null,
    expirationDate: null
}

// Define the initial state using that type
const initialState: IApplicationState = {
    appSettings: {
        disclosures: [],
        incomeSource: [],
        investmentRisk: [],
        investmentType: [],
        knowedgeType: [],
        percentageRange: [],
        priceRange: [],
        priority: [],
        softwarePref: [],
        yearRange: []
    },
    stepper: 0,
    perosnal: { ...defaulPersonal },
    professional: {
        employerOrBusinessName: "",
        occupationOrComapnyType: "",
        address: "",
        employmentYearsOfExperience: "",
        country: "",
        state: "",
        city: "",
        aptOrSuite: "",
        employmentPhone: "",
        employmentFax: "",
    },
    identityInfo: { ...defaultIdentity },
    incomeDetail: {
        Annual_Income: -1,
        Net_Worth: -1,
        Liquid_Net_Worth: -1,
        TAX_RATE: -1
    },
    investmentRiskTolerance: "",
    financial: {
        ANNUAL_EXPENSES: -1,
        Special_Expenses: -1,
        Liquidity_Needs: -1,
        financial_goal: -1
    },
    investment: {
        assetClasses: [],
        educationInTradingMarkets: false,
        detailsEducationInTradingMarkets: "",
        incomeStrategy: "1",
        growthOfAccountStrategy: "1",
        speculationStrategy: "1",
        tradingStrategy: "1"
    },
    identityProof: {
        IdentificationType: "1",
        FrontImage: null,
        BackImage: null
    },
    funding: {
        Wages_Income: false,
        Savings: false,
        Pension: false,
        fundFromAnotherAccount: false,
        gift_Inheritance: false,
        other: false,
        saleofasset: false,
        otherIncomeSource: "",
        bankName: "",
        ABAOrSWIFT: "",
        bankAccountNumber: "",
        bankAccountType: "Checking",
        accountTitle: ""
    },
    disclosure: {
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
        subjectToBackupWitholdingReason: ""
    },
    dislosureAndSig: {
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
        UserSignature: null,
        UserSignatureName: ""
    },
    beneficialList: [{ ...defaultBeneficiary }],
    identityInfoList: [{ ...defaultIdentity }],
    applicationAlreadyUpdated: false,
    selectedBeneficiaryIndex: 0,
    beneficialPhoneValidation: false,
    applicationType: 0,
    countryData: [],
    selectedItem: { ...defaultBeneficiary },
    company: {
        Name: '',
        address: '',
        aptOrSuite: '',
        country: '',
        state: '',
        city: '',
        zipCode: '',
        phoneNumber: '',
        email: '',
        taxIdNum: '',
        isMailingAddressDifferent: false,
        mACompanyAddress: '',
        mACountry: '',
        mAAptOrSuite: '',
        mACity: '',
        mAState: '',
        mAZipCode: '',
        IdentificationProofType: "1",
        front: null,
        back: null,
        corporateDocumentOne: null,
        corporateDocumentTwo: null,
        corporateDocumentThree: null,
        corporateDocumentFour: null
    },
    beneficialDetailScreen: {
        ImageFrameFlag: false
    },
}

export const getUserData = createAsyncThunk('user/form', async (traderId: string, thunkApi) => {

    try {
        const response = await axios.get(`${BaseURL}/admin/ExtendedAccountDetail`, {
            params: {
                identifierCode: traderId
            },
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token()}`
            },
        })

        return thunkApi.fulfillWithValue<{ result: [any], totalCount: number }>(response.data);
    } catch (error) {
        return thunkApi.rejectWithValue(error)
    }
})

export const getAppSettings = createAsyncThunk('app/settings', async (_, thunkApi) => {

    try {
        const response = await axios.get(`${BaseURL}/v2/Common`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token()}`
            },
        })

        return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
        return thunkApi.rejectWithValue(error)
    }
})

export const getCountryData = createAsyncThunk('app/countryDropdownData', async (_, thunkApi) => {

    try {
        const response = await axios.get(`${BaseURLCommon}/Countries`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
        return thunkApi.rejectWithValue(error)
    }
})

export const appSlice = createSlice({
    name: 'appform',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setPerosnal: (state, action: PayloadAction<Partial<IPersonal>>) => {
            state.perosnal = { ...state.perosnal, ...action.payload }
        },
        setProfessional: (state, action: PayloadAction<Partial<IProfessional>>) => {
            state.professional = { ...state.professional, ...action.payload }
        },
        setIdentityInfo: (state, action: PayloadAction<Partial<IIdentityInformation>>) => {
            state.identityInfo = { ...state.identityInfo, ...action.payload }
        },
        setIncomeDetail: (state, action: PayloadAction<Partial<IIncomeDetail>>) => {
            state.incomeDetail = { ...state.incomeDetail, ...action.payload }
        },
        setRisk: (state, action: PayloadAction<string>) => {
            state.investmentRiskTolerance = action.payload
        },
        setFinancial: (state, action: PayloadAction<Partial<IFinancial>>) => {
            state.financial = { ...state.financial, ...action.payload }
        },
        setInvesment: (state, action: PayloadAction<Partial<IInvestment>>) => {
            state.investment = { ...state.investment, ...action.payload }
        },
        setIdentityProof: (state, action: PayloadAction<Partial<IIdentityProof>>) => {
            state.identityProof = { ...state.identityProof, ...action.payload }
        },
        setFunding: (state, action: PayloadAction<Partial<IFunding>>) => {
            state.funding = { ...state.funding, ...action.payload }
        },
        setDisclosure: (state, action: PayloadAction<Partial<IDisclosure>>) => {
            state.disclosure = { ...state.disclosure, ...action.payload }
        },
        setDisAndSig: (state, action: PayloadAction<Partial<IDisclosureSig>>) => {
            state.dislosureAndSig = { ...state.dislosureAndSig, ...action.payload }
        },
        addPerosnalList: (state) => {
            state.beneficialList.push(defaultBeneficiary);
        },
        addIdentityList: (state) => {
            state.identityInfoList.push(defaultIdentity);
        },
        setCompany: (state, action: PayloadAction<Partial<ICompany>>) => {
            state.company = { ...state.company, ...action.payload }
        },
        setBeneficialData: (state, action: PayloadAction<{ data: Partial<IBeneficiary>, index: number }>) => {
            // state.beneficialList[action.payload.index] = { ...state.beneficialList[action.payload.index], ...action.payload.data }
            state.beneficialList[state.selectedBeneficiaryIndex] = { ...state.beneficialList[state.selectedBeneficiaryIndex], ...action.payload.data }
        },
        setIdentityInfoList: (state, action: PayloadAction<{ data: Partial<IIdentityInformation>, index: number, field: any, property: any }>) => {
            state.identityInfoList[action.payload.index] = { ...state.identityInfoList[action.payload.index], ...action.payload.data };
        },
        next: (state) => {
            state.stepper = ++state.stepper;
            // state.stepper = 7;

        },
        previous: (state) => {
            state.stepper = --state.stepper;
        },
        resetPersonal: (state) => {
            state.perosnal = { ...defaulPersonal }
        },
        resetIdentityInfo: (state) => {
            state.identityInfo = { ...defaultIdentity }
        },
        resetStepper: (state) => {
            state.stepper = 0;
        },
        setBeneficiaryInfo: (state, action: any) => {
            state.beneficialList = [...action.payload];
        },
        addBeneficiaryInfo: (state) => {
            state.beneficialList = [...state.beneficialList, defaultBeneficiary];
        },
        selectedBeneficiary: (state, action: any) => {
            state.selectedBeneficiaryIndex = action.payload;
        },
        setBeneficialDetailScreen: (state, action: PayloadAction<Partial<IBeneficiaryDetail>>) => {
            state.beneficialDetailScreen = { ...state.beneficialDetailScreen, ...action.payload };
        },
        addedBeneficialData: (state, action: any) => {
            state.beneficialList = action.payload;
        },
        showBeneficialPhoneValidation: (state, action: any) => {
            state.beneficialPhoneValidation = action.payload;
        },
        applicationAlreadyExist: (state, action: any) => {
            state.applicationAlreadyUpdated = action.payload;
        },
        setCountryData: (state, action: any) => {
            state.countryData = action.payload;
        },

    },
    extraReducers(builder) {
        builder.addCase(getUserData.fulfilled, (state, action) => {
            const data: any = action.payload;
            state.applicationAlreadyUpdated = true
            if (data?.applicationAccountType) {
                state.applicationType = data.applicationAccountType
            }
            if (data.signupInitialCore?.length > 0 && data.applicationAccountType === 1) {
                const personalData = data.signupInitialCore[0]
                state.perosnal = {
                    ...defaulPersonal,
                    firstName: personalData.firstName,
                    lastName: personalData.lastName,
                    address: personalData.address,
                    aptOrSuite: personalData.aptOrSuite,
                    country: personalData.country,
                    state: personalData.state,
                    city: personalData.city,
                    zipCode: personalData.zipCode,
                    phoneNumber: personalData.phoneNumber,
                    numberOfDependents: personalData.numberOfDependents,
                    maritalStatus: handleMartialStatus(personalData.maritalStatus)!,
                    isMailingAddressDifferent: personalData.isMailingAddressDifferent === "true" ? true : false,
                    maAddress: personalData.maAddress,
                    maAptOrSuite: personalData.maAptOrSuite,
                    maCountry: personalData.maCountry,
                    maCity: personalData.maCity,
                    maState: personalData.maState,
                    maZipCode: personalData.maZipCode,
                    isTrustedContactPersonAvailable: personalData.isTrustedContactPersonAvailable === "true" ? true : false,
                    tcpName: personalData.tcpName,
                    tcpPhoneNumber: personalData.tcpPhoneNumber,
                    tcpAddress: personalData.tcpAddress,
                    tcpEmail: personalData.tcpEmail,
                    tcpCountry: personalData.tcpCountry,
                    tcpState: personalData.tcpState,
                    tcpCity: personalData.tcpCity,
                    tcpZip: personalData.tcpZip,
                    tcpRelationToAccountHolder: personalData.tcpRelationToAccountHolder,
                    tcpDateOfBirth: personalData.tcpDateOfBirth
                }
            }

            if (data.signupInitialCore && data.signupInitialCore.length > 0 && data.signupInitialCore[0]?.ssn !== "" && data.applicationAccountType === 1) {
                const identityInfo = data.signupInitialCore[0]
                state.identityInfo = {
                    ...defaultIdentity,
                    ssn: identityInfo.ssn,
                    dateOfBirth: identityInfo.dateOfBirth,
                    validGovtIDType: handleValidGovtID(identityInfo.validGovtIDType),
                    idNumber: identityInfo.idNumber,
                    issuingCountry: identityInfo.issuingCountry,
                    issuingState: identityInfo.issuingState,
                    taxCountry: identityInfo.taxCountry,
                    taxState: identityInfo.taxState,
                    issueDate: identityInfo.issueDate,
                    expirationDate: identityInfo.expirationDate,
                }
            }

            if (data.signupInitialCore && data.signupInitialCore.length > 0 && data.signupInitialCore[0]?.investmentRiskTolerance !== "" && data.applicationAccountType === 1) {
                const investmentRiskToleranceResponce = data.signupInitialCore[0]
                state.investmentRiskTolerance = investmentRiskToleranceResponce.investmentRiskTolerance
            }

            if (data.signupInitialCore && data.signupInitialCore.length > 0 && data.signupInitialCore[0]?.IdentificationType !== "") {
                const identityProofResponce = data.signupInitialCore[0]
                state.identityProof = {
                    IdentificationType: identityProofResponce.identificationProofType,
                    FrontImage: identityProofResponce.frontIdentification,
                    BackImage: identityProofResponce.backIdentification
                }
            }

            if (data.accountFunding) {
                const accountFundingResponce = data.accountFunding
                let applicationArray = []
                if (accountFundingResponce.incomeSource && accountFundingResponce.incomeSource !== "") applicationArray = JSON.parse(accountFundingResponce.incomeSource)
                state.funding = {
                    Wages_Income: applicationArray.includes("1") ? true : false,
                    Savings: applicationArray.includes("2") ? true : false,
                    Pension: applicationArray.includes("3") ? true : false,
                    fundFromAnotherAccount: applicationArray.includes("4") ? true : false,
                    gift_Inheritance: applicationArray.includes("5") ? true : false,
                    other: applicationArray.includes("6") ? true : false,
                    saleofasset: applicationArray.includes("7") ? true : false,
                    otherIncomeSource: accountFundingResponce.otherIncomeSource,
                    bankName: accountFundingResponce.bankName,
                    ABAOrSWIFT: accountFundingResponce.abaOrSWIFT,
                    bankAccountNumber: accountFundingResponce.bankAccountNumber,
                    bankAccountType: accountFundingResponce.bankAccountType,
                    accountTitle: accountFundingResponce.accountTitle
                }

            }

            if (data.otherData) {
                if (data.otherData?.annualIncome && data.otherData?.annualIncome?.toString() !== "") {
                    const incomeDetailResponce = data.otherData
                    state.incomeDetail = {
                        Annual_Income: incomeDetailResponce.annualIncome,
                        Net_Worth: incomeDetailResponce.netWorthExcludingResidence,
                        Liquid_Net_Worth: incomeDetailResponce.liquidNetWorth,
                        TAX_RATE: incomeDetailResponce.taxRate
                    }
                }

                if (data.otherData?.annualExpenses) {
                    const financialResponce = data.otherData
                    state.financial = {
                        ANNUAL_EXPENSES: financialResponce.annualExpenses,
                        Special_Expenses: financialResponce.specialExpenses,
                        Liquidity_Needs: financialResponce.liquidityNeeds,
                        financial_goal: financialResponce.timeToAchieveFinancialGoal
                    }
                }

                if (data.otherData?.guardianAddendumAgreement) {
                    const disclosureResponce = data.otherData
                    state.disclosure = {
                        abilityToBorrowFunds: disclosureResponce.abilityToBorrowFunds === "true" ? true : false,
                        guardianAddendumAgreement: disclosureResponce.guardianAddendumAgreement === "true" ? true : false,
                        availableInvestmentCapital: disclosureResponce.availableInvestmentCapital === "true" ? true : false,
                        involveHighRisk: disclosureResponce.involveHighRisk === "true" ? true : false,
                        objectivesWithAccount: disclosureResponce.objectivesWithAccount,
                        abilitytoWithstandLosingInvestment: disclosureResponce.abilitytoWithstandLosingInvestment === "true" ? true : false,
                        abilitytoWithstandLosingInvestmentReason: disclosureResponce.abilitytoWithstandLosingInvestmentReason,
                        initialDeposit: disclosureResponce.initialDeposit,
                        haveOtherBrokerageAccounts: disclosureResponce.haveOtherBrokerageAccounts === "true" ? true : false,
                        numberOfBrokerageAccounts: disclosureResponce.numberOfBrokerageAccounts,
                        haveOtherVelocityAccounts: disclosureResponce.haveOtherVelocityAccounts === "true" ? true : false,
                        haveOtherVelocityAccountsNumber: disclosureResponce.haveOtherVelocityAccountsNumber,
                        haveOtherVelocityAccountsName: disclosureResponce.haveOtherVelocityAccountsName,
                        knowAnyVelocityAccountHolder: disclosureResponce.knowAnyVelocityAccountHolder === "true" ? true : false,
                        knowAnyVelocityAccountHolderNumber: disclosureResponce.knowAnyVelocityAccountHolderNumber,
                        knowAnyVelocityAccountHolderName: disclosureResponce.knowAnyVelocityAccountHolderName,
                        knowAnyVelocityAccountHolderRelationship: disclosureResponce.knowAnyVelocityAccountHolderRelationship,
                        shareholderInPubliclyTradedCompany: disclosureResponce.shareholderInPubliclyTradedCompany === "true" ? true : false,
                        shareholderInPubliclyTradedCompanyName: disclosureResponce.shareholderInPubliclyTradedCompanyName,
                        shareholderInPubliclyTradedCompanyAddress: disclosureResponce.shareholderInPubliclyTradedCompanyAddress,
                        shareholderInPubliclyTradedCompanyRelationship: disclosureResponce.shareholderInPubliclyTradedCompanyRelationship,
                        registeredBrokerDealerSecuritiesExchangeOrFINRA: disclosureResponce.registeredBrokerDealerSecuritiesExchangeOrFINRA === "true" ? true : false,
                        registeredBrokerDealerSecuritiesExchangeOrFINRAName: disclosureResponce.registeredBrokerDealerSecuritiesExchangeOrFINRAName,
                        registeredBrokerDealerSecuritiesExchangeOrFINRAAddress: disclosureResponce.registeredBrokerDealerSecuritiesExchangeOrFINRAAddress,
                        registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile: disclosureResponce.registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile,
                        seniorOfficerAtFinancialInstitution: disclosureResponce.seniorOfficerAtFinancialInstitution === "true" ? true : false,
                        seniorOfficerAtFinancialInstitutionName: disclosureResponce.seniorOfficerAtFinancialInstitutionName,
                        seniorOfficerAtFinancialInstitutionAddress: disclosureResponce.seniorOfficerAtFinancialInstitutionAddress,
                        seniorOfficerAtFinancialInstitutionPosition: disclosureResponce.seniorOfficerAtFinancialInstitutionPosition,
                        knowAnyPublicOrPoliticalFigure: disclosureResponce.knowAnyPublicOrPoliticalFigure === "true" ? true : false,
                        knowAnyPublicOrPoliticalFigureName: disclosureResponce.knowAnyPublicOrPoliticalFigureName,
                        knowAnyPublicOrPoliticalFigurePosition: disclosureResponce.knowAnyPublicOrPoliticalFigurePosition,
                        knowAnyPublicOrPoliticalFigureRelationship: disclosureResponce.knowAnyPublicOrPoliticalFigureRelationship,
                        TaxWithholdingCertifications: disclosureResponce.taxWithholdingCertifications,
                        IsSubjectToBackupWitholding: disclosureResponce.IsSubjectToBackupWitholding === "true" ? true : false,
                        subjectToBackupWitholdingReason: disclosureResponce.subjectToBackupWitholdingReason
                    }
                }

                if (data.otherData?.accountTermsandConditions) {
                    const signatureResponce = data.otherData;
                    state.dislosureAndSig = {
                        accountTermsandConditions: signatureResponce.accountTermsandConditions === "true" ? true : false,
                        dayTradingRiskDisclosure: signatureResponce.dayTradingRiskDisclosure === "true" ? true : false,
                        pennyStockDisclosure: signatureResponce.pennyStockDisclosure === "true" ? true : false,
                        electronicAccessTradingAgreement: signatureResponce.electronicAccessTradingAgreement === "true" ? true : false,
                        marginDisclosureStatement: signatureResponce.marginDisclosureStatement === "true" ? true : false,
                        stockLocateAgreement: signatureResponce.stockLocateAgreement === "true" ? true : false,
                        marginAgreement: signatureResponce.marginAgreement === "true" ? true : false,
                        LiquidationNotice: signatureResponce.LiquidationNotice === "true" ? true : false,
                        softwarePreference: signatureResponce.softwarePreference === "true" ? true : false,
                        experienceInSelectedSoftware: signatureResponce.experienceInSelectedSoftware === "true" ? true : false,
                        isW8OrW9Forms: signatureResponce.isW8OrW9Forms,
                        taxStatus: signatureResponce.taxStatus,
                        experienceInSelectedSoftwareReason: signatureResponce.experienceInSelectedSoftwareReason,
                        electronicMailDeliveryAgreement: signatureResponce.electronicMailDeliveryAgreement === "true" ? true : false,
                        UserSignature: null,
                        UserSignatureName: ""
                    }

                    if (data.signupInitialCore && data.signupInitialCore.length > 0) {
                        const signatureResponceArray = data.signupInitialCore[0]
                        state.dislosureAndSig = {
                            ...state.dislosureAndSig,
                            UserSignature: signatureResponceArray?.userSignature,
                            UserSignatureName: signatureResponceArray?.UserSignatureName
                        }
                    }
                }
                if (data.otherData?.assetClasses) {
                    const assets = JSON.parse(data.otherData?.assetClasses) as Array<{ investmentTypeId: string, yearofExp: string, knowledgeTypeId: string }>;
                    for (let index = 0; index < assets.length; index++) {
                        const element = assets[index];
                        state.investment.assetClasses[index] = element;
                    }
                }

            }

            if (data.companyDetailsCore && data.companyDetailsCore?.name !== "" && data.applicationAccountType === 6) {
                const companyResponce = data.companyDetailsCore
                debugger
                state.company = {
                    Name: companyResponce.name,
                    address: companyResponce.address,
                    aptOrSuite: companyResponce.aptOrSuite,
                    country: companyResponce.country,
                    state: companyResponce.state,
                    city: companyResponce.city,
                    zipCode: companyResponce.zipCode,
                    phoneNumber: companyResponce.phoneNumber,
                    email: companyResponce.email,
                    taxIdNum: companyResponce.taxIdNum,
                    isMailingAddressDifferent: companyResponce.isMailingAddressDifferent === "true" ? true : false,
                    mACompanyAddress: companyResponce.maAddress,
                    mACountry: companyResponce.maCountry,
                    mAAptOrSuite: companyResponce.maAptOrSuite,
                    mACity: companyResponce.maCity,
                    mAState: companyResponce.maState,
                    mAZipCode: companyResponce.maZipCode,
                    IdentificationProofType: companyResponce.IdentificationProofType ? companyResponce.IdentificationProofType : "1",
                    front: companyResponce.front,
                    back: companyResponce.back,
                    corporateDocumentOne: companyResponce.corporateDocumentOne,
                    corporateDocumentTwo: companyResponce.corporateDocumentTwo,
                    corporateDocumentThree: companyResponce.corporateDocumentThree,
                    corporateDocumentFour: companyResponce.corporateDocumentFour
                }
            }

            if (data.signupInitialCore && data.signupInitialCore.length > 0 && data.signupInitialCore[0]?.ssn !== "" && data.applicationAccountType === 6) {
                let BeneficialArray: any = []
                let upcomingBeneficiaryData = data.signupInitialCore
                let BeneficiaryDataMutate = upcomingBeneficiaryData.map((Benefiary: any) => {
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

                state.beneficialList = BeneficialArray
            }
        });
        builder.addCase(getAppSettings.fulfilled, (state, action) => {
            state.appSettings = action.payload as unknown as IAppSetting;
            state.investment.assetClasses = state.appSettings.investmentType.map(i => ({ investmentTypeId: "", yearofExp: "", knowledgeTypeId: "" }));
        });
        builder.addCase(getCountryData.fulfilled, (state, action) => {
            console.log(action.payload);
            debugger
            state.countryData = action.payload as unknown as Array<object>;
        });
    },
})



export const { reducer: formReducer, } = appSlice;
export const { setPerosnal, setProfessional, addPerosnalList, setBeneficialData,
    addIdentityList, setIdentityInfo, setIdentityInfoList, setIncomeDetail, setRisk,
    setFinancial, setInvesment, setIdentityProof, setFunding, setCompany, setDisclosure, setDisAndSig,
    next, previous, resetIdentityInfo, resetPersonal, resetStepper, setCountryData,
    setBeneficiaryInfo, addBeneficiaryInfo, selectedBeneficiary, setBeneficialDetailScreen, addedBeneficialData, showBeneficialPhoneValidation, applicationAlreadyExist
} = appSlice.actions