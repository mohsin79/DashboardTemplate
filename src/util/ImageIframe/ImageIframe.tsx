import { Button } from 'devextreme-react';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';

interface ImageModalProps {
    ImageFrameFlag: boolean,
    setImageFrameFlag: any,
    Imageurl: string
}

function ImageIframe({ ImageFrameFlag, setImageFrameFlag, Imageurl }: ImageModalProps) {

    const handlePopUpHidden = () => {
        setImageFrameFlag(false);
        if (document.body.style.overflow !== "hidden") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "scroll";
        }
    }

    const closeButtonOptions = {
        text: 'Close',
        onClick: handlePopUpHidden,
    }

    return (
        <div className='scrollhost'>
            <Popup
                visible={ImageFrameFlag}
                //   onHiding={this.hideInfo}
                dragEnabled={false}
                //   hideOnParentScroll={true}
                hoverStateEnabled={true}
                showCloseButton={true}
                showTitle={true}
                title="Information"
                container="pop-up-view"
                // width={1000}
                // height={300}
                onHiding={handlePopUpHidden}
            >
                {/* <ToolbarItem
                    widget="dxButton"
                    toolbar="bottom"
                    location="after"
                    options={closeButtonOptions}
                /> */}
                <iframe style={{ width: "100%", height: "100%" }} frameBorder="0" src={Imageurl}>

                </iframe>
                <div className='d-flex justify-content-end mt-4' >
                <Button
                    //   disabled={disableButton()}
                    text="Close"
                    type="default"
                    onClick={handlePopUpHidden}
                /> 
                </div>
            </Popup>
        </div>
    )
}

export default ImageIframe;