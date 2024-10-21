import React from 'react'

import human from './img/human.png'
import circle from './img/circle.svg'

import styles from './Index.module.scss'

import AboutItem from './AboutItem'

const AboutSection = () => {

    return (
        <>
            <section id='aboutUs' className={styles['about']}>
                <div className={styles['content']}>
                    <img className={styles['human']} src={human} alt=""/>
                    <div className={styles['stages']}>
                        <h2 className={styles['title']}>О специалистах</h2>
                        <ul>
                            <AboutItem
                                {
                                    ...{
                                        title: 'Постоянное обучение',
                                        description: 'Наша команда регулярно проходит обучение и курсы повышения квалификации, чтобы быть в курсе последних достижений ветеринарной медицины'
                                    }
                                }
                            />
                            <AboutItem
                                {
                                    ...{
                                        title: 'Широкий спектр специализаций',
                                        description: 'У нас работают специалисты различных направлений - от терапевтов и хирургов до специалистов по диетологии и поведению животных'
                                    }
                                }
                            />
                            <AboutItem
                                {
                                    ...{
                                        title: 'Индивидуальный подход',
                                        description: 'Каждый специалист нашей клиники уделяет особое внимание потребностям и особенностям каждого питомца, чтобы обеспечить наиболее эффективное лечение'
                                    }
                                }
                            />
                            <AboutItem
                                {
                                    ...{
                                        title: 'Дружелюбие и эмпатия',
                                        description: 'Наша команда любит животных и стремится создать для них комфортную и безопасную среду во время их визита в клинику'
                                    }
                                }
                            />
                            <AboutItem
                                {
                                    ...{
                                        title: 'Опытные специалисты',
                                        description: 'Наши ветеринары и медицинский персонал имеют обширный опыт и профессиональные навыки, чтобы обеспечить лучший уход за вашим питомцем'
                                    }
                                }
                            />
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutSection