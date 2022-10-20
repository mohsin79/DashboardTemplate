import { Form,  TabPanel } from 'devextreme-react';
import { ButtonItem, GroupItem } from 'devextreme-react/form.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import Loader from '../../../components/Loader/Loader.js';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook.js';
import { addBeneficiaryInfo, selectedBeneficiary, setBeneficialDetailScreen, setBeneficiaryInfo, showBeneficialPhoneValidation } from '../../../store/appreducer.js';
import ImageIframe from '../../../util/ImageIframe/ImageIframe.js';
import BeneficiaryDetail from './BeneficiaryDetail.js';

function Beneficiary() {

    const [data, setData] = useState<any>([]);
    const beneficialData = useAppSelector(e => e.appform.beneficialList);
    const beneficialDetailScreen = useAppSelector(e => e.appform.beneficialDetailScreen);
    const [loading, setLoading] = useState<boolean>(false);
    const selectedBeneficiaryIndex = useAppSelector(e => e.appform.selectedBeneficiaryIndex);
    const [selectedItem, setSelectedItem] = useState(beneficialData[0]);
    const [apiData, setApiData] = useState([]);
    // const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const dispatch = useAppDispatch();
    const formRef = useRef(null)

    useEffect(() => {
        if (beneficialData) {
            setLoading(true)
            setData([...beneficialData as any]);
            setTimeout(() => {
                setLoading(false)
            }, 600);
        }
    }, [beneficialData.length])

    const handleAddTab = async (e: any) => {
        const { isValid } = e.validationGroup.validate()
        if ((beneficialData.length - 1 === selectedBeneficiaryIndex) || beneficialData.length === 1) {
            if (isValid && (beneficialData[selectedBeneficiaryIndex].phoneNumber.length > 9)) {
                dispatch(addBeneficiaryInfo());
            } else {
                if (beneficialData[selectedBeneficiaryIndex].phoneNumber.length < 9) dispatch(showBeneficialPhoneValidation(true))
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            if (data && data.length > 0) {
                let Selected_iNDEX = data.length - 1
                if (Selected_iNDEX && Selected_iNDEX !== -1) {
                    dispatch(selectedBeneficiary(Selected_iNDEX))
                }
            }
        }, 500);
    }, [data.length])

    const handleBeneficialRecord = () => {
        dispatch(setBeneficialDetailScreen({ ["ImageFrameFlag"]: false }));
        if (document.body.style.overflow !== "hidden" && !beneficialDetailScreen.ImageFrameFlag) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "scroll";
        }
    }

    const addButtonHandler = {
        text: 'Add Beneficial',
        icon: "add",
        type: 'normal',
        useSubmitBehavior: true,
        onClick: (e: any) => {
            handleAddTab(e)
        }
    };

    const closeButtonHandler = useCallback((item: any, args: any) => {
        const newBeneficiary = [...beneficialData];
        const BeneficialApiData = [...apiData]
        newBeneficiary.splice(args, 1);
        BeneficialApiData.splice(args, 1)
        setApiData(BeneficialApiData)
        dispatch(setBeneficiaryInfo(newBeneficiary))
        dispatch(selectedBeneficiary(newBeneficiary.length - 1))
    }, [addBeneficiaryInfo, data]);

    const renderTitle = useCallback((title: any, args: any) => (
        <>
            <div>
                <span>
                    Beneficiary Details <span className='ml-2'> {args + 1} </span>
                </span>
                {data.length >= 2 && <i className="dx-icon dx-icon-close" onClick={(Cancel) => { closeButtonHandler(Cancel, args); }} />}
            </div>
        </>
    ), [data, closeButtonHandler]);

    const onSelectionChanged = useCallback((args: any) => {
        console.log(formRef)
        debugger
        let Index = data.indexOf(args.addedItems[0])
        if (Index !== -1) {
            dispatch(selectedBeneficiary(Index))
        }
    }, [data, setSelectedItem]);


    return (
        <>
            <div id="container">
                {beneficialDetailScreen.ImageFrameFlag && <ImageIframe Imageurl='http://localhost:3000/assets/pdf/PassportVERIFICATIONGuideline.pdf' ImageFrameFlag={beneficialDetailScreen.ImageFrameFlag} setImageFrameFlag={handleBeneficialRecord} />}
                <Loader loading={loading} />
                <Form
                    ref={formRef}
                    colCount={1}
                    showColonAfterLabel={false}
                    readOnly={false}
                    // tabIndex={index}
                    showValidationSummary={true}
                    validationGroup="customerData"
                    labelLocation="top">
                    <GroupItem >
                        <ButtonItem
                            horizontalAlignment="right"
                            cssClass={"buttonTxt mt-3"}
                            buttonOptions={addButtonHandler}
                        />
                    </GroupItem>
                </Form>
            </div>
            
            <div className='beneficial-shadow'>
                <TabPanel
                    dataSource={data}
                    itemTitleRender={renderTitle}
                    deferRendering={true}
                    showNavButtons={true}
                    selectedItem={data[selectedBeneficiaryIndex]}
                    onSelectionChanged={onSelectionChanged}
                    repaintChangesOnly={false}
                    selectedIndex={selectedBeneficiaryIndex}
                    itemComponent={BeneficiaryDetail}
                />
            </div>
            {/* </Sortable> */}
        </>
    );
}

export default Beneficiary;