import React from "react"
import UsersComponent from '../../../components/lk/Users/index'
import { Helmet } from "react-helmet"

const UsersPage = () => {
    return (
        <>
            <Helmet>
                <title>АДМИНИСТРИРОВАНИЕ :: ПОЛЬЗОВАТЕЛИ</title>
            </Helmet>
            <UsersComponent />
        </>
    )
}

export default UsersPage