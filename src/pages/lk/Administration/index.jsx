import React from "react"

import AdministrationComponent from '../../../components/lk/Administration/index'

import { Helmet } from "react-helmet"

const AdministrationPage = () => {
    return (
        <>
            <Helmet>
                <title>АДМИНИСТРИРОВАНИЕ</title>
            </Helmet>
            <AdministrationComponent />
        </>
    )
}

export default AdministrationPage