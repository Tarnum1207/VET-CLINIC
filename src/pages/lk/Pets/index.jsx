import React from "react"

import PetsComponent from '../../../components/lk/Pets/index'

import { Helmet } from "react-helmet"

const PetsPage = () => {

    return (
        <>
            <Helmet>
                <title>База питомцев</title>
            </Helmet>
            <PetsComponent />
        </>
    )
}

export default PetsPage