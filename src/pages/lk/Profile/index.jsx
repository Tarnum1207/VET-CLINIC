import React from "react"

import ProfileComponent from '../../../components/lk/Profile/index'

import { Helmet } from "react-helmet"

const ProfilePage = () => {
    return (
        <>
            <Helmet>
                <title>Профиль</title>
            </Helmet>
            <ProfileComponent />
        </>
    )
}

export default ProfilePage