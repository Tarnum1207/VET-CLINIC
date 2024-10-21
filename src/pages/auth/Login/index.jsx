import React from "react"

import LoginComponent from '../../../components/auth/Login/index'

import { Helmet } from 'react-helmet'

const LoginPage = () => {
    return (
        <>
            <Helmet>
                <title>Вход</title>
            </Helmet>
            <LoginComponent />
        </>
    )
}

export default LoginPage