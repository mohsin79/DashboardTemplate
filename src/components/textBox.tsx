import { TextBox as DevTextBox, ITextBoxOptions } from 'devextreme-react/text-box'


const TextBox = (props: RequiredField<ITextBoxOptions, 'value' | 'placeholder'>) => {
    return (
        <DevTextBox
            {...props}
        />
    )
}

export default TextBox;