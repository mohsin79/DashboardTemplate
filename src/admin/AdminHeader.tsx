import { FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'
import { AdminNavigation } from '../layout/user/AsideMenuData';

// import { Navigation } from "./AsideMenuData"
// import Topheader from './Topheader'

function AdminHeader() {

    const navigate = useNavigate();

    const handleLogOut = () => {

        localStorage.removeItem('userInfo');
        navigate("/")

    }

    return (
        <div className='container-fluid navmain'>
            <nav className="navbar navbar-expand-lg navbar-dark ml-3 ">
                <div className="w-25">
                    <img src={"http://10.0.12.48:5000/assets/img/logo.png"} className="imageDimension-class" alt="Guardian Trading-Logo" title='-Logo' style={{ width: " %" }} />
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav w-75">
                        {AdminNavigation.map((Nav, index) => (<li className="nav-item" key={`${Nav.text}-${index}`}>
                            <Link className={`nav-link text-light ${index === 0 ? 'active ' : ''}`} to={Nav.reference}>
                                {Nav.text}
                            </Link>
                        </li>
                        ))}
                    </ul>
                    <ul className="navbar-nav pr-2 w-100 justify-content-end">
                        <li className="nav-item">
                            <Link className='nav-link text-light nav-log-out-admin pr-0' to={"/"}> Hello, Sajjad Somjee <FaSignOutAlt /> </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default AdminHeader