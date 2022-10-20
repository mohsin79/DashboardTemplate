import { ClickEvent } from 'devextreme/ui/button';
import { useForm } from '../../components/useFrom';
import { ApiRequestAsync } from '../../services/httpservice';
import { useNavigate, useParams } from 'react-router-dom';
import Form, { ButtonItem, GroupItem, Label, PatternRule, RequiredRule, SimpleItem } from 'devextreme-react/form';
import { useStore } from '../../store/store';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../../hooks/userStorage';
import { toastError, toastSuccess } from '../../util/toaster/Toaster';
import Loader from '../../components/Loader/Loader';
import { AddUserProps, UserEmail, UserFormType, UserRole } from '../../services/webstorage';
import { next } from '../../store/appreducer';
import { useAppDispatch } from '../../hooks/storehook';

const initialFValues = {
    RegistrationType: '',
    Product_you_want_to_trade: '',
    How_did_you_hear_about_us: '',
    customeremail: "",
    entity: ""
}

const RegistrationTypeData = [
    "Individual Account",
    "Limited Liability Company"
]


const ProductTrade = [
    "Stocks",
]

const hearAboutUs = [
    "Google", "Bloomberg", "Other"
]

let User_Role = "";
function EmailDetail() {
    const [usertype, setUserType] = useState<string>("support")
    /*  move the stepper function start  */
    // const [state, dispatch] = useStore();
    const [loader, setLoader] = useState(false);
    /*  move the stepper function end */
    const dispatch = useAppDispatch();

    const buttonOptionsNext = {
        text: 'Next',
        type: 'default',
        useSubmitBehavior: true,
        onClick: (e: any) => {
            handleSubmit(e)
        }
    }
    /*  handle the form submission start */
    const { values, setValues, errors, setErrors, handleInputChange } = useForm(initialFValues);

    useEffect(() => {
        setUserType(UserRole());
    }, []);

    // useEffect(() => {
    //  try {
    //     let applicationType = UserFormType()
    //     if(applicationType && applicationType !== "" ){
    //         dispatch(next());
    //     }
    //  } catch (error) {
    //     console.log(error);

    //  }
    // },[])

    const isFirstTime = useRef(true);
    const { traderId } = useParams();

    const handleApplicationData = (Data: any) => {
        try {
            if (Data) {
                const { data } = Data
                setValues({
                    ...values,
                    ["RegistrationType"]: data.applicationAccountType,
                    ['Product_you_want_to_trade']: data.productsToTrade,
                    ['How_did_you_hear_about_us']: data.whereDidYouHearAboutUs,
                    ['customeremail']: data.email,
                    ['entity']: ""
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        debugger
        if (!isFirstTime.current) {
            ApiRequestAsync("GET", "/admin/ExtendedAccountDetail", {
                identifierCode: traderId
            }).then(res => {
                handleApplicationData(res);
            })
        }
        isFirstTime.current = false;
    }, [traderId])

    const navigate = useNavigate();
    const handleSubmit = (e: ClickEvent) => {
        const { isValid } = e.validationGroup.validate();
        if (isValid) {
            const type = (RegistrationTypeData.indexOf(values.RegistrationType!) + 1) !== 1 ? 6 : 1;
            setLoader(true);
            ApiRequestAsync('POST', `/v2/Registration?applicationType=${type}&pageId=0`, {
                Email: values.customeremail || UserEmail(),
                ProductsToTrade: values.Product_you_want_to_trade,
                WhereDidYouHearAboutUs: values.How_did_you_hear_about_us,
                ApplicationAccountType: type
            }).then((c) => {
                AddUserProps("applicationType", type);
                setLoader(false);
                navigate(`/home/${type}/${c.data.formId}`);
                
            }).catch((error) => {
                setLoader(false)
                toastError(Array.isArray(error.response?.data) ? error.response.data.join(" ,") : error.message);
            });

        }




    }
    /*  handle the form submission end */

    return (
        <>
            <div className="row">
                <div className='col-md-1'></div>
                <div className="col-md-10 signUpBoxShadow my-5">
                    <div className="long-title"> <h3 className="fs-title">General Details</h3></div>
                    <Form
                        formData={initialFValues}
                        onFieldDataChanged={handleInputChange}
                        colCount={1}
                        showColonAfterLabel={false}
                        readOnly={false}
                        showValidationSummary={true}
                        validationGroup="customerData"
                        labelLocation="top">
                        <GroupItem colCount={4}>
                            {usertype !== "User" ? <SimpleItem dataField="customeremail" editorOptions={{
                                placeholder: '',
                                disabled: User_Role === "User"
                            }}
                                isRequired={true}>
                                <Label text="Customer's email" />
                                <RequiredRule
                                    message="Email is required"
                                />
                                <PatternRule
                                    pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$"
                                    message="Email is InValid"
                                /></SimpleItem> : null}
                            <SimpleItem colSpan={1} dataField="RegistrationType" editorType="dxSelectBox" editorOptions={{ dataSource: RegistrationTypeData, searchEnabled: true }} validationRules={[{ type: 'required', message: 'Registration Type is required.' }]} />
                            <SimpleItem colSpan={1} dataField="Product_you_want_to_trade" editorType="dxSelectBox" editorOptions={{ dataSource: ProductTrade }} validationRules={[{ type: 'required', message: 'Trade Product is required.' }]} />
                            <SimpleItem colSpan={1} dataField="How_did_you_hear_about_us" editorType="dxSelectBox" editorOptions={{ dataSource: hearAboutUs }} validationRules={[{ type: 'required', message: 'Source Information is required.' }]} />
                        </GroupItem>
                        <GroupItem colCount={1}>
                            <ButtonItem
                                horizontalAlignment="right"
                                colSpan={1}
                                buttonOptions={buttonOptionsNext}
                            />
                        </GroupItem>
                    </Form>
                </div>
                <div className='col-md-1'></div>
            </div>
            <Loader loading={loader} />
        </>
    )
}

export default EmailDetail; 