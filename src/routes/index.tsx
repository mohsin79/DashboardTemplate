import { Routes, Route } from "react-router-dom";
import { userRoutes, adminRoutes } from './routeData';
import PrivateRoute from './wrapper';
import SignIn from "../pages/General/SignIn";
import SignUp from "../pages/General/SignUp";
import Layout from "../layout/user";
import ForgotPassword from "../pages/General/Forgot";
import Home from "../pages/user"
import { useEffect, useState } from "react";
import ResetPassword from "../pages/General/ResetPassword";
import AdminLayout from "../admin/layout";
import Dashboard from "../admin/pages/Dashboard/Dashboard";
import { token } from "../services/webstorage";
import EmailDetail from "../pages/user/EmailDetail";
import SidebarLayout from "../admin/SidebarLayout"

const Routers = () => {

    return (
        <Routes>

            <Route path="/admin" element={<AdminLayout />}>
                {/* <Route element={<PrivateRoute />}> */}
                <Route>
                    {adminRoutes.map(({ Component, route }) => <Route key={route} path={route} element={Component} />)}
                    {/* <Route path="*" element={<Dashboard />} /> */}
                    <Route path="*" element={<SidebarLayout />} />
                </Route>
            </Route>

            <Route path="/">
                <Route path="/" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="confirm/Verify2FA/:userId/:code" element={<ForgotPassword />} />
                <Route path="reset/Verify2FA/:userId/:code" element={<ForgotPassword />} />

                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route path='/home' element={<EmailDetail />} />
                        {userRoutes.map(({ Component, route }) => <Route key={route} path={route} element={Component} />)}
                        <Route path='*' element={<EmailDetail />} />
                    </Route>
                </Route>
            </Route>

        </Routes>


    )
}

export default Routers;