import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import styles from './Index.module.scss'
import cn from '../../../utils/classNames'
import arrow from './img/arrow.svg'

import logo from '../../../images/logo_light.svg'

const LeftMenu = () => {
    const navigate = useNavigate();

    const [menuActive, setMenuActive] = useState(false)

    const toggleMenuActive = () => {
        setMenuActive(!menuActive)
    }

    const navigation = (path) => () => {
        if (path === 'login') navigate('/auth/login')
        if (path === 'registration') navigate('/auth/registration')
        if (path === 'cabinet') navigate('/lk/profile')
    }

    const scrollToElement = (selector) => (event) => {
        event.preventDefault();
        toggleMenuActive()
        setTimeout(() => {
            document.querySelector(selector).scrollIntoView({ behavior: 'smooth' });
        }, 500)
    };

    return (
        <>
            <div className={ menuActive ? `${styles['menu']} ${styles['menu-active']}` : styles['menu'] }>
                <button onClick={toggleMenuActive} className={styles['button']}>
                    <img src={arrow} alt="" />
                </button>
                <div className={styles['menu__container']}>
                    <div className={styles['menu__container__top']}>
                        <img className={styles['menu__container-logo']} src={logo} alt="" />
                        <div className={styles['menu__container__top__link']}>
                            {!localStorage.getItem('user_id') ? (
                                <>
                                    <button onClick={navigation('login')}>Вход</button>
                                    <button onClick={navigation('registration')}>Регистрация</button>
                                </>
                            ) : (
                                <button onClick={navigation('cabinet')}>Кабинет</button>
                            )}
                        </div>
                    </div>

                    <div className={styles['menu__container__links']}>
                        <a href="#" onClick={scrollToElement('#aboutUs')}>О нас</a>
                        <a href="#" onClick={scrollToElement('#services')}>Услуги</a>
                        <a href="#" onClick={navigation('cabinet')}>Кабинет</a>
                    </div>

                    <div className={styles['menu__container__contacts']}>
                        <div className={styles['menu__container__contacts-item']}>
                            <a href="mailto:petheal@yandex.ru">petheal@yandex.ru</a>
                            <p>Напишите нам</p>
                        </div>
                        <div className={styles['menu__container__contacts-item']}>
                            <a href="callto:8 (904) 298 53-68">8 (904) 298 53-68</a>
                            <p>Позвоните нам</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeftMenu