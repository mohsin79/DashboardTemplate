
type MaritialStatus = "S" | "M" | "D" | "W" | string;

interface Common {
    address: string,
    aptOrSuite?: string,
    country: string,
    state: string,
    city: string,
    zipCode: string
}

export interface IAppSetting {
    investmentRisk: Array<any>,
    incomeSource: Array<any>,
    investmentType: Array<any>,
    priceRange: Array<any>,
    percentageRange: Array<any>,
    yearRange: Array<any>,
    priority: Array<any>,
    knowedgeType: Array<any>,
    disclosures: Array<any>,
    softwarePref: Array<any>
}
export interface IPersonal {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    numberOfDependents: string,
    address: string,
    aptOrSuite?: string,
    country: string,
    countryName: string,
    state: string,
    city: string,
    zipCode: string,
    maritalStatus: string,
    isMailingAddressDifferent: boolean,
    maAddress: string,
    maAptOrSuite?: string,
    maCountry: string,
    maCity: string,
    maState: string,
    maZipCode: string,
    isTrustedContactPersonAvailable: boolean,
    tcpName: string,
    tcpPhoneNumber: string,
    tcpAddress: string,
    tcpEmail: string,
    tcpCountry: string,
    tcpcountryName: string,
    tcpCity: string,
    tcpState: string,
    tcpZip: string,
    tcpRelationToAccountHolder: string,
    tcpDateOfBirth: Date | null,
}

export interface ICompany extends Common {
    Name: string,
    backofficeAccountNo?: string,
    phoneNumber: string,
    address: string,
    email: string,
    taxIdNum: string,
    isMailingAddressDifferent: boolean,
    mACompanyAddress: string,
    mACountry: string,
    mAAptOrSuite: string,
    mACity: string,
    mAState: string,
    mAZipCode: string,
    IdentificationProofType: string,
    front: any,
    back: any,
    corporateDocumentOne: any,
    corporateDocumentTwo: any,
    corporateDocumentThree: any,
    corporateDocumentFour: any

}
export interface IProfessional extends Omit<Common, "zipCode"> {
    employerOrBusinessName: string,
    occupationOrComapnyType: string,
    employmentYearsOfExperience: string,
    employmentPhone: string,
    employmentFax: string,
}

export interface IIdentityInformation {
    ssn: string,
    dateOfBirth: Date | null,
    validGovtIDType: string,
    idNumber: string,
    taxCountry: string,
    taxState: string,
    issuingCountry: string,
    issuingState: string,
    issueDate: Date | null,
    expirationDate: Date | null,
}

export interface IIncomeDetail {
    Annual_Income: number,
    Net_Worth: number,
    Liquid_Net_Worth: number,
    TAX_RATE: number
}

export interface IFinancial {
    ANNUAL_EXPENSES: number,
    Special_Expenses: number,
    Liquidity_Needs: number,
    financial_goal: number
}

export interface IInvestment {
    assetClasses: Array<{ investmentTypeId: string, yearofExp: string, knowledgeTypeId: string }>,
    educationInTradingMarkets: boolean,
    detailsEducationInTradingMarkets: string,
    incomeStrategy: string,
    growthOfAccountStrategy: string,
    speculationStrategy: string,
    tradingStrategy: string
}

export interface IIdentityProof {
    IdentificationType: string,
    FrontImage: any,
    BackImage: any
}

type BankAccountType = "Checking" | "Saving" | ""

export interface IFunding {
    Wages_Income: boolean,
    Savings: boolean,
    Pension: boolean,
    fundFromAnotherAccount: boolean,
    gift_Inheritance: boolean,
    other: boolean,
    saleofasset: boolean,
    otherIncomeSource: string,
    bankName: string,
    ABAOrSWIFT: string,
    bankAccountNumber: string,
    bankAccountType: BankAccountType,
    accountTitle: string
}

