import React from "react"

import StatComponent from '../../../components/lk/Stat/index'

import { Helmet } from "react-helmet"

const StatPage = () => {
    return (
        <>
            <Helmet>
                <title>АДМИНИСТРИРОВАНИЕ :: СТАТИСТИКА</title>
            </Helmet>
            <StatComponent />
        </>
    )
}

export default StatPage