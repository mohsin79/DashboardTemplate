import { DataGrid, Tooltip } from "devextreme-react";
import { FaCheckSquare, FaExchangeAlt, FaEye, FaPrint, FaWindowClose, FaEnvelope, FaTrash } from "react-icons/fa";
import ArrayStore from 'devextreme/data/array_store';
import "../Styles/Admin/DataGrid.scss"
import { Column, ColumnChooser, ColumnFixing, Pager, Paging, Scrolling, SearchPanel, StateStoring } from "devextreme-react/data-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiRequestAsync } from "../services/httpservice";
import { useAppSelector, useAppDispatch } from '../hooks/storehook'
import { getUserThunk } from '../store/adminReducer'
import Popup from '../components/ActionPopUp'
import Control from '../components/control'
import CustomStore from "devextreme/data/custom_store";
import { LoadOptions } from "devextreme/data";

const allowedPageSizes = [10, 30, 50, 100];
interface IQueryRequest {
    accountEmail: string,
    pageSize: number,
    pageNumber: number,
    searchStartDateTime: string | null,
    searchEndDateTime: string | null,
    identifierCodes: [string?],
    accountApplicationStatuses: [number?],
    firmCode: [string?],
    accountOpeningClientId: number,
    backOfficeAccountNumber: string
}


// const store = new CustomStore({
//     key: 'OrderNumber',

//     load(loadOptions: LoadOptions) {
//         let params = '?';
//         [
//             'skip',
//             'take',
//             'requireTotalCount',
//             'requireGroupCount',
//             'sort',
//             'filter',
//             'totalSummary',
//             'group',
//             'groupSummary',
//         ].forEach((i) => {
//             if (i in loadOptions && isNotEmpty(loadOptions[i])) { params += `${i}=${JSON.stringify(loadOptions[i])}&`; }
//         });
//         params = params.slice(0, -1);
//         return fetch(`https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders${params}`)
//             .then((response) => response.json())
//             .then((data) => ({
//                 data: data.data,
//                 totalCount: data.totalCount,
//                 summary: data.summary,
//                 groupCount: data.groupCount,
//             }))
//             .catch(() => { throw new Error('Data Loading Error'); });
//     },
// });



const AccountType = {
    1: { name: "Individual Account" },
    2: { name: "Limited Liability Company" },
    3: { name: "" },
    4: { name: "" },
    5: { name: "" },
    6: { name: "Limited Liability Company" },
    7: { name: "" },
    8: { name: "" },
    9: { name: "" },
    10: { name: "" },
}

const statusConfig = {
    0: { name: "All", Icon: <span className="badge-status badge-info">N/A </span> },
    1: { name: "Draft", Icon: <span className="badge-status badge-warning">Draft </span> },
    2: { name: "Pending", Icon: <span className="badge-status badge-success">Pending </span> },
    3: { name: "Accpeted", Icon: <span className="badge-status badge-success">Accpeted </span> },
    4: { name: "Rejected", Icon: <span className="badge-status badge-success">Rejected </span> },
    5: { name: "Trash", Icon: <span className="badge-status badge-success">Trash </span> },
    6: { name: "Deleted", Icon: <span className="badge-status badge-danger">Deleted </span> }
}

let isFirst = true;

