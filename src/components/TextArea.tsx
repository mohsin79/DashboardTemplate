import { TextArea as DevTextArea, ITextAreaOptions } from 'devextreme-react/text-area'


const TextArea = (props: RequiredField<ITextAreaOptions, 'value' | 'placeholder' >) => {
    return (
        <DevTextArea
            {...props}
        />
    )
}

export default TextArea;