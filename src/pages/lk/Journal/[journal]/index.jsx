import React from "react"

import JournalIdComponent from '../../../../components/lk/Journal/JournalId/index'

import { Helmet } from "react-helmet"

const JournalIdPage = () => {
    return (
        <>
            <Helmet>
                <title>Прием</title>
            </Helmet>
            <JournalIdComponent />
        </>
    )
}

export default JournalIdPage