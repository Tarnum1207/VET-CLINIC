import React from 'react'

import WelcomeSection from './WelcomeSection'
import AboutSection from './AboutSection'
import ServicesSection from './ServicesSection'
import AdvSection from './AdvertisementSection'
import FooterSection from './FooterSection'
import LeftMenu from './LeftMenu'

const MainPageComponent = () => {

    return (
        <>
            <LeftMenu />    
            <WelcomeSection />
            <AboutSection />
            <ServicesSection />
            <AdvSection />
            <FooterSection />
        </>
    )
}

export default MainPageComponent