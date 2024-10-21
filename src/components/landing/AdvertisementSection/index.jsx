import React from 'react'

import styles from './Index.module.scss'

import adv from './img/adv.png'

import { useNavigate } from 'react-router-dom'

const AdvSection = () => {

    const navigation = useNavigate()

    return (
        <>
            <section className={styles['adv']}>
                <div className={styles['adv__text']}>
                    <h2 className={styles['adv__text-title']}>Личный кабинет питомца</h2>
                    <p className={styles['adv__text-description']}>
                        Откройте для себя удобство управления здоровьем вашего питомца с помощью личного кабинета нашей ветеринарной клиники!<br /><br />
                        Здесь вы можете записаться на прием, просмотреть историю визитов и лечения, узнать о предстоящих вакцинациях и процедурах, а также общаться с нашими специалистами. <br /><br />
                        Все это доступно вам 24/7, где бы вы ни находились.<br /><br />
                        Присоединяйтесь к нам и сделайте уход за здоровьем вашего питомца еще проще и удобнее!
                    </p>
                    <button onClick={() => {navigation('/auth/registration')}} className={styles['adv__button']}>
                        Попробовать ЛК
                    </button>
                </div>
                <img className={styles['adv__image']} src={adv} alt="" />
            </section>
        </>
    )
}

export default AdvSection