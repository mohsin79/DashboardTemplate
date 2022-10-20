import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    PagingState,
    CustomPaging,
    DataTypeProvider,
    DataTypeProviderProps,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel,
} from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import { useAppDispatch, useAppSelector } from '../hooks/storehook';
import { getUserThunk } from '../store/adminReducer';
import '../Styles/Admin/pages.scss'
import { FaTrash, FaEnvelope, FaEye, FaPrint, FaExchangeAlt, FaWindowClose, FaCheckSquare } from 'react-icons/fa';
import Popup from '../components/ActionPopUp'
import { ApiRequestAsync, BaseURL } from '../services/httpservice';
import Control from '../components/control'
import { useNavigate } from 'react-router-dom';
import { DataGrid } from 'devextreme-react';
import { Column, Pager, Paging } from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import { LoadOptions } from 'devextreme/data';
import axios from 'axios';
import { token } from '../services/webstorage';
import ".././Styles/Admin/DataGrid.scss"

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
    2: { name: "Pending", Icon: <span className="badge badge-status badge-success">Pending </span> },
    3: { name: "Accpeted", Icon: <span className="badge-status badge-success">Accpeted </span> },
    4: { name: "Rejected", Icon: <span className="badge-status badge-success">Rejected </span> },
    5: { name: "Trash", Icon: <span className="badge-status badge-success">Trash </span> },
    6: { name: "Deleted", Icon: <span className="badge-status badge-danger">Deleted </span> }
}

const TooltipFormatter = ({
    row: { status },
}: { row: { status: number } }) => {
    // @ts-ignore
    return statusConfig[status].Icon
};

const StatusCell = (props: any) => (
    <DataTypeProvider
        for={['status']}
        formatterComponent={TooltipFormatter}
        {...props}
    />
);

const ActionFormatter = ({
    row: { status },
}: { row: { status: number } }) => {

    return (
        // @ts-ignore
        statusConfig[status].Icon
    );
};

