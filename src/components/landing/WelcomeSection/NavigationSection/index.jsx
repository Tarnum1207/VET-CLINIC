import React from 'react'

import { useNavigate } from 'react-router-dom';

import styles from './Index.module.scss'

import logo from '../../../../images/logo_light.svg'
import cat from '../img/cat.png'


const NavigationSection = () => {

        const navigate = useNavigate();

        const scrollToElement = (selector) => (event) => {
            event.preventDefault();
            document.querySelector(selector).scrollIntoView({ behavior: 'smooth' });
        };

        const toAuth = (event) => {
            event.preventDefault();
            if (localStorage.getItem('user_id')) {
                navigate('/lk/profile')
            } else {
                navigate('/auth/login')
            }
        }

        return (
            <>
                <section className={styles['navigation']}>
                    <nav className={styles['nav']}>
                        <div className={styles['content']}>
                            <img
                                src={logo}
                                alt=""
                                className={styles['logo']}
                            />
                            <ul className={styles['nav-list']}>
                                <li className={styles['nav-list-item']}>
                                    <a href="#" onClick={scrollToElement('#aboutUs')}>
                                        О нас
                                    </a>
                                </li>
                                <li className={styles['nav-list-item']}>
                                    <a href="#" onClick={scrollToElement('#services')}>
                                        Услуги
                                    </a>
                                </li>
                                <li
                                    className={styles['nav-list-item']}>
                                    <a href="#" onClick={toAuth}>
                                        Кабинет
                                    </a>
                                </li>
                            </ul>
                            <ul className={styles['contacts']}>
                                <li className={styles['contacts-item']}>
                                    <a href="mailto:petheal@yandex.ru">
                                        petheal@yandex.ru
                                    </a>
                                    <p>petheal@yandex.ru</p>
                                </li>
                                <li className={styles['contacts-item']}>
                                    <a href="callto:8 (904) 298 53-68">
                                        8 (904) 298 53-68
                                    </a>
                                    <p>petheal@yandex.ru</p>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className={styles['main-content']}>
                        <img className={styles['main-content__cat']} src={cat} alt=""/>
                        <div className={styles['main-content__left']}>
                            <p>
                                Любовь, забота и профессионализм для вашего питомца здесь!
                            </p>
                            <p>
                                Наша команда профессионалов всегда готова помочь, а наши услуги разработаны с учетом всех потребностей вашего питомца. Потому что мы знаем, что он - часть вашей семьи.
                            </p>
                        </div>
                        <ul className={styles['main-content__right']}>
                            <li>
                                <p>2500 +</p>
                                <span>Животных вакцинировано</span>
                            </li>
                            <li>
                                <p>150 +</p>
                                <span>Вылечено переломов</span>
                            </li>
                            <li>
                                <p>350 +</p>
                                <span>Вылечено последствий укусов клещей</span>
                            </li>
                        </ul>
                    </div>
                </section>
            </>
        )
}

export default NavigationSection