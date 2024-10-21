import React from 'react'

import styles from './Index.module.scss'

import { useNavigate } from 'react-router-dom';

import logoLight from '../../../images/logo_light.svg'

const FooterSection = () => {
    const navigate = useNavigate();

    const scrollToElement = (selector) => (event) => {
        event.preventDefault();
        document.querySelector(selector).scrollIntoView({ behavior: 'smooth' });
    };

    const toAuth = (event) => {
        event.preventDefault();
        navigate('/auth/login')
    }

    return (
        <>
            <footer className={styles['footer']}>
                <nav className={styles['nav']}>
                    <div className={styles['content']}>
                        <img
                            src={logoLight}
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
                            <li className={styles['nav-list-item']}>
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
            </footer>
        </>
    )
}

export default FooterSection