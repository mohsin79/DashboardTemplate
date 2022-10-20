import Control from "../control";
import Popup from "../Popup";

interface SuccessModalProps {
    open: boolean,
    title: string,
    message: string,
    showTitle: boolean,
    buttonMessage: string,
    dragEnabled: boolean,
    showCloseButton: boolean,
    setOpen: any,
}

function SuccessPopUp({ title, showTitle, message, showCloseButton, open, setOpen, dragEnabled, buttonMessage }: SuccessModalProps) {

    const handleContinue = () => {
        try {
            setOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Popup
                visible={open}
                //   onHiding={this.hideInfo}
                // closeOnOutsideClick={() => setOpen(!open)}
                dragEnabled={dragEnabled}
                // hideOnOutsideClick={true}
                showCloseButton={showCloseButton}
                showTitle={showTitle}
                title={title}
                container=".dx-viewport"
                width={300}
                height={250}
                open={open}
                setOpen={setOpen}
            >

                <div className="row mt-4">
                    <div className="col-12 text-center">
                        {message}
                    </div>
                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <Control.Button className='btn btn-default bg-primary text-white button-width-icon-submit' style={{ marginRight: "12px" }} text={buttonMessage} onClick={handleContinue} />
                </div>
            </Popup>
        </div>
    );
}

export default SuccessPopUp;