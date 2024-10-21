import { React, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import { showToastError, showToastSuccess, showToastWarn } from '../../../utils/showToast'

import styles from './Index.module.scss'
import '../../../styles/forms.scss'

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'

// импорт primeicons
import 'primeicons/primeicons.css';

import { useRegistrationMutation } from '../../../store/api/authApi'

const RegistrationComponent = () => {
    const navigate = useNavigate();

    if (localStorage.getItem('user_id')){
        navigate('/lk/profile')
    }

    const toast = useRef(null);

    const [nickname, setNickname] = useState('')
    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [secondName, setSecondName] = useState('')

    const [
        registrationQuery,
        { isLoading: registrationLoading}
    ] = useRegistrationMutation()

    const [beforeRedirect, setBeforeRedirect] = useState(false)

    const loginAction = async () => {
        try {
            const result = await registrationQuery({
                nickname,
                login,
                email,
                password,
                firstName,
                lastName,
                secondName
            }).unwrap()

            if (result?.error) {
                console.log(result?.error)
                if (result?.error === 'Email already registered') {
                    toast.current.show(showToastWarn('Внимание', 'Пользователь с данным адресом электронной почтой уже харегистрирован. Повторите попытку, используя другой адрес электронной почты', 5000))
                } else {
                    toast.current.show(showToastWarn('Внимание', 'Что-то пошло не так. Повторите попытку', 5000))
                }
            } else {
                // редирект на страницу landing
                toast?.current?.show(showToastSuccess('Успешно', 'Ваша учетная запись зарегистрирована', 5000))

                setBeforeRedirect(true)

                setTimeout(() => {
                    navigate('/auth/login');
                }, 2000)
            }
        } catch (error) {
            toast?.current?.show(showToastError(error))
        }
    }

    const toLogin = () => {
        navigate('/auth/login');
    }

    return (
        <div className={styles['form-wrapper']}>
            <Toast ref={toast} className="" />
            <div className='form'>
                <h2 className='form__title'>Регистрация</h2>
                <div className="form-item">
                    <label className='form-item__label' htmlFor="nickname">Никнейм</label>
                    <InputText
                        className='form-item__input'
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <label className='form-item__label' htmlFor="login">Логин</label>
                    <InputText
                        className='form-item__input'
                        id="login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <label className='form-item__label' htmlFor="email">E-Mail</label>
                    <InputText
                        className='form-item__input'
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <label className='form-item__label' htmlFor="password">Пароль</label>
                    <Password
                        className='form-item__input w-full'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        toggleMask
                    />
                </div>
                <div className="form-item_double">
                    <div className='form-item'>
                        <label className='form-item__label' htmlFor="login">Фамилия</label>
                        <InputText
                            className='form-item__input'
                            id="login"
                            value={secondName}
                            onChange={(e) => setSecondName(e.target.value)}
                        />
                    </div>
                    <div className='form-item'>
                        <label className='form-item__label' htmlFor="login">Имя</label>
                        <InputText
                            className='form-item__input'
                            id="login"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-item_double">
                    <div className='form-item'>
                        <label className='form-item__label' htmlFor="login">Отчество</label>
                        <InputText
                            className='form-item__input'
                            id="login"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>
                <div className='form__controls'>
                    <Button 
                        className='form__controls__button form__controls__button_left'
                        label='Вход'
                        outlined
                        loading={registrationLoading || beforeRedirect}
                        icon="pi pi-sign-in"
                        onClick={toLogin}
                    />
                    <Button
                        className='form__controls__button form__controls__button_right'
                        label='Регистрация'
                        icon="pi pi-sign-in"
                        loading={registrationLoading || beforeRedirect}
                        onClick={loginAction}
                        tooltip={
                                'Нажимая кнопку "Регистрация", вы соглашаетесь с ФЗ № 152 от 27 июля 2006 года "О персональных данных"'
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default RegistrationComponent