import React from 'react'

import cn from '../../../utils/classNames'

import styles from './Index.module.scss'
import russel from './img/russel.png'

import NavigationSection from "./NavigationSection";

const WelcomeSection = () => {

        return (
            <>
                <section
                    className={cn({
                        cls: styles['welcome-section']
                    })}
                >
                    {/* фон */}
                    <div
                        className={cn({
                            cls: styles['quote']
                        })}
                    >
                        <p>"Ваш питомец заслуживает лучшего! В нашей ветеринарной клинике мы предлагаем высококачественный уход и любовь, которые ваш маленький друг заслуживает. Забота о здоровье вашего питомца - наш приоритет!"</p>
                        <p
                            className={cn({
                                cls: styles['quote__author']
                            })}
                        ><span>Главный врач клиники</span><br/>Иванов И.</p>
                    </div>
                    <img
                        className={cn({
                            cls: styles['russel']
                        })}
                        src={russel}
                        alt=""
                    />
                    <div
                        className={cn({
                            cls: styles['welcome-section__title']
                        })}
                    >
                        <h1>территория</h1>
                        <div>
                            <h2>здоровья</h2>
                            <h2>животных</h2>
                        </div>
                    </div>

                    <NavigationSection />
                </section>
            </>
        )
}

export default WelcomeSection