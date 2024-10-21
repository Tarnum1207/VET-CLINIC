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

import { useLoginMutation } from '../../../store/api/authApi'

const LoginComponent = () => {
    const navigate = useNavigate();

    if (localStorage.getItem('user_id')){
        navigate('/lk/profile')
    }

    const toast = useRef(null);

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const [
        loginQuery,
        { isLoading: loginLoading}
    ] = useLoginMutation()

    const [beforeRedirect, setBeforeRedirect] = useState(false)

    const loginAction = async () => {
        try {
            const result = await loginQuery({login, password}).unwrap()

            if (result?.error) {
                console.log(result?.error)
                toast.current.show(showToastWarn('Внимание', 'Неверный логин или пароль', 5000))
            } else {
                // редирект на страницу landing
                toast?.current?.show(showToastSuccess('Успешно', 'Авторизация прошла успешно', 5000))

                setBeforeRedirect(true)
                localStorage.setItem('user_id', result?.id)
                localStorage.setItem('current_pet_id', result?.pets[0]?.id)
                setTimeout(() => {
                    navigate('/lk/profile');
                }, 2000)
            }
        } catch (error) {
            toast?.current?.show(showToastError(error))
        }
    }

    const toRegistration = () => {
        navigate('/auth/registration');
    }

    return (
        <div className={styles['form-wrapper']}>
            <Toast ref={toast} className="" />
            <div className='form'>
                <h2 className='form__title'>Вход</h2>
                <div className="form-item">
                    <label className='form-item__label' htmlFor="login">Логин</label>
                    <InputText
                        className='form-item__input'
                        id="login"
                        aria-describedby="username-help"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
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
                <div className='form__controls'>
                    <Button 
                        className='form__controls__button form__controls__button_left'
                        label='Регистрация'
                        outlined
                        loading={loginLoading || beforeRedirect}
                        icon="pi pi-user-plus"
                        onClick={toRegistration}
                    />
                    <Button
                        className='form__controls__button form__controls__button_right'
                        label='Войти'
                        icon="pi pi-sign-in"
                        loading={loginLoading || beforeRedirect}
                        onClick={loginAction}
                    />
                </div>
            </div>
        </div>
    )
}

export default LoginComponent