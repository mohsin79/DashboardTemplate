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
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { getAdminUserThunk, getUserThunk } from '../../../store/adminReducer';
import { FaTrash, FaEnvelope, FaEye, FaPrint, FaExchangeAlt, FaWindowClose, FaCheckSquare } from 'react-icons/fa';
import { ApiRequestAsync } from '../../../services/httpservice';
import Control from '../../../components/control'
import { useNavigate } from 'react-router-dom';
import { DataGrid } from 'devextreme-react';
import { Column, Pager, Paging } from 'devextreme-react/data-grid';

const allowedPageSizes = [10, 30, 50, 100];
interface IQueryRequest {

    pageSize: number,
    pageNumber: number,

}

const columns = [
    { name: 'userName', title: 'User Name' },
    { name: 'email', title: 'User Email' },
    { name: 'role', title: 'User Role' },
    { name: 'action', title: 'Actions', type: "actions", },
]

const UserList = () => {

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
        pageNumber: 0,
        pageSize: 30
    })


    const records = useAppSelector(c => c.admin.adminUser);
    const totalRecord = useAppSelector(c => c.admin.adminUserCount);
    const showModal = (Id: string) => {
        selectedRow.current = Id;
        setOpen(true);
    }
    const hanldeApproveReject = (Id: string) => {
        selectedRow.current = Id;
        navigate(`/admin/userinfo/${Id}`);
    }
    const hanldeActionsbyStatus = useCallback((data: any) => {
        const { status, id } = data.row;

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
                <button data-toggle="tooltip" data-placement="top" onClick={() => hanldeApproveReject(id)} title="Reject" className="btn btn-danger btn-sm" ><FaWindowClose /></button>
                <button data-toggle="tooltip" data-placement="top" onClick={() => hanldeApproveReject(id)} title="Approve" className="btn btn-info btn-sm" > <FaCheckSquare /></button>
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

    useEffect(() => {
        if (!isFirstTime.current) {
            const params = { ...query };
            params.pageNumber = ++params.pageNumber;
            dispatch(getAdminUserThunk(params))
        }

        isFirstTime.current = false;
    }, [query])
    console.log({ records })
    return (


        <div className="" style={{ position: 'relative', margin: "10px 20px" }}>
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
                <Column dataField="userName" caption="Name" />
                <Column dataField="email" caption="Email" />
                <Column dataField="role" caption="Entity" />
                <Column dataField="action" caption="Date" dataType='date' format='MMM-dd-yyyy' />
             
                
            </DataGrid>
            {/* {loading && <Loading />} */}
        </div>

    );
};

export default UserList;