const store = new CustomStore({
    key: 'OrderNumber',
    async load(loadOptions) {
        let params = '?';
        [
            'skip',
            'take',
            'requireTotalCount',
            'requireGroupCount',
            'sort',
            'filter',
            'totalSummary',
            'group',
            'groupSummary',
        ].forEach((i) => {
            //@ts-ignore
            if (i in loadOptions && !loadOptions[i]) { params += `${i}=${JSON.stringify(loadOptions[i])}&`; }
        });
        params = params.slice(0, -1);

        try {
            const response = await axios.post(`${BaseURL}/admin/AllAccountsSignupDetails`, {
                accountApplicationStatuses: [],
                accountEmail: "",
                accountOpeningClientId: 0,
                backOfficeAccountNumber: "",
                firmCode: [],
                identifierCodes: [],
                pageNumber: 0,
                pageSize: 30,
                searchEndDateTime: null,
                searchStartDateTime: null
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token()}`
                },
            });
            console.log(response)
            return {
                data: response.data,
                totalCount: response.data.totalCount,
                // summary: data.summary,
                // groupCount: data.groupCount,
            }
        } catch (error) {
            throw new Error('Data Loading Error');
        }

        // return fetch(`https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders${params}`)
        //     .then((response) => response.json())
        //     .then((data) => ({
        //         data: data.data,
        //         totalCount: data.totalCount,
        //         summary: data.summary,
        //         groupCount: data.groupCount,
        //     }))
        //     .catch(() => { throw new Error('Data Loading Error'); });
    },
});

const columns = [
    { name: 'fullName', title: 'Name', minColumnWidth: 80, },
    { name: 'email', title: 'Email' },
    { name: 'entity', title: 'Entity' },
    { name: 'createdOn', title: 'Date' },
    { name: 'status', title: 'Status' },
    {
        name: 'applicationAccountType', title: 'Account Type', getCellValue: (row: { data: { status: string | number; }; }) => {
            // @ts-ignore
            return row ? AccountType[row.applicationAccountType].name : undefined
        }
    },
    { name: 'Promo_Code', title: 'Promo Code' },
    { name: 'TrueId', title: 'TrueId' },
    { name: 'InstantId', title: 'InstantId' },
    { name: 'Fraudpoint', title: 'Fraudpoint' },
    { name: 'Bridger', title: 'Bridger' },
    { name: 'action', title: 'Actions', type: "actions", },
]

export default ({ statusType = 0 }: { statusType: number }) => {

    const dispatch = useAppDispatch();
    const isFirstTime = useRef(true);
    const selectedRow = useRef("");
    const [email, setEmail] = useState({
        emailSubject: "",
        emailBody: ""
    });

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState<IQueryRequest>({
        accountApplicationStatuses: statusType == 0 ? [] : [statusType],
        accountEmail: "",
        accountOpeningClientId: 0,
        backOfficeAccountNumber: "",
        firmCode: [],
        identifierCodes: [],
        pageNumber: 0,
        pageSize: 30,
        searchEndDateTime: null,
        searchStartDateTime: null
    })

    const handleStatus = () => {
        ApiRequestAsync("POST", "/Admin/AccountAction", {
            identifierCode: selectedRow.current,
            Status: 1,
            ReasonForUpdation: email.emailBody,
            email
        }).then(c => {
            selectedRow.current = "";
            setOpen(false);
            setQuery({ ...query });
        })
    }

    const records = useAppSelector(c => c.admin.userData);
    const totalRecord = useAppSelector(c => c.admin.totalCount);
    const showModal = (Id: string) => {
        selectedRow.current = Id;
        setOpen(true);
    }
    const hanldeApproveReject = (Id: string) => {
        selectedRow.current = Id;
        navigate(`/admin/userinfo/${Id}`);
    }

    const renderStatusCell = (data: any) => {
        //@ts-ignore
        return statusConfig[data.data.status].Icon;
    }

    const renderapplicationAccountTypeCell = (data: any) => {
        //@ts-ignore
        return AccountType[data.data.applicationAccountType].name;
    }

    const hanldeActionsbyStatus = useCallback((data: any) => {
        const { status, id } = data;

        switch (status) {
            case 1:
                // style={{ display: "flex", justifyContent: "space-around", alignItems: "center", }} remove on the lower div
                return <div>
                    <button data-toggle="tooltip" data-placement="top" title="Move to Trash" className="btn btn-dark btn-sm" style={{ marginRight: "6px" }} ><FaTrash /></button>
                    <button data-toggle="tooltip" data-placement="top" title="Draf Email" className="btn btn-warning btn-sm" style={{ marginRight: "6px" }}><FaEnvelope color="#FFFFFF" /></button>
                    <button data-toggle="tooltip" data-placement="top" title="View" className="btn btn-success btn-sm" style={{ marginRight: "6px" }}><FaEye /></button>
                </div>
                //    style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }} remove on the lower div
            case 2: return <div>
                <button data-toggle="tooltip" data-placement="top" title="View" className="btn btn-success btn-sm" style={{ marginRight: "6px" }}><FaEye /></button>
                <button data-placement="top" data-toggle="tooltip" title="Download" className="btn btn-success btn-sm" style={{ marginRight: "6px" }}> <FaPrint color="#FFFFFF" /></button>
                <button data-toggle="tooltip" onClick={() => showModal(id)} data-placement="top" title="Status Change" className="btn btn-warning btn-sm" style={{ marginRight: "6px" }}><FaExchangeAlt /></button>
                <button data-toggle="tooltip" data-placement="top" onClick={() => hanldeApproveReject(id)} title="Reject" className="btn btn-danger btn-sm" style={{ marginRight: "6px" }}><FaWindowClose /></button>
                <button data-toggle="tooltip" data-placement="top" onClick={() => hanldeApproveReject(id)} title="Approve" className="btn btn-info btn-sm" style={{ marginRight: "6px" }}> <FaCheckSquare /></button>
            </div>

            default:
                return <button data-toggle="tooltip" data-placement="top" title="View" className="btn btn-success btn-sm" ><FaEye /></button>;
        }
    }, [])

    const ActionCell = useCallback((props: any) => (
        <DataTypeProvider
            for={['action']}
            formatterComponent={hanldeActionsbyStatus}
            {...props}
        />
    ), []);

    const renderActionCell = (row: any) => {
        //@ts-ignore
        return hanldeActionsbyStatus(row.data);
    }

    useEffect(() => {
        if (!isFirstTime.current) {
            const params = { ...query };
            params.pageNumber = ++params.pageNumber;
            dispatch(getUserThunk(params))
        }
        isFirstTime.current = false;
    }, [statusType, query])
    console.log({ records })
    return (


        <div className="DevExtremeDataGripComponent" style={{ position: 'relative', margin: "10px 20px", height: "100%"}}>
            {/* @ts-ignore */}
            {/* <Grid
                rows={records}
                columns={columns}
            >
                <PagingState
                    currentPage={query.pageNumber}
                    onCurrentPageChange={(n) => setQuery({ ...query, pageNumber: n })}
                    pageSize={query.pageSize}
                    onPageSizeChange={(s) => setQuery({ ...query, pageSize: s })}
                />
                <CustomPaging
                    totalCount={totalRecord}
                />
                <StatusCell />
                <ActionCell />
                <Table />
                <TableHeaderRow />
                <PagingPanel pageSizes={allowedPageSizes} />
            </Grid> */}
            <DataGrid
                dataSource={records}
                keyExpr="email"
                showColumnLines={true}
                showRowLines={true}
                showBorders={true}
                remoteOperations={true}
                rowAlternationEnabled={true}
                columnAutoWidth={true}
                allowColumnResizing={true}
                style={{height: "100%"}}
            >
                {/* 
                <CustomPaging
                    totalCount={totalRecord}
                /> */}
                <Paging onPageIndexChange={(index) => { setQuery({ ...query, pageNumber: index }) }} onPageSizeChange={(size) => { setQuery({ ...query, pageSize: size }) }} pageIndex={query.pageNumber} pageSize={query.pageSize} defaultPageSize={10} />
                <Pager
                    visible={true}
                    allowedPageSizes={allowedPageSizes}
                    displayMode="full"
                    showPageSizeSelector={true}
                    showInfo={true}
                    showNavigationButtons={true} />
                <Column dataField="fullName" caption="Name" />
                <Column dataField="email" caption="Email" />
                <Column dataField="entity" caption="Entity" />
                <Column dataField="createdOn" caption="Date" dataType='date' format='MMM-dd-yyyy' />
                {/* @ts-ignore */}
                <Column dataField="status" caption="Status" alignment={"center"} cellRender={renderStatusCell} />
                <Column dataField="applicationAccountType" caption="Account Type" alignment={"left"} minWidth={160} cellRender={renderapplicationAccountTypeCell} />
                <Column dataField="Promo_Code" caption="Promo Code" />
                <Column dataField="TrueId" caption="TrueId" />
                <Column dataField="InstantId" caption="InstantId" />
                <Column dataField="Fraudpoint" caption="Fraudpoint" />
                <Column dataField="Bridger" caption="Bridger" />
                <Column dataField="action" caption="Actions" cellRender={renderActionCell} width={200} />
            </DataGrid>

            {/* {loading && <Loading />} */}
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

    );
};