function ApplicationGird({ statusType = 0 }: { statusType: number }) {

    const isFirstTime = useRef(true);
    const selectedRow = useRef("");
    const [email, setEmail] = useState({
        emailSubject: "",
        emailBody: ""
    });
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const [query, setQuery] = useState<IQueryRequest>({
        accountApplicationStatuses: statusType == 0 ? [] : [statusType],
        accountEmail: "",
        accountOpeningClientId: 0,
        backOfficeAccountNumber: "",
        firmCode: [],
        identifierCodes: [],
        pageNumber: 1,
        pageSize: 30,
        searchEndDateTime: null,
        searchStartDateTime: null
    })

    const records = useAppSelector(c => c.admin.userData);
    console.log("render");
    useEffect(() => {
        if (!isFirstTime.current)
            dispatch(getUserThunk(query))

        isFirstTime.current = false;
    }, [statusType])


    const handleStatus = () => {
        ApiRequestAsync("POST", "/Admin/AccountAction", {
            identifierCode: selectedRow.current,
            Status: 1,
            ReasonForUpdation: email.emailBody,
            email
        })
    }
    const showModal = (Id: string) => {
        selectedRow.current = Id;
        setOpen(true);
    }
    const hanldeActionsbyStatus = useCallback(({ data }: any) => {
        const { status, id } = data;

        switch (status) {
            case 1:
                return <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", }}>
                    <button data-toggle="tooltip" data-placement="top" title="Move to Trash" className="btn btn-dark btn-sm" ><FaTrash /></button>
                    <button data-toggle="tooltip" data-placement="top" title="Draf Email" className="btn btn-warning btn-sm" ><FaEnvelope color="#FFFFFF" /></button>
                    <button data-toggle="tooltip" data-placement="top" title="View" className="btn btn-success btn-sm" ><FaEye /></button>
                </div>
            case 2: return <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                <button data-toggle="tooltip" data-placement="top" title="View" className="btn btn-success btn-sm" ><FaEye /></button>
                <button data-placement="top" data-toggle="tooltip" title="Download" className="btn btn-success btn-sm"> <FaPrint color="#FFFFFF" /></button>
                <button data-toggle="tooltip" onClick={() => showModal(id)} data-placement="top" title="Status Change" className="btn btn-warning btn-sm"><FaExchangeAlt /></button>
                <button data-toggle="tooltip" data-placement="top" title="Reject" className="btn btn-danger btn-sm" ><FaWindowClose /></button>
                <button data-toggle="tooltip" data-placement="top" title="Approve" className="btn btn-info btn-sm" > <FaCheckSquare /></button>
            </div>

            default:
                return <button data-toggle="tooltip" data-placement="top" title="View" className="btn btn-success btn-sm" ><FaEye /></button>;
        }
    }, [])

    const renderTrueIdCell = (data: any) => {
        if (data.data.TrueId) {
            return <div className="custom-icons">
                <button data-toggle="tooltip" title="TrueId" className="btn btn-success btn-sm" >
                    <FaEye />
                </button>
            </div>
        } else {
            return <div className="custom-icons">
                <button data-toggle="tooltip" title="TrueId" className="btn btn-success btn-sm" >
                    <FaEye />
                </button>
            </div>
        }
    }


    const renderFraudpointCell = (data: any) => {
        if (data.data.Fraudpoint) {
            return <div className="custom-icons">
                <button data-toggle="tooltip" title="Fraudpoint" className="btn btn-success btn-sm" >
                    <FaEye />
                </button>
            </div>
        } else {
            return <div className="custom-icons">
                <button data-toggle="tooltip" title="Fraudpoint" className="btn btn-success btn-sm" >
                    <FaEye />
                </button>
            </div>
        }
    }

    const renderBridgerCell = (data: any) => {
        if (data.data.Bridger) {
            return <div className="custom-icons">
                <button data-toggle="tooltip" title="Bridger" className="btn btn-success btn-sm" >
                    <FaEye />
                </button>
            </div>
        } else {
            return <div className="custom-icons">
                <button data-toggle="tooltip" title="Bridger" className="btn btn-success btn-sm" >
                    <FaEye />
                </button>
            </div>
        }
    }

    const renderStatusCell = (data: any) => {
        //@ts-ignore
        return statusConfig[data.data.status].Icon;
    }

    return (
        <>
            <div className="row">
                <div className="col-12 card-body table-responsive card-body-color py-4 px-4 h-100" style={{ overflow: "auto", height: "68vh !important" }}>
                    <DataGrid
                        id="gridContainer"
                        dataSource={records}
                        keyExpr="id"
                        allowColumnReordering={true}
                        allowColumnResizing={true}
                        columnAutoWidth={true}
                        showBorders={true}
                    >
                        <StateStoring
                            enabled={true}
                            type="custom"
                        />
                        <SearchPanel visible={true}
                            width={280}
                            placeholder="Search..." />
                        <Paging onPageIndexChange={(index) => { isFirstTime.current = false; setQuery({ ...query, pageNumber: index }) }} onPageSizeChange={(size) => { isFirstTime.current = false; setQuery({ ...query, pageSize: size }) }} pageIndex={query.pageNumber} pageSize={query.pageSize} defaultPageSize={10} />
                        <Pager
                            visible={true}
                            allowedPageSizes={allowedPageSizes}
                            displayMode="full"
                            showPageSizeSelector={true}
                            showInfo={true}
                            showNavigationButtons={true} />
                        {/* <Scrolling columnRenderingMode="virtual" /> */}
                        <Column
                            dataField="fullName"
                            caption="Name"
                        />
                        <Column
                            dataField="email"
                            caption="Email"
                        />
                        <Column
                            dataField="Entity"
                        />
                        <Column
                            dataField="createdOn"
                            caption="Date"
                        />
                        <Column
                            dataField="Status"
                            cellRender={renderStatusCell}
                        />
                        <Column
                            dataField="applicationAccountType"
                            caption="Account Type"
                            // @ts-ignore
                            customizeText={(cell) => AccountType[cell.value].name}
                        />
                        <Column
                            dataField="Promo_Code"
                        />
                        <Column
                            dataField="TrueId"
                            cellRender={renderTrueIdCell}
                        />
                        <Column
                            dataField="InstantId"
                            width={"5%"}
                        />
                        <Column
                            dataField="Fraudpoint"
                            cellRender={renderFraudpointCell}
                        />
                        <Column
                            dataField="Bridger"
                            cellRender={renderBridgerCell}
                        />
                        <Column
                            type="buttons"
                            width={200}
                            cellRender={hanldeActionsbyStatus}
                        />
                    </DataGrid>
                </div>
                <Popup open={open} width={400}
                    height={350} setOpen={setOpen} title="Update Application Status"
                    dragEnabled={true}
                    submit={handleStatus}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly"
                    }}
                >
                    <Control.TextBox height={45} label="Subject" value={email.emailSubject} onValueChange={(value) => setEmail({ ...email, emailSubject: value })} placeholder="" />
                    <Control.TextArea label="Reason" height={140} value={email.emailBody} onValueChange={(value) => setEmail({ ...email, emailBody: value })} placeholder="" />
                </Popup>

            </div>
        </>
    )
}

export default ApplicationGird;