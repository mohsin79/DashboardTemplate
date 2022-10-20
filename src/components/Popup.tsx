import { CheckBox, Popup as DevPopup } from "devextreme-react";
import { FC } from 'react'
import { Position, ToolbarItem } from "devextreme-react/autocomplete";
import { EventObject } from "devextreme/events";
import Control from "./control";
import { IPopupOptions } from "devextreme-react/popup";

interface SignatureModalProps extends RequiredField<IPopupOptions, 'title'> {
    open: boolean,
    setOpen: any,
}

function Popup({ open, setOpen, children, ...options }: SignatureModalProps) {


    return (
        <div>
            <DevPopup
                visible={open}
                {...options}
            >
                {children}
            </DevPopup>
        </div>
    )
}

export default Popup;