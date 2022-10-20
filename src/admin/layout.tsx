import React, { useState } from 'react';
import Main from './Main';
import "../Styles/Admin/AsideMenu.scss"
import SidebarLayout from './SidebarLayout';
import { SidebarProvider } from '../admin/contexts/SidebarContext';


function AdminLayout() {
    const [toggled, setToggled] = useState<boolean>(false);
    const [asideOpen, setAsideOpen] = useState<boolean>(false);
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const handleToggleSidebar = () => {
        setToggled(!toggled);
    };

    const handleTogglecollapsed = () => {
        setCollapsed(!collapsed);
        // if (window.innerWidth <= 768) {
        // setToggled(false);
        // }
    };

    const handleMouseEnter = () => {
        // if (window.innerWidth <= 768) {
        if (!asideOpen) setCollapsed(false);
        // }
    }

    const handleAsideOpen = () => {
        setAsideOpen(!asideOpen);
    }

    const handleMouseLeave = () => {
        // if (window.innerWidth <= 768) {
        if (!asideOpen) setCollapsed(true);
        // }
    }


    return (
        // <div className={`app-admin ${toggled ? 'toggled' : ''}`}>
        //     {/* <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
        //         <AsideMenu
        //             collapsed={collapsed}
        //             toggled={toggled}
        //             handleToggleSidebar={handleToggleSidebar}
        //         />
        //     </div> */}
        //     <Main
        //         handleToggleSidebar={handleToggleSidebar}
        //         handleTogglecollapsed={handleTogglecollapsed}
        //         handleAsideOpen={handleAsideOpen}
        //         collapsed={collapsed}
        //         asideOpen={asideOpen}
        //     />

        // </div>
        <SidebarProvider>
            <SidebarLayout />
        </SidebarProvider>
    )
}

export default AdminLayout;