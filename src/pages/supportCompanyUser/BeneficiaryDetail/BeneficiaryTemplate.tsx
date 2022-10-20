import { Button, Form } from "devextreme-react";
import { ButtonItem, GroupItem } from "devextreme-react/form";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import { ApiRequestAsync } from "../../../services/httpservice";
import { toastError, toastSuccess } from "../../../util/toaster/Toaster";
import IdentificationProof from "../../user/IdentificationProof";
import IDinformation from "../../user/IDinformation";
import PersonalDetails from "../../user/personalDetail";

interface BeneficiaryTemplateProps {
    beneficialOwner: number,
}

function BeneficiaryTemplate({ beneficialOwner }: BeneficiaryTemplateProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [personalFormData, setPersonalFormData] = useState<object>({});
    const [IdInformationData, setIdInformationData] = useState<object>({});
    const [beneficialCertificate, setBeneficialCertificate] = useState<File | null>(null);
    const { type } = useParams();

    const previousForm = () => {
        try {
            // @ts-ignore
            dispatch({ type: 'STEPPER_INDEX', payload: --state.stepperIndex });
        } catch (error) {
            console.log(error)
        }
    }

    const handlePreviousButton = () => {
        try {
            previousForm()
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

    const NextStep = () => {
        try {
            // @ts-ignore
            dispatch({ type: 'STEPPER_INDEX', payload: ++state.stepperIndex });
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=2`, {
            
        }).then(c => {
            setLoading(false)
            NextStep();
            toastSuccess("Identification Proof added successfully");
        }).catch((error) => {
            setLoading(false)
            toastError(error?.message);
        })
    }

    const buttonOptionsNext = {
        text: 'Next',
        type: 'default',
        useSubmitBehavior: true,
        onClick: () => {
            handleSubmit()
        }
    }

    return (
        <div>
            <Loader loading={loading} />
            <h3> Beneficial Owner - {beneficialOwner + 1}</h3>
            <PersonalDetails beneficialCertificate={beneficialCertificate} setPersonal={setPersonalFormData}  setBeneficialCertificate={setBeneficialCertificate} />
            <div className="col-md-12" style={{ border: "1px solid #e5e5e5" }}> </div>
            <IDinformation setIdInformationData={setIdInformationData} />
            <div className="col-md-12" style={{ border: "1px solid #e5e5e5" }}> </div>
            {/* <IdentificationProof beneficialCertificate={beneficialCertificate} personalFormData={personalFormData} IdInformationData={IdInformationData} /> */}
        </div>
    )
}

export default BeneficiaryTemplate;