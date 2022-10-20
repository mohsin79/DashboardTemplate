import { useNavigate } from "react-router-dom"
import Control from "../../components/control"
import { useAppDispatch } from "../../hooks/storehook";
import { resetStepper } from "../../store/appreducer";

function ThanksPage() {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleChange = () => {
        dispatch(resetStepper());
        navigate("/home")
    }

    return (
        <div className="my-4">
            <div className="row">
                <div className="col=md-1"></div>
                <div className="col-md-10 signUpBoxShadow ">
                    <div className="justify-content-center">
                        <h2 className="fs-title text-center">Thanks you!</h2>
                        <p className="text-center">
                            Your Application has been successfully submitted.
                        </p>
                        <div className="d-flex justify-content-center">
                            <Control.Button type="success" className='btn btn-default text-white w-25' icon="return" text='Redirect to Portal' onClick={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="col=md-1"></div>
            </div>
        </div>
    )
}

export default ThanksPage