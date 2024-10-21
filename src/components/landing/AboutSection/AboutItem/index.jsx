import React from 'react'
import styles from './Index.module.scss'

import circle from '../img/circle.svg'

const AboutItem = (props) => {

    const { title, description } = props

    return (
        <>
            <li className={styles['container']}>
                <div className={styles['title']}>
                    <img src={circle} alt="" />
                    <h3>{title}</h3>
                </div>
                <p className={styles['description']}>{description}</p>
            </li>         
        </>
    )
}

export default AboutItem