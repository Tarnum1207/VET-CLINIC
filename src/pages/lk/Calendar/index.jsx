import React from "react"

import { Helmet } from "react-helmet"

import CalendarComponent from '../../../components/lk/Calendar/index'

const CalendarPage = () => {
    return (
        <>
            <Helmet>
                <title>Календарь записей</title>    
            </Helmet>
            <CalendarComponent />
        </>
    )
}

export default CalendarPage