import { Stepper as Rc_Stepper } from 'react-form-stepper';
import { StepDTO } from 'react-form-stepper/dist/components/Step/StepTypes'

function Stepper({ steps, activeStep = 0 }: { steps: StepDTO[], activeStep: number }) {

    return (
        <div className="stepper_hide">
            <Rc_Stepper
                steps={steps}
                styleConfig={{
                    activeBgColor: "#4290ca",
                    completedBgColor: "#4290ca",
                    activeTextColor: "white",
                    borderRadius: "50%",
                    circleFontSize: 20,
                    completedTextColor: "white",
                    fontWeight: "400",
                    inactiveBgColor: "#FFFFFF",
                    inactiveTextColor: "#252733",
                    labelFontSize: "0.75rem",
                    size: 41,
                }}
                connectorStyleConfig={{
                    disabledColor: "#4290ca",
                    activeColor: "#4290ca",
                    completedColor: "#4290ca",
                    size: 2,
                    stepSize: "2rem",
                    style: 'solid'
                }}
                activeStep={activeStep}
                hideConnectors={false}
                connectorStateColors={true}
            />
        </div>
    )
}


export default Stepper;

export type IStepDTO = StepDTO;