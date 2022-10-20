import React, { useContext, useEffect } from 'react'
import PersonalDetails from './personalDetail'
import Stepper, { IStepDTO } from '../../components/Stepper'
import { useStore } from '../../store/store'
import { addAction } from '../../store/adminReducer'
import ProfessionalDetail from './ProfessionalDetail'
import IDinformation from './IDinformation'
import IncomeDetail from './IncomeDetail'
import RiskAcceptance from './RiskAcceptance'
import FinancialSituation from './FinancialSituation'
import IdentificationProof from './IdentificationProof'
import FundingDetails from './FundingDetails'
import Signature from './Signature'
import InvestmentExperience from './InvestmentExperience'
import Disclosure from './Disclosure'
import EmailDetail from './EmailDetail'
import ThanksPage from './ThanksPage'
import CompanyDetails from '../supportCompanyUser/companyDetails/companyDetails'
import BeneficiaryDetail from '../supportCompanyUser/BeneficiaryDetail/BeneficiaryDetail'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../hooks/storehook'
import Beneficiary from '../supportCompanyUser/BeneficiaryDetail/Beneficiary'

const stepsUser: IStepDTO[] = [
  { label: 'PERSONAL DETAILS', completed: true },
  { label: 'PROFESSIONAL DETAILS', completed: false },
  { label: 'ID INFORMATION', completed: false },
  { label: 'INCOME DETAILS', completed: false },
  { label: 'RISK ACCEPTANCE', completed: false },
  { label: 'FINANCIAL SITUATION', completed: false },
  { label: 'INVESTMENT EXPERIENCE', completed: false },
  { label: 'IDENTIFICATION PROOF UPLOAD', completed: false },
  { label: 'FUNDING DETAILS', completed: false },
  { label: 'DISCLOSURES', completed: false },
  { label: 'SIGNATURES', completed: false }
]

const stepsCompanyUser: IStepDTO[] = [
  { label: 'COMPANY DETAILS', completed: true },
  { label: 'BENEFICIARY DETAILS', completed: false },
  { label: 'INCOME DETAILS', completed: false },
  { label: 'RISK ACCEPTANCE', completed: false },
  { label: 'FINANCIAL SITUATION', completed: false },
  { label: 'INVESTMENT EXPERIENCE', completed: false },
  { label: 'FUNDING DETAILS', completed: false },
  { label: 'DISCLOSURES', completed: false },
  { label: 'SIGNATURES', completed: false },
]

const userSteps = (step: number) => {
  switch (step) {
    case 0: return <PersonalDetails />;
    case 1: return <ProfessionalDetail />;
    case 2: return <IDinformation />;
    case 3: return <IncomeDetail />;
    case 4: return <RiskAcceptance />;
    case 5: return <FinancialSituation />;
    case 6: return <InvestmentExperience />;
    case 7: return <IdentificationProof />;
    case 8: return <FundingDetails />;
    case 9: return <Disclosure />;
    case 10: return <Signature />;
    case 11: return <ThanksPage />;
    default: return <PersonalDetails />
  }
}
const companySteps = (step: number) => {
  try {
    switch (step) {
      case 0: return <CompanyDetails />;
      case 1: return <Beneficiary />;
      case 2: return <IncomeDetail />;
      case 3: return <RiskAcceptance />;
      case 4: return <FinancialSituation />;
      case 5: return <InvestmentExperience />;
      case 6: return <FundingDetails />;
      case 7: return <Disclosure />;
      case 8: return <Signature />;
      case 9: return <ThanksPage />;
      default: return <CompanyDetails />
    }
  } catch (error) {
    console.log(error)
  }
}

function Index() {

  const [state, dispatch] = useStore();
  const stepper = useAppSelector(e => e.appform.stepper);
  const { type } = useParams();

  const renderForm = () => {
    switch (+type!) {
      case 1: return userSteps(stepper);
      case 6: return companySteps(stepper);
    }

  }

  useEffect(() => {
    window.scrollTo(115, 115);
  }, [stepper])

  const StepperRender = () => {
    // @ts-ignore
    switch (+type) {
      case 1: return <Stepper activeStep={stepper} steps={stepsUser} />;
      case 6: return <Stepper activeStep={stepper} steps={stepsCompanyUser} />
    }
  }


  return (
    <>
      {StepperRender()}
      <div className="container">
        {renderForm()}
      </div>
    </>
  )
}

export default Index