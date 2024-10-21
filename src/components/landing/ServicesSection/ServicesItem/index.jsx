import React from 'react'

import styles from './Index.module.scss'

const ServicesSection = (props) => {

    const { icon, title, description, price } = props

    return (
        <>
            <li className={styles['services__list-item']}>
                <img src={icon} alt="" />
                <h3 className={styles['title']}>{title}</h3>
                <p className={styles['subtitle']}>{description}</p>
                <p className={styles['price']}>~ {price} ₽</p>
            </li>
        </>
    )
}

export default ServicesSection