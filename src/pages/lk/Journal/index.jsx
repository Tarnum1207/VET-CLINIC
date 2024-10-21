import React from "react"

import JournalComponent from '../../../components/lk/Journal/index'

import { useParams } from "react-router-dom"

import { Helmet } from "react-helmet"
import { Outlet } from "react-router-dom"

const JournalPage = () => {
    const { journal } = useParams();

    return (
        <>
            <Helmet>
                <title>История болезней</title>
            </Helmet>
            {!journal && <JournalComponent />}
            <Outlet />
        </>
    )
}

export default JournalPage