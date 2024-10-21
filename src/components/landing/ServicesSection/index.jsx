import React from 'react'

import styles from './Index.module.scss'

import ServicesItem from './ServicesItem'

import icon_1 from './img/1.svg'
import icon_2 from './img/2.svg'
import icon_3 from './img/3.svg'
import icon_4 from './img/4.svg'
import icon_5 from './img/5.svg'
import icon_6 from './img/6.svg'
import icon_7 from './img/7.svg'
import icon_8 from './img/8.svg'
import icon_9 from './img/9.svg'
import icon_10 from './img/10.svg'

const ServicesSection = () => {

    return (
        <>
            <section id='services' className={styles['services']}>
                <h2 className={styles['services__title']}>Услуги</h2>
                <ul className={styles['services__list']}>
                    <ServicesItem
                        {
                            ...{
                                icon: icon_1,
                                title: 'Профилактические осмотры',
                                description: 'Регулярные проверки здоровья вашего питомца, включая вакцинацию и профилактику паразитов',
                                price: '1.000'
                            }
                        }
                    />
                    <ServicesItem
                        className={styles['services__list-item']}
                        {
                            ...{
                                icon: icon_2,
                                title: 'Вакцинации',
                                description: 'Предлагаем полный спектр услуг по вакцинации, чтобы обеспечить вашему питомцу защиту от различных заболеваний. Мы используем только сертифицированные вакцины',
                                price: '2.000'
                            }
                        }
                    />
                    <ServicesItem
                        className={styles['services__list-item']}
                        {
                            ...{
                                icon: icon_3,
                                title: 'Хирургия',
                                description: 'Выполнение различных хирургических операций, от простых до сложных',
                                price: '4.000'
                            }
                        }
                    />
                    <ServicesItem
                        className={styles['services__list-item']}
                        {
                            ...{
                                icon: icon_4,
                                title: 'Стоматология',
                                description: 'Уход за зубами и полостью рта вашего питомца',
                                price: '3.000'
                            }
                        }
                    />
                    <ServicesItem
                        className={styles['services__list-item']}
                        {
                            ...{
                                icon: icon_5,
                                title: 'Дерматология',
                                description: 'Лечение кожных заболеваний и аллергий',
                                price: '2.000'
                            }
                        }
                    />
                    <ServicesItem
                        className={styles['services__list-item']}
                        {
                            ...{
                                icon: icon_6,
                                title: 'Физиотерапия и реабилитация',
                                description: 'Помощь в восстановлении после травм и операций',
                                price: '2.000'
                            }
                        }
                    />
                    <ServicesItem
                        className={styles['services__list-item']}
                        {
                            ...{
                                icon: icon_7,
                                title: 'Офтальмология',
                                description: 'Лечение заболеваний глаз',
                                price: '1.000'
                            }
                        }
                    />
                    <ServicesItem
                        className={styles['services__list-item']}
                        {
                            ...{
                                icon: icon_8,
                                title: 'Поведенческая медицина',
                                description: 'Помощь в решении проблем поведения вашего питомца',
                                price: '3.000'
                            }
                        }
                    />
                    <ServicesItem
                        className={styles['services__list-item']}
                        {
                            ...{
                                icon: icon_9,
                                title: 'Питание и диетология',
                                description: 'Консультации по правильному питанию и подбору диеты для вашего питомца',
                                price: '2.000'
                            }
                        }
                    />
                    <ServicesItem
                        className={styles['services__list-item']}
                        {
                            ...{
                                icon: icon_10,
                                title: 'Экстренная помощь',
                                description: 'Предоставление экстренной медицинской помощи в случае неотложных состояний',
                                price: '500'
                            }
                        }
                    />
                </ul>
            </section>
        </>
    )
}

export default ServicesSection