export interface IDisclosure {
    abilityToBorrowFunds: boolean,
    guardianAddendumAgreement: boolean,
    availableInvestmentCapital: boolean,
    involveHighRisk: boolean,
    objectivesWithAccount: string,
    abilitytoWithstandLosingInvestment: boolean,
    abilitytoWithstandLosingInvestmentReason: string,
    initialDeposit: string,
    haveOtherBrokerageAccounts: boolean,
    numberOfBrokerageAccounts: string,
    haveOtherVelocityAccounts: boolean,
    haveOtherVelocityAccountsNumber: string,
    haveOtherVelocityAccountsName: string,
    knowAnyVelocityAccountHolder: boolean,
    knowAnyVelocityAccountHolderNumber: string,
    knowAnyVelocityAccountHolderName: string,
    knowAnyVelocityAccountHolderRelationship: string,
    shareholderInPubliclyTradedCompany: boolean,
    shareholderInPubliclyTradedCompanyName: string,
    shareholderInPubliclyTradedCompanyAddress: string,
    shareholderInPubliclyTradedCompanyRelationship: string,
    registeredBrokerDealerSecuritiesExchangeOrFINRA: boolean,
    registeredBrokerDealerSecuritiesExchangeOrFINRAName: string,
    registeredBrokerDealerSecuritiesExchangeOrFINRAAddress: string,
    registeredBrokerDealerSecuritiesExchangeOrFINRAPermissionToAccountOpeningFile: File | null,
    seniorOfficerAtFinancialInstitution: boolean,
    seniorOfficerAtFinancialInstitutionName: string,
    seniorOfficerAtFinancialInstitutionAddress: string,
    seniorOfficerAtFinancialInstitutionPosition: string,
    knowAnyPublicOrPoliticalFigure: boolean,
    knowAnyPublicOrPoliticalFigureName: string,
    knowAnyPublicOrPoliticalFigurePosition: string,
    knowAnyPublicOrPoliticalFigureRelationship: string,
    TaxWithholdingCertifications: string,
    IsSubjectToBackupWitholding: boolean,
    subjectToBackupWitholdingReason: string
}

export interface IDisclosureSig {
    accountTermsandConditions: boolean,
    dayTradingRiskDisclosure: boolean,
    pennyStockDisclosure: boolean,
    electronicAccessTradingAgreement: boolean,
    marginDisclosureStatement: boolean,
    stockLocateAgreement: boolean,
    marginAgreement: boolean,
    LiquidationNotice: boolean,
    softwarePreference: boolean,
    experienceInSelectedSoftware: boolean,
    isW8OrW9Forms: string,
    taxStatus: string,
    experienceInSelectedSoftwareReason: string,
    electronicMailDeliveryAgreement: boolean,
    UserSignature: File | null,
    UserSignatureName: string
}

export interface IBeneficiary extends Common {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    numberOfDependents: string,
    countrycode: string,
    validatePhoneNumber: boolean,
    validateNumber: boolean,
    maritalStatus: MaritialStatus,
    isMailingAddressDifferent: boolean,
    maAddress: string,
    maAptOrSuite?: string,
    maCountry: string,
    maCity: string,
    maState: string,
    maZipCode: string,
    isTrustedContactPersonAvailable: boolean,
    tcpName: string,
    tcpPhoneNumber: string,
    countrytcpCode: string,
    validateTcpCountryCode: boolean,
    validateTcpNumber: boolean,
    tcpAddress: string,
    tcpEmail: string,
    tcpCountry: string,
    tcpCity: string,
    tcpZip: string,
    tcpRelationToAccountHolder: string,
    tcpDateOfBirth: Date | null,
    boForm: File | null,
    ssn: string,
    dateOfBirth: Date | null,
    validGovtIDType: string,
    idNumber: string,
    issuingCountry: string,
    issuingState: string,
    taxCountry: string,
    taxState: string,
    IssueDate: Date | null,
    expirationDate: Date | null,
    IdentificationProofType: string,
    IdentificationProofTypeText: string,
    frontIdentification: File | null,
    backIdentification: File | null,
}

export interface IBeneficiaryDetail {
    ImageFrameFlag: boolean
}

export interface IUpdatedBenefiary {
    index: number,
    field: string,
    updatedValue: string
}

export interface IUpdateBeneficial {
    key: string,
    value: any,
}