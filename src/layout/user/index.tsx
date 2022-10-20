import { LoadPanel } from 'devextreme-react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Footer from './Footer'
import Header from './Header'

const Layout: React.FC<{ children?: React.ReactElement }> = (props) => {

    return (
        <>
            <Header />
            <div className="continer-fluid min-vh-100 d-flex flex-column">
                {/* <div className="continer-fluid d-flex flex-column"> */}
                <ToastContainer />
                <Outlet />
            </div>
            <Footer />
        </>



    )
}

export default Layout