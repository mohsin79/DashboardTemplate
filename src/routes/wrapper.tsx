
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { token } from '../services/webstorage';

const RouterWrapper = () => {
    //Manage with Globaly
    let location = useLocation();
    // const signed = document.cookie === "something";
    const signed = !!token() || false;

    if (!signed) {
        return <Navigate to="/" state={{ from: location }} />;
    }
    // if (!signed) return <Route element={<Navigate to='/' />}  />;
    return <Outlet />;
};

export default RouterWrapper;