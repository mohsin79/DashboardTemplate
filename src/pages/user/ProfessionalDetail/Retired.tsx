import axios from 'axios';
import { Form } from 'devextreme-react';
import { ButtonItem, GroupItem } from 'devextreme-react/form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Control from '../../../components/control'
import Loader from '../../../components/Loader/Loader';
import { useAppDispatch } from '../../../hooks/storehook';
import { ApiRequestAsync } from '../../../services/httpservice';
import { next, previous } from '../../../store/appreducer';
import { useStore } from '../../../store/store';
import { encryptFormData } from '../../../util/common';
import { toastError, toastSuccess } from '../../../util/toaster/Toaster';

const initialFValues = {
    employmentStatus: "R",
}

const Retired = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [errorShow, setErrorShow] = useState<Array<string>>([])

    const handleSubmit = () => {
        try {
            setLoading(true)
            ApiRequestAsync('POST', `/v2/Registration?applicationType=1&pageId=2`, encryptFormData(initialFValues)).then(() => {
                toastSuccess("Professional details added successfully");
                setLoading(false)
                dispatch(next());
            }).catch((error) => {
                setLoading(false)
                if (typeof error.response?.data === "object") {
                    setErrorShow(Object.values(error.response.data).flatMap(c => c) as Array<string>);
                } else {
                    toastError(error?.message);
                }
                // toastError(error?.message);
            })
        } catch (error) {
            console.log(error)
        }
    }


    const buttonOptionsPrevious = {
        text: 'Previous',
        type: 'normal',
        useSubmitBehavior: true,
        onClick: () => {
            dispatch(previous());
        }
    }

    const buttonOptionsNext = {
        text: 'Next',
        type: 'default',
        useSubmitBehavior: true,
        onClick: () => {
            handleSubmit()
        }
    }

    return (
        <>
            <Loader loading={loading} />
            <Form
                colCount={1}
                showColonAfterLabel={false}
                readOnly={false}
                showValidationSummary={true}
                validationGroup="customerData"
                labelLocation="top">
                <GroupItem colCount={31}>
                    <ButtonItem
                        horizontalAlignment="right"
                        colSpan={28}
                        cssClass={"buttonTxt mt-3"}
                        buttonOptions={buttonOptionsPrevious}
                    />
                    <ButtonItem
                        horizontalAlignment="right"
                        colSpan={3}
                        cssClass={"buttonTxt mt-3"}
                        buttonOptions={buttonOptionsNext}
                    />
                </GroupItem>
            </Form>
            {errorShow.map(c => <div className=" mt-2 dx-item dx-validationsummary-item"><div className="dx-item-content dx-validationsummary-item-content">{c}</div></div>)}
            {/* <div className='d-flex justify-content-end mt-4'>
                <Control.Button className='btn btn-default bg-primary text-white button-width' text='Previous' onClick={handlePreviousButton} />
                <Control.Button className='btn btn-default bg-primary text-white button-width' text='Next' onClick={handleSubmit} />
            </div> */}
        </>
    )
}

export default Retired;