import React from "react"

import MainPageComponent from '../../components/landing/index'
import { Helmet } from 'react-helmet'

const pageTitle = "ВЕТКЛИНИКА :: ТЕРРИТОРИЯ ЗДОРОВЬЯ ЖИВОТНЫХ"; // Замените на название вашей страницы

const MainPage = () => {
    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>
            <MainPageComponent />
        </>
    )
}

export default MainPage