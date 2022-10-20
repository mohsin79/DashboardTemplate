import { useEffect, useRef, useState } from "react";
import { ApiRequestAsync } from "../../../services/httpservice";
import "../../../Styles/Admin/Dashboard.scss"
import { cardData } from "../../data/DashboardData";
import DashboardTab from "./DashboardTab";
import { useAppDispatch } from '../../../hooks/storehook'
import { getUserThunk } from '../../../store/adminReducer'

interface IStatus {
    applicationStatus: string, count: number,
}

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

function Dashboard() {
    const isFirstTime = useRef(true);
    const [status, setStatus] = useState<typeof cardData>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isFirstTime.current === false) return
        ApiRequestAsync("GET", "/Admin/ApplicationsStatusCount", {}).then(res => {
            if (res.data) {
                setStatus(cardData.map((c) => {
                    const data = res.data.find((d: IStatus) => d.applicationStatus === c.status.toUpperCase());
                    return { ...c, count: data.count }
                }));
            }
        })
        // dispatch(getUserThunk(defultState));
        isFirstTime.current = false;
    }, [])


    return (
        <>
            <div className="content-header">
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
                    <div className="row">
                        {
                            status.map(({ icon: Icon, ...card }, index) =>
                            (
                                <div className="column info-box" key={card.status}>
                                    <div className="row" style={{ marginLeft: "0px" }} >
                                        <span className="info-box-icon elevation-1 my-2" style={{ backgroundColor: card.color }}>
                                            <Icon style={{ color: "FFF" }} />
                                        </span>
                                        <div className="info-box-content">
                                            <span className="info-box-text">
                                                {card.status}
                                            </span>
                                            <span className="info-box-number">
                                                {card.count}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <DashboardTab />
                </div>
            </div>
        </>
    )
}

export default Dashboard;