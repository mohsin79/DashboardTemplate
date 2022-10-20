import { Button as DevButton,IButtonOptions } from 'devextreme-react/button';


const Button = (option:RequiredField<IButtonOptions,'onClick'>) => {
    return (
        <DevButton {...option}></DevButton>
    ) 
}

export default Button;