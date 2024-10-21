import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/ru';

import styles from './Index.module.scss';

import { Button } from 'primereact/button';

import 'primeicons/primeicons.css';

import cn from '../../../utils/classNames'

import { useGetJournalListByPassportIdQuery } from '../../../store/api/journalApi';

import { useNavigate } from 'react-router-dom';

import { useGetJournalListQuery } from '../../../store/api/journalApi';

import { useGetProfileByUserIdQuery } from '../../../store/api/usersApi';

const CalendarComponent = ({ events = [] }) => {

    const navigation = useNavigate();

    const [current_pet_id, setCurrentPetId] = useState('');

    useEffect(() => {
        if (localStorage.getItem('current_pet_id')) {
            setCurrentPetId(localStorage.getItem('current_pet_id'));
        }
    }, [localStorage.getItem('current_pet_id')])

    const { data: profile } = useGetProfileByUserIdQuery(localStorage.getItem('user_id'));

    // eslint-disable-next-line
    const { data, refetch } = profile?.user?.role?.id === '3' ? useGetJournalListQuery() : useGetJournalListByPassportIdQuery({ user: localStorage.getItem('user_id'), passport: current_pet_id ? current_pet_id : undefined });
    

    moment.locale('ru');
    const [dateContext, setDateContext] = useState(moment());
    const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

    const currentMonth = dateContext.format('MMMM');
    const currentYear = dateContext.format('YYYY');

    // Функция для преобразования первой буквы строки в верхний регистр
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const navigationToJournalItem = (id) => {
            navigation(`/lk/journal/${id}`)
    }

    // Преобразуем первую букву названия месяца в верхний регистр
    const capitalizedCurrentMonth = capitalizeFirstLetter(currentMonth);

    const daysInMonth = dateContext.daysInMonth();
    const firstDayOfMonth = (dateContext.clone().startOf('month').day() + 6) % 7;
    const lastDayOfMonth = (dateContext.clone().endOf('month').day() + 6) % 7;

    const days = [...Array(daysInMonth).keys()].map(i => i + 1);
    let daysFromPrevMonth = [];
    let daysFromNextMonth = [];

    if (firstDayOfMonth !== 0) {
        daysFromPrevMonth = [...Array(firstDayOfMonth).keys()].map(i => moment(dateContext).subtract(1, 'month').daysInMonth() - i).reverse();
    }

    if (lastDayOfMonth !== 6) {
        daysFromNextMonth = [...Array(6 - lastDayOfMonth).keys()].map(i => i + 1);
    }

    const changeMonth = num => {
        setDateContext(dateContext.clone().add(num, 'month'));
    };

    return (
        <div className={styles.calendar}>
            <div className={styles.title}>
                <Button rounded text raised icon='pi pi-chevron-left' className={styles.button} onClick={() => changeMonth(-1)} />
                <span className={styles.monthTitle}>{capitalizedCurrentMonth} {currentYear}</span>
                <Button rounded text raised icon='pi pi-chevron-right' className={styles.button} onClick={() => changeMonth(1)} />
            </div>
            <div className={styles.week}>
                {daysOfWeek.map(d => <div className={styles.dayName} key={d}>{d}</div>)}
                {daysFromPrevMonth.map((d, i) => (
                    <div className={
                        cn({
                            additional: [styles.day, styles.notCurrentMonth]
                        })
                    } key={`${currentYear}-${capitalizedCurrentMonth}-${i}`}>
                        {d}
                    </div>
                ))}
                {days.map((d, i) => (
                    <div className={styles.day} key={`${currentYear}-${currentMonth}-${i}`}>
                        {d}
                        {events.filter(e => moment(e.date).startOf('day').isSame(dateContext.clone().date(d).startOf('day'))).map(e => (
                            <div className={styles.event} key={e.id}>{e.name}</div>
                        ))}
                        {data?.journal?.filter(task => moment(task.date).startOf('day').isSame(dateContext.clone().date(d).startOf('day')))
                            .sort((a, b) => moment(a.time, 'HH:mm:ss').isAfter(moment(b.time, 'HH:mm:ss')) ? 1 : -1) // сортируем события по времени
                            .map(task => (
                                <div onClick={() => navigationToJournalItem(task?.id)} className={styles.event} key={task?.id}>
                                    <span className={styles.eventTime}>{moment(task.time, 'HH:mm:ss').format('HH:mm')}</span>
                                    <span className={styles.eventName}>{task.service}</span>
                                </div>
                            ))}
                    </div>
                ))}
                {daysFromNextMonth.map((d, i) => (
                    <div className={`${styles.day} ${styles.notCurrentMonth}`} key={`${currentYear}-${currentMonth}-${i}`}>
                        {d}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarComponent;