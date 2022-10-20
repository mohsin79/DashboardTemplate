import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/storehook';
import { applicationAlreadyExist, getAppSettings, getCountryData } from '../../store/appreducer';
import { Navigation } from "./AsideMenuData"
import Topheader from './Topheader'

function Header() {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isFirstTime = useRef(true);
  const isFirstTimeCountry = useRef(true);


  useEffect(() => {
    if (!isFirstTime.current)
      dispatch(getAppSettings());

    isFirstTime.current = false;
  }, [])

  useEffect(() => {
    if (!isFirstTimeCountry.current)
      dispatch(getCountryData());

    isFirstTimeCountry.current = false;
  }, [])

  const handleLogOut = () => {
    localStorage.removeItem('userInfo');
    dispatch(applicationAlreadyExist(false))
    navigate("/")

  }

  return (
    <div className='container-fluid navmain'>
      <Topheader />
      <nav className="navbar navbar-expand-lg navbar-dark ">
        <img src={"http://10.0.12.48:5000/assets/img/logo.png"} className="imageDimension-class" alt="Guardian Trading-Logo" title='-Logo' style={{ width: " %" }} />
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav w-100 justify-content-center">
            {Navigation.map((Nav, index) => (
              <li className="nav-item" key={`${Nav.text}-${index}`}>
                <Link className={`nav-link text-light ${index === 0 ? 'active ' : ''}`} to={Nav.reference}>
                  {Nav.text}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="login-area pr-2">
            {/* <li>
              <a className="nav-link nav-log-out" href="/logout">Logout</a>
            </li> */}
            <Link className='nav-link nav-log-out' to={"/"} onClick={handleLogOut} > Logout </Link>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Header