import React from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { Outlet, useNavigate } from 'react-router-dom'
import AdminHeader from './AdminHeader';
import Footer from './Footer';

interface AdminMainLayout {
    handleToggleSidebar: any,
    handleTogglecollapsed: any,
    collapsed: boolean,
    asideOpen: boolean,
    handleAsideOpen: any
}

const Main = ({ handleToggleSidebar, handleTogglecollapsed, handleAsideOpen, collapsed }: AdminMainLayout) => {

    const handleAsideMenuIcon = () => {
        handleToggleSidebar(true)
        handleAsideOpen()
    }
    const navigate = useNavigate();

    const handleAsideMenuMobileIcon = () => {
        handleTogglecollapsed(!collapsed)
        handleAsideOpen()
    }
    const handleSignOut = () => {
        localStorage.removeItem('userInfo');
        navigate("/")
    }


    return (
        <main className='content-wrapper'>
            {/* <div className='d-flex justify-content-between header-icon'>
                <header>
                    {window.innerWidth <= 768 ? <div onClick={handleAsideMenuIcon}>
                        <FaBars style={{ fontSize: '30px', color: 'gold' }} />
                    </div> :
                        <div onClick={handleAsideMenuMobileIcon}>
                            <FaBars />
                        </div>
                    }
                </header>
                <div className='d-flex'>
                    <div style={{ marginRight: "8px" }}>
                        Hello, Sajjad Somjee
                    </div>
                    <div>
                        <FaSignOutAlt onClick={handleSignOut} />
                    </div>
                </div>
            </div> */}
             <AdminHeader />
            {/* <div className="continer-fluid min-vh-100 d-flex flex-column"> */}
            <div className="continer-fluid d-flex flex-column mb-4">
                <Outlet />
            </div>

            <footer>
                <Footer />
            </footer>
        </main>
    );
};

export default Main;