import React, { useRef, useState, useEffect } from 'react';
import styles from './Index.module.scss';
import 'primeicons/primeicons.css';

import { Button } from 'primereact/button';

import { InputNumber } from 'primereact/inputnumber';

import { useParams, useNavigate } from "react-router-dom"

import { Editor } from 'primereact/editor';

import moment from 'moment'

import { useGetJournalItemByIdQuery, useUpdateJournalMutation } from '../../../../store/api/journalApi';

import { useGetProfileByUserIdQuery } from '../../../../store/api/usersApi';


const JournalIdEditComponent = () => {
    const navigation = useNavigate()
    const params = useParams()


    const { data: journal } = useGetJournalItemByIdQuery(params?.journal)


    const handleNavigation = () => {
        navigation(-1);
    };

    const backToJournal = () => {
        navigation(`/lk/journal/${journal?.id}`)
    }

    const [lookingResult, setLookingResult] = useState(journal?.looking_result);
    const [diagnosis, setDiagnosis] = useState(journal?.diagnosis);
    const [price, setPrice] = useState(journal?.price);

    const [updateJournalMutation] = useUpdateJournalMutation();

    const updateJournal = async () => {
        const request = await updateJournalMutation({
            id: journal?.id,
            body: {
                diagnosis: diagnosis,
                looking_result: lookingResult,
                price
            }
        }).unwrap().then((result) => {
            if (!result?.error) {
                navigation(`/lk/journal/${journal?.id}`)
            } else {
                console.log('ERROR: ', result?.error)
            }
        })

    }

    const user_id = localStorage.getItem('user_id');

    const { data: profile } = useGetProfileByUserIdQuery(user_id)

    useEffect(() => {
        setLookingResult(journal?.looking_result)
        setDiagnosis(journal?.diagnosis)
    }, [journal])


    return (
        <>
            <div className={styles.journal}>
                <div className={styles['journal-top']}>
                    <h2 className={styles['journal-top__title']}>
                        <i onClick={handleNavigation} className='pi pi-chevron-left' />
                        {moment(journal?.event_date).format('DD.MM.YYYY')} {moment(journal?.event_time, 'HH:mm:ss').format('HH:mm')}
                    </h2>
                    {journal?.veterinarian_id === user_id || profile?.user?.role?.id === '3' && (
                        <ul onClick={backToJournal} className={styles['journal-top__actions']}>
                            <li className={styles['journal-top__actions-item']}>
                                <i className='pi pi-eye' />
                                Вернуться к просмотру
                            </li>
                        </ul>
                    )}
                </div>
                <ul className={styles['journal-pet']}>
                    <li className={styles['journal-pet__item']}>
                        <p>Стоимость (₽)</p>
                        <InputNumber value={price} onChange={(e) => {
                            console.log(e)
                            setPrice(e.value)
                        }} />
                    </li>
                </ul>
                <ul className={styles['journal-pet']}>
                    <li className={styles['journal-pet__item']}>
                        <p>Кличка</p>
                        <p>{journal?.passport?.pet_name}</p>
                    </li>
                    <li className={styles['journal-pet__item']}>
                        <p>Род</p>
                        <p>{journal?.pet_type?.pet_type_name}</p>
                    </li>
                    <li className={styles['journal-pet__item']}>
                        <p>Пол</p>
                        <p>{journal?.passport?.sex === '1' ? 'М' : 'Ж'}</p>
                    </li>
                    <li className={styles['journal-pet__item']}>
                        <p>Тип шерсти</p>
                        <p>{journal?.coat_type?.coat_type_name}</p>
                    </li>
                    <li className={styles['journal-pet__item']}>
                        <p>Окрас</p>
                        <p>{journal?.coat_color?.coat_color}</p>
                    </li>
                    {journal?.passport?.chip_id ? (
                        <li className={styles['journal-pet__item']}>
                            <p>Место чипа</p>
                            <p>{journal?.chip?.chip_number}</p>
                        </li>
                    ) : null}
                    
                    <li className={styles['journal-pet__item']}>
                        <p>Возраст</p>
                        <p>{
                            (() => {
                                const currentDate = new Date();
                                const birthDate = new Date(journal?.passport?.birth_date);
                                const years = currentDate.getFullYear() - birthDate.getFullYear();
                                const months = currentDate.getMonth() - birthDate.getMonth();
                              
                                const getPlural = (num, one, few, many) => {
                                  let n = Math.abs(num);
                                  n %= 100;
                                  if (n >= 5 && n <= 20) {
                                    return many;
                                  }
                                  n %= 10;
                                  if (n === 1) {
                                    return one;
                                  }
                                  if (n >= 2 && n <= 4) {
                                    return few;
                                  }
                                  return many;
                                };
                              
                                return years + ' ' + getPlural(years, 'год', 'года', 'лет') + ' ' + (months < 0 ? months + 12 : months) + ' ' + getPlural(months, 'месяц', 'месяца', 'месяцев');
                              })()
                        }</p>
                    </li>
                </ul>
                <ul className={styles['journal-pet']}>
                    <li className={styles['journal-pet__item']}>
                        <p>Хозяин</p>
                        <p>{journal?.user?.second_name} {journal?.user?.first_name} {journal?.user?.last_name}</p>
                    </li>
                    <li className={styles['journal-pet__item']}>
                        <p>E-Mail</p>
                        <p>{journal?.user?.email}</p>
                    </li>
                </ul>

                <div className={styles['journal-result']}>
                    <h3>Комментарий хозяина</h3>
                    {journal?.master_description
                        ? <p>{journal.master_description}</p>
                        : <p>Хозяин не оставил комментарий</p>
                    }
                </div>

                <div className={styles['journal-result']}>
                    <h3>Результат осмотра</h3>
                    <Editor value={lookingResult} onTextChange={(e) => { 
                        console.log(e)
                        setLookingResult(e.htmlValue)
                        }} style={{ height: '320px' }} />
                </div>

                <div className={styles['journal-result']}>
                    <h3>Назначенное лечение</h3>
                    <Editor value={diagnosis} onTextChange={(e) => setDiagnosis(e.htmlValue)} style={{ height: '320px' }} />
                </div>
                
                <Button onClick={updateJournal} className={styles['vet-submit']}>Сохранить</Button>
            </div>
        </>
    )
}

export default JournalIdEditComponent;