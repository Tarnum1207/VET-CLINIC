import { React, useState, useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom';

import styles from './Default.module.scss'
import './Default.module.scss'

import cn from '../../utils/classNames'

import '../../styles/forms.scss';

import moment from 'moment';

import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import logo from '../../images/logo_light.svg'
import { showToastError, showToastSuccess, showToastWarn } from '../../utils/showToast'
import { Toast } from 'primereact/toast'

import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';

import { NavLink } from 'react-router-dom';

import { useGetJournalListQuery } from '../../store/api/journalApi';

// импорт navigate
import { useNavigate } from 'react-router-dom'

// запрос на профиль
import { useGetProfileByUserIdQuery } from '../../store/api/usersApi'

import { useGetServicesQuery } from '../../store/api/servicesApi'

import {
    useGetJournalListByPassportIdQuery,
    useCreateJournalMutation,
    useGetJournalListByUserIdQuery
} from '../../store/api/journalApi'

const LkLayout = () => {

    const [currentPetId, setCurrentPetId] = useState('');

    useEffect(() => {
        if (localStorage.getItem('current_pet_id')) {
            setCurrentPetId(localStorage.getItem('current_pet_id'));
        }
    }, [localStorage.getItem('current_pet_id')])
	
    moment.locale('ru');
    addLocale('ru', {
        firstDayOfWeek: 1,
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
        dayNamesMin: ['В', 'П', 'В', 'С', 'Ч', 'П', 'С'],
        monthNames: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
        monthNamesShort: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    });
    const toast = useRef(null);

    const { data: profile, error, isLoading, isFetching } = useGetProfileByUserIdQuery(localStorage.getItem('user_id'));

    // eslint-disable-next-line
    const { data, error: journalError, isLoading: journalIsLoading } = profile?.user?.role?.id === '3' ? useGetJournalListQuery() :  useGetJournalListByPassportIdQuery({ user: localStorage.getItem('user_id'), passport: localStorage.getItem('current_pet_id') ? localStorage.getItem('current_pet_id') : undefined })

    const getTodayTasks = (data) => {
        const currentDateTime = new Date().toISOString().slice(0,10);
        if (!data?.journal) {
            return [];
        }
        return data?.journal?.filter(task => new Date(task.date).toISOString().slice(0,10) === currentDateTime) || [];
    }

    const todayTasks = getTodayTasks(data);
    

    console.log(data)

    

    const navigation = useNavigate()
    const navToFournalItem = useNavigate()
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [problem, setProblem] = useState('')
    const [service, setService] = useState('')
    const { data: services, error: servicesError, isLoading: servicesLoading, isFetching: servicesFetching } = useGetServicesQuery();

    if (!localStorage.getItem('user_id')) {
		navigation('/auth/login')
	}

    const currentDate = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

    const [createCalendarTaskLoading, setCreateCalendarTaskLoading] = useState(false)

    const [activePet, setActivePet] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem('current_pet_id')) {
          if (profile?.user?.pets?.length) {
            console.log('PETS: ', profile?.user?.pets)
            setActivePet(profile?.user?.pets[0].id);
            localStorage.setItem('current_pet_id', profile?.user?.pets[0].id);
          }
        }
      }, [profile]);

    useEffect(() => {
        const storedActivePetId = localStorage.getItem('current_pet_id');
        if (storedActivePetId) {
          setActivePet(storedActivePetId);
        }
      }, [activePet]);

    const handlePetClick = (pet) => {
      setActivePet(pet.id);
      localStorage.setItem('current_pet_id', pet.id);
        window.location.reload()
    };

    const logout = () => {
        localStorage.removeItem('current_pet_id')
        localStorage.removeItem('user_id')
        navigation('/auth/login')
    }

    const navigationToJournalItem = (id) => {
        if (profile?.user?.role?.id === '2') {
            navigation(`/lk/journal/${id}/edit`)
        } else {
            navigation(`/lk/journal/${id}`)
        }
        
    }

    const [
        createJournalItemQuery,
        { isLoading: createJournalItemLoading}
    ] = useCreateJournalMutation()

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }
    
    const formatTime = (time) => {
        const t = new Date(time);
        const hours = ('0' + t.getHours()).slice(-2);
        const minutes = ('0' + t.getMinutes()).slice(-2);
        return `${hours}:${minutes}`;
    }

    const createCalendarTaskAction = async () => {
        if (localStorage.getItem('current_pet_id') || localStorage.getItem('current_pet_id') !== undefined || localStorage.getItem('current_pet_id') !== null) {
            const result = await createJournalItemQuery({
                date: formatDate(date),
                time: formatTime(time),
                problem,
                service_id: service?.id,
                pet_passport_id: activePet
            }).unwrap()
    
            if (result?.error) {
                if (result?.error === 'Время вне рабочего интервала') {
                    toast.current.show(showToastWarn('Внимание', 'Вы выбрали нерабочие часы клиники. Выберите другое время.', 5000))
                } else if (result?.error === 'Нет свободных ветеринаров') {
                    toast.current.show(showToastWarn('Внимание', 'На данное время нет доступных специалистов.', 5000))
                } else {
                    console.log(result?.error)
                    toast.current.show(showToastWarn('Внимание', 'Что-то пошло не так. Повторите попытку.', 5000))
                }
                
            } else {
                // редирект на страницу landing
                toast?.current?.show(showToastSuccess('Успешно', 'Вы записаны', 5000))
                
                // setTimeout(() => {
                //     window.location.reload()
                // }, 2000)
            }
        } else {
            toast.current.show(showToastWarn('Внимание', 'Не выбран питомец для записи. Пожалуйста, выберите питомца, на которого будет оформлена запись в меню слева.', 5000))
        }
        
    }

    // текущая дата и время в формате ISO
    const currentDateTime = new Date().toISOString()
    console.log(currentDateTime)

    return (
        <div className={styles['lk']}>
            <Toast ref={toast} className="" />
            <div className={styles['left-sidebar']}>
                <div className={styles['left-sidebar__content']}>
                    <div>
                        <div className={styles['user-content']}>
                            <div className={styles['top-block']}>
                                <img src={logo} alt="" />
                                <button onClick={logout}>Выход</button>
                            </div>
                        </div>

                        <div className={styles['user-content']}>
                            <div className={styles['user-content__user']}>{profile?.user?.email}</div>

                            {profile?.user?.role?.id !== '2' && profile?.user?.role?.id !== '3' && profile?.user?.pets?.length ? (
                                <div className={styles['user-content__pets']}>
                                    {profile?.user?.pets?.map((pet, index) => (
                                        <div 
                                            key={pet?.id} 
                                            className={cn({
                                                additional: [
                                                    styles['user-content__pets__item'], 
                                                    pet.id === activePet ? styles['user-content__pets__item_active'] : ''
                                                ]
                                            })}
                                            onClick={() => handlePetClick(pet)}
                                        >
                                            <p>{pet?.pet_name}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                                
                        <div className={styles['left-sidebar__links']}>
                            <NavLink className={styles['left-sidebar__links-item']} to="/lk/calendar">Календарь приемов</NavLink>
                            <NavLink className={styles['left-sidebar__links-item']} to="/lk/journal">История болезней</NavLink>
                            {profile?.user?.role?.id === '2' || profile?.user?.role?.id === '3' ? (
                                <NavLink className={styles['left-sidebar__links-item']} to="/lk/pets">База питомцев</NavLink>
                            ) : null}

                            {profile?.user?.role?.id === '3' && (
                                <>
                                    <NavLink className={styles['left-sidebar__links-item']} to="/lk/users">Пользователи</NavLink>
                                    <NavLink className={styles['left-sidebar__links-item']} to="/lk/administration">Администрирование</NavLink>
                                    <NavLink className={styles['left-sidebar__links-item']} to="/lk/stat">Статистика</NavLink>
                                </>
                            )}
                            
                            <NavLink className={styles['left-sidebar__links-item']} to="/lk/profile">Профиль</NavLink>
                            <NavLink className={styles['left-sidebar__links-item']} to="/landing">На главную</NavLink>
                        </div>
                    </div>
                    

                    <div className={styles['user-content']}>
                        <div className={styles['left-sidebar__contacts']}>
                            <p className={styles['left-sidebar__contacts__description']}>В случае возникновения ошибки при работе личного кабинета, обращайтесь в службу поддержки</p>
                            <ul className={styles['left-sidebar__contacts__links']}>
                                <li className={styles['left-sidebar__contacts__links-item']}>
                                    <a href="mailto:petheal@yandex.ru">petheal@yandex.ru</a>
                                    <p>Напишите нам</p>
                                </li>
                                <li className={styles['left-sidebar__contacts__links-item']}>
                                    <a href="callto:8 (904) 298 53-68">8 (904) 298 53-68</a>
                                    <p>Позвоните нам</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
            </div>


            <Outlet className={styles['main-section']} />


            <div className={styles['right-sidebar']}>
            {profile?.user?.role?.id !== '2' && profile?.user?.role?.id !== '3' && (
                <div className={styles['right-sidebar__create-form']}>
                    <h2 className={styles['right-sidebar__form__title']}>Записаться</h2>
                    <div className={styles['right-sidebar__form']}>
                        <div className="form-item">
                            <label className='form-item__label' htmlFor="date">Дата</label>
                            <Calendar
                                className='form-item__input'
                                value={date}
                                onChange={(e) => setDate(e.value)}
                                locale='ru'
                                minDate={new Date()}
                                showIcon
                            />  
                        </div>
                        <div className="form-item">
                            <label className='form-item__label' htmlFor="date">Время</label>
                            <Calendar
                                className='form-item__input'
                                value={time}
                                onChange={(e) => setTime(e.value)}
                                showIcon
                                minDate={date && date.toDateString() !== new Date().toDateString() ? null : new Date()}
                                timeOnly
                                icon={() => <i className="pi pi-clock" />}
                            />  
                        </div>
                        <div className="form-item">
                            <label className='form-item__label' htmlFor="date">Услуга</label>
                            <Dropdown
                                className='form-item__input'
                                value={service}
                                options={services?.services}
                                optionLabel='name'
                                onChange={(e) => {
                                    setService(e.target.value)
                                }}
                            />  
                        </div>
                        <div className="form-item">
                            <label className='form-item__label' htmlFor="date">Описание проблемы</label>
                            <InputTextarea
                                value={problem}
                                onChange={(e) => setProblem(e.target.value)}
                                autoResize
                                rows={5}
                                cols={30}
                            />
                        </div>
                        <Button
                            className='form__controls__button create-task-button'
                            label='Отправить'
                            icon="pi pi-plus"
                            loading={createCalendarTaskLoading}
                            onClick={createCalendarTaskAction}
                            disabled={!date || !time || !service}
                        />
                    </div>
                </div>
            )}

                <div className={styles['right-sidebar__task-list']}>
                    <h2 className={styles['right-sidebar__task-list__title']}>Сегодня, <span>{currentDate}</span></h2>
                    <div className={styles['right-sidebar__task-list__wrapper']}>
                        {todayTasks?.length > 0
                            ? todayTasks?.map(task => (
                                <div onClick={() => navigationToJournalItem(task?.id)} className={styles['right-sidebar__task-list__wrapper-item']} key={task.id}>
                                    <p className={styles['right-sidebar__task-list__wrapper-item__time']}>{moment(task.time, 'HH:mm:ss').format('HH:mm')}</p>
                                    <p className={styles['right-sidebar__task-list__wrapper-item__service']}>{task.service}</p>
                                </div>
                            ))
                            : <div className={styles['no-journal']}>Нет записей на сегодня</div>
                        }
                    </div>
                </div> 
                {profile?.user?.pets?.length === 0 && profile?.user?.role?.id !== '2' && profile?.user?.role?.id !== '3' ? (
                    <div className={styles['right-sidebar__no-pets']}>
                        <h3>Внимание</h3>
                        <p>В вашей учетной записи нет питомцев. Добавьте питомца в разделе "Профиль".</p>
                        <Button onClick={() => navigation('/lk/profile')}>В профиль</Button>
                    </div>
                ) : null}
                
            </div>
            
        </div>
    )
}

export default LkLayout