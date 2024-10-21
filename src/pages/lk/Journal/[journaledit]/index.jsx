import React from "react"

import JournalIdEditComponent from '../../../../components/lk/Journal/JournalIdEdit/index'

import { Helmet } from "react-helmet"

const JournalIdEditPage = () => {
    return (
        <>
            <Helmet>
                <title>Прием :: Редактирование</title>
            </Helmet>
            <JournalIdEditComponent />
        </>
    )
}

export default JournalIdEditPage