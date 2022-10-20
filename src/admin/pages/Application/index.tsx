// import TabPanel, { Item } from "devextreme-react/tab-panel";
import RequestGrid from '../../ApplicationGrid'
import { useAppDispatch } from '../../../hooks/storehook'
import { getUserThunk } from '../../../store/adminReducer'

import {
    Container,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Divider,
    darken,
    lighten
} from '@mui/material';
import { useState, SyntheticEvent } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                // <Box sx={{ p: 3 }}>
                <Box>
                    {/* <Typography>{children}</Typography> */}
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// const tabConfig = [{
//     title: "Pending Approval",
//     icon: "isblank",
// },
// {
//     title: "Accepted",
//     icon: "isblank",
// },
// {
//     title: "Rejected",
//     icon: "isblank",
// },
// {
//     title: "Draft",
//     icon: "isblank",
// },
// {
//     title: "Trash",
//     icon: "isblank",
// }
// ]


// const defultState = {
//     accountApplicationStatuses: [],
//     accountEmail: "",
//     accountOpeningClientId: 0,
//     backOfficeAccountNumber: "",
//     firmCode: [],
//     identifierCodes: [],
//     pageNumber: 1,
//     pageSize: 30,
//     searchEndDateTime: null,
//     searchStartDateTime: null
// }

const  MuiTabs = {
    styleOverrides: {
      root: {
        height: 38,
        minHeight: 38,
        overflow: 'visible'
      },
      indicator: {
        height: 38,
        minHeight: 38,
        borderRadius: 6,
        border: '1px solid ' + darken("#5569ff", 0.2),
        boxShadow: '0px 2px 10px ' + lighten("#5569ff", 0.3)
      },
      scrollableX: {
        overflow: 'visible !important'
      }
    }
  }

function ApplicationTab() {
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // const [applicationStatus, setApplicationStatus] = useState(2);

    // const handleChangeTab = (e: number) => {
    //     if (e === 0) {
    //         setApplicationStatus(2)
    //     } else if (e === 1) {
    //         setApplicationStatus(3)
    //     } else if (e === 2) {
    //         setApplicationStatus(4)
    //     } else if (e === 3) {
    //         setApplicationStatus(1)
    //     } else if (e === 4) {
    //         setApplicationStatus(5)
    //     }
    // }
    // const dispatch = useAppDispatch();
    // const handleChangeTab = (value: number) => {
    //     const flag = value === 1 ? 2 : 1;
    //     dispatch(getUserThunk({ ...defultState, accountApplicationStatuses: value === 0 ? [] : [flag] }))
    // }
    return (
        <>
            <Container maxWidth={false} sx={{paddingTop: "20px", height: "100%"}}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    // spacing={3}
                    sx={{height: "100%"}}
                >
                    <Grid item xs={12} sx={{height: "100%"}}>
                        <Card sx={{height: "100%"}}>
                            <CardHeader title="Application" />
                            <Divider />
                            <CardContent className='TabsCardContainer' sx={{height: "100%"}}>
                                <Box sx={{ width: '100%', height: "100%" }}>
                                    <Tabs
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        textColor="primary"
                                        indicatorColor="primary"
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="application tabs"
                                        sx={{height: "100%"}}
                                    >
                                        <Tab label="Pending Approval" {...a11yProps(0)} />
                                        <Tab label="Accepted" {...a11yProps(1)} />
                                        <Tab label="Rejected" {...a11yProps(2)} />
                                        <Tab label="Draft" {...a11yProps(3)} />
                                        <Tab label="Trash" {...a11yProps(4)} />
                                    </Tabs>
                                    <TabPanel value={value} index={0}>
                                        <RequestGrid statusType={value} />
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        <RequestGrid statusType={value} />
                                    </TabPanel>
                                    <TabPanel value={value} index={2}>
                                        <RequestGrid statusType={value} />
                                    </TabPanel>
                                    <TabPanel value={value} index={3}>
                                        <RequestGrid statusType={value} />
                                    </TabPanel>
                                    <TabPanel value={value} index={4}>
                                        <RequestGrid statusType={value} />
                                    </TabPanel>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            {/* <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">

                        </div>
                        <div className="col-sm-6">

                        </div>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="container-fluid">
                    <TabPanel onSelectedIndexChange={handleChangeTab} >
                        {tabConfig.map((t, index) => (
                            <Item title={t.title} key={t.title} icon={t.icon}>
                                <RequestGrid statusType={applicationStatus} />
                            </Item>
                        ))}
                    </TabPanel>
                </div>
            </div> */}
        </>
    )
}

export default ApplicationTab;