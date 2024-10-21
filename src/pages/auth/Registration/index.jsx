import React from "react"

import RegistrationComponent from '../../../components/auth/Registration/index'

import { Helmet } from 'react-helmet'

const RegistrationPage = () => {
    return (
        <>
            <Helmet>
                <title>Регистрация</title>
            </Helmet>
            <RegistrationComponent />
        </>
    )
}

export default RegistrationPage