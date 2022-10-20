import TabPanel, { Item } from "devextreme-react/tab-panel";
import { useState } from "react";
import RequestGrid from '../../ApplicationGrid'
import { useAppDispatch } from '../../../hooks/storehook'
import { getUserThunk } from '../../../store/adminReducer'


const tabConfig = [{
    title: "All",
    icon: "floppy",
},
{
    title: "Pending",
    icon: "isnotblank",
},
{
    title: "Draft",
    icon: "comment",
}]


const defultState = {
    accountApplicationStatuses: [],
    accountEmail: "",
    accountOpeningClientId: 0,
    backOfficeAccountNumber: "",
    firmCode: [],
    identifierCodes: [],
    pageNumber: 1,
    pageSize: 30,
    searchEndDateTime: null,
    searchStartDateTime: null
}

function DashboardTab() {
    const dispatch = useAppDispatch();
    const handleChangeTab = (value: number) => {
        const flag =  value === 1 ? 2 : 1;  
        dispatch(getUserThunk({ ...defultState, accountApplicationStatuses: value === 0 ? [] : [flag] }))
    }
    return (

        <TabPanel onSelectedIndexChange={handleChangeTab} >
            {tabConfig.map((t, index) => (
                <Item title={t.title} key={t.title} icon={t.icon}>
                    <RequestGrid statusType={index} />
                </Item>
            ))}
        </TabPanel>
    )
}

export default DashboardTab;