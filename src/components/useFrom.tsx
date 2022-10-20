import { FieldDataChangedEvent } from 'devextreme/ui/form';
import { useCallback, useState, useRef, ChangeEvent, FunctionComponentFactory } from 'react'
import moment from "moment"


export function useForm<T extends Object>(initialFValues: Partial<T>, validateOnChange = false, validate: Function | null = null) {

    const [values, setValues] = useState(initialFValues);
    const [errors, setErrors] = useState<typeof initialFValues>({});

    const handleInputChange = useCallback((e: FieldDataChangedEvent) => {
        const { dataField: name, value } = e
        let _value = value;

        if (typeof _value === "string") {
            _value = _value.trimStart()
        }

        if (typeof _value === "object") {
            _value = moment(_value).format("DD MMM yyyy")
        }

        if (name!.includes(".")) {
            const childe = name!.split(".");
            setValues({
                ...values,
                [childe[0]]: { [childe[1]]: _value }
            })
        }
        else {
            if (name === "other" && !_value) {
                setValues({
                    ...values,
                    [name!]: _value,
                    ["otherIncomeSource"]: ""
                })
            } else {
                if (typeof _value === "number") {
                    setValues({
                        ...values,
                        [name!]: _value.toString()
                    })
                } else {
                    setValues({
                        ...values,
                        [name!]: _value
                    })
                }
            }
        }

    }, [values])

    const resetError = () => {
        setErrors({});
    }
    const resetForm = () => {
        resetError();
        setValues(initialFValues);
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        // resetError,
        // resetForm
    }
}



export function Form({ children, onSubmit, ...others }: { children: JSX.Element, onSubmit: React.FormEventHandler<HTMLFormElement> | undefined }) {

    return (
        <form onSubmit={onSubmit} autoComplete="off" {...others}>
            {children}
        </form>
    )
}