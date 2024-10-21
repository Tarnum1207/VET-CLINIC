import React from "react";

import { useNavigate } from "react-router-dom";

import { Outlet } from 'react-router-dom';

const Layout = () => {
    
    const navigate = useNavigate();

    if (!localStorage.getItem('user_id')){
        navigate('/landing')
    } else {
        navigate('/lk/profile')
    }

    return <>
        <Outlet />
    </>
}

export default Layout
