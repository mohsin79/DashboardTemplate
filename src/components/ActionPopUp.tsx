import { CheckBox, Popup as DevPopup } from "devextreme-react";
import { FC } from 'react'
import { Position, ToolbarItem } from "devextreme-react/autocomplete";
import { EventObject } from "devextreme/events";
import Control from "./control";
import { IPopupOptions } from "devextreme-react/popup";

interface SignatureModalProps extends RequiredField<IPopupOptions, 'title'> {
    open: boolean,
    setOpen: any,
    submit?: () => void
}

function Popup({ open, setOpen, children, submit, ...options }: SignatureModalProps) {


    return (
        <div>
            <DevPopup
                visible={open}
                {...options}
            >

                {submit && <ToolbarItem
                    widget="dxButton"
                    toolbar="bottom"
                    location="before"
                    options={{
                        text: 'Submit',
                        onClick: submit,
                    }}
                />}
                <ToolbarItem
                    widget="dxButton"
                    toolbar="bottom"
                    location="after"
                    options={{
                        text: 'Close',
                        onClick: () => setOpen(false),
                    }}
                />
                {children}
            </DevPopup>
        </div>
    )
}

export default Popup;