import React from 'react'
import { Outlet } from 'react-router-dom';

import logo from '../../images/logo_auth.svg'

import styles from './Default.module.scss'

import { NavLink } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className={styles['auth']}>
            <NavLink to="/landing" className='auth__logo__link'>
                <img className={styles['auth__logo']} src={logo} alt="" />
            </NavLink>
            <Outlet />
            <ul className={styles['auth__contacts__list']}>
                <p className={styles['auth__contacts__list__main']}>
                    В случае возникновения ошибки при работе личного кабинета, обращайтесь в службу поддержки
                </p>
                <li className={styles['auth__contacts__list-item']}>
                    <a className={styles['auth__contacts__list-item__link']} href="mailto:petheal@yandex.ru">
                        petheal@yandex.ru
                    </a>
                    <p className={styles['auth__contacts__list-item__subtitle']}>Напишите нам</p>
                </li>
                <li className={styles['auth__contacts__list-item']}>
                    <a className={styles['auth__contacts__list-item__link']} href="callto:8 (904) 298 53-68">
                        8 (904) 298 53-68
                    </a>
                    <p className={styles['auth__contacts__list-item__subtitle']}>Напишите нам</p>
                </li>
            </ul>
        </div>
    )
}

export default AuthLayout