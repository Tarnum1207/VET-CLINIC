import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { showToastError, showToastSuccess, showToastWarn } from '../../../utils/showToast'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Chart } from 'primereact/chart';

import styles from './Index.module.scss';

import 'primeicons/primeicons.css';

import { useGetProfileByUserIdQuery, useUpdatePasswordMutation, useEditUserMutation } from '../../../store/api/usersApi';
import { useGetTypesQuery } from '../../../store/api/petTypesApi';
import { useGetBreedsByPetTypeIdQuery } from '../../../store/api/breedsApi';
import { useGetCoatTypesQuery, useGetCoatColorsQuery } from '../../../store/api/coatsApi';
import {
    useGetPetForProfileQuery,
    useCreatePetMutation,
    useEditPetMutation,
    useDeletePetMutation
} from '../../../store/api/petsApi';
import { useGetPopularServicesQuery } from '../../../store/api/chartApi';

import moment from 'moment';
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';


const ProfileComponent = () => {
    const toast = useRef(null);
    moment.locale('ru');
    addLocale('ru', {
        firstDayOfWeek: 1,
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
        dayNamesMin: ['В', 'П', 'В', 'С', 'Ч', 'П', 'С'],
        monthNames: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
        monthNamesShort: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    });

    const { data: profile, error, isLoading, isFetching, refetch: profileRefetch } = useGetProfileByUserIdQuery(localStorage.getItem('user_id'));
    const { data: petTypes, error: petTypesError, isLoading: petTypesIsLoading, isFetching: petTypesIsFetching } = useGetTypesQuery();
    const { data: coatTypes, error: coatTypesError, isLoading: coatTypesIsLoading, isFetching: coatTypesIsFetching } = useGetCoatTypesQuery();
    const { data: coatColors, error: coatColorsError, isLoading: coatColorsIsLoading, isFetching: coatColorsIsFetching } = useGetCoatColorsQuery();
    

    const editUser = (id) => () => {
        console.log(id)
    }

    const editPassword = (id) => () => {
        console.log(id)
    }

    const sexOptions = [
        { name: 'Мужской', value: '1' },
        { name: 'Женский', value: '2' }
    ]

    const [createPetVisible, setCreateDialogVisible] = useState(false);

    // переменные для создания питомца

    const [createPetName, setCreatePetName] = useState('');
    const [createSex, setCreateSex] = useState(null);
    const [createPetType, setCreatePetType] = useState(null);
    const [createBreed, setCreateBreed] = useState(null);
    const [createBirthDate, setCreateBirthDate] = useState(null);
    const [createCoatType, setCreateCoatType] = useState(null);
    const [createCoatColor, setCreateCoatColor] = useState(null);
    const [createChip, setCreateChip] = useState(1);
    const [createChipDate, setCreateChipDate] = useState(null);
    const [createChipNumber, setCreateChipNumber] = useState('');
    const [createChipPlace, setCreateChipPlace] = useState('');
    const [createTattoo, setCreateTattoo] = useState('');
    const [createTattooDate, setCreateTattooDate] = useState(null);

    const { data: breeds, error: breedsError, isLoading: breedsIsLoading, isFetching: breedsIsFetching, refetch: breedsRefetch } = useGetBreedsByPetTypeIdQuery(createPetType?.id);

    const [createPetMutation] = useCreatePetMutation();

    const createPetActionHandler = () => {
        const variablesToCheck = [createPetName, createSex, createPetType, createBreed, createBirthDate, createCoatType, createCoatColor, createTattoo, createTattooDate];

        if (
            variablesToCheck.some(variable => !variable) || (createChip === 2 && [createChipDate, createChipNumber, createChipPlace].some(variable => !variable))
        ) {
            toast.current.show(showToastWarn('Внимание', 'Заполните все поля', 5000))
            return;
        } else {
            createPetAction()
        }
    }

    const createPetAction = async () => {
        const petData = {
            master: localStorage.getItem('user_id'),
            pet_type: createPetType?.id,
            pet_name: createPetName,
            sex: createSex,
            breed_id: createBreed?.id,
            birth_date: createBirthDate,
            coat_color: createCoatColor?.id,
            coat_type: createCoatType?.id,
            tattoo_number: createTattoo,
            date_of_tattoing: createTattooDate,
            ...(createChip !== 1 ? {
                chip: {
                    chip_number: createChipNumber,
                    chip_date: createChipDate,
                    chip_place: createChipPlace,
                }
            } : {})
        };
    
        try {
            const result = await createPetMutation(petData);
            profileRefetch()
            toast?.current?.show(showToastSuccess('Успешно', 'Новый питомец занесен в ваш профиль', 5000))
            setCreateDialogVisible(false)
        } catch (error) {
            toast.current.show(showToastWarn('Внимание', 'Что-то пошло не так, повторите попытку', 5000))
            console.error(error);
        }
    };

    // удаление питомца

    const [deletePetVisible, setDeleteDialogVisible] = useState(false);
    const [selectedPetToDelete, setSelectedPetToDelete] = useState(null);


    const [deletePet] = useDeletePetMutation();

    const deletePetAction = async () => {
        const request = await deletePet(selectedPetToDelete).unwrap()

        console.log('DELETE REQUEST: ', request)

        if (request?.success === 'Pet and its passport deleted') {
            setDeleteDialogVisible(false)
            toast?.current?.show(showToastSuccess('Успешно', `Питомец удален из вашей учетной записи`, 5000))
            if (selectedPetToDelete === localStorage.getItem('current_pet_id')) {
                localStorage.removeItem('current_pet_id')
            }
            window.location.reload()
        } else {
            toast.current.show(showToastWarn('Внимание', 'Что-то пошло не так. Повторите попытку.', 5000))
        }
    }

    // редактирование питомца

    const [editPetVisible, setEditPetVisible] = useState(false);
    const [selectedPetToEdit, setSelectedPetToEdit] = useState(null);


    const [petIdToEdit, setPetIdToEdit] = useState(null);

    const { data: petForEdit, error: petForEditError, isLoading: petForEditIsLoading, isFetching: petForEditIsFetching, refetch: petForEditRefetch } = useGetPetForProfileQuery(petIdToEdit);

    const editPetFetch = (pet) => {
        console.log(pet.id)
        setPetIdToEdit(pet.id)
    }

   

    // переменные для редактирования питомца

    const [editPetName, setEditPetName] = useState('');
    const [editSex, setEditSex] = useState({});
    const [editPetType, setEditPetType] = useState(null);
    const [editBreed, setEditBreed] = useState(null);
    const [editBirthDate, setEditBirthDate] = useState(null);
    const [editCoatType, setEditCoatType] = useState(null);
    const [editCoatColor, setEditCoatColor] = useState(null);
    const [editChip, setEditChip] = useState(1);
    const [editChipDate, setEditChipDate] = useState(null);
    const [editChipNumber, setEditChipNumber] = useState('');
    const [editChipPlace, setEditChipPlace] = useState('');
    const [editTattoo, setEditTattoo] = useState('');
    const [editTattooDate, setEditTattooDate] = useState(null);
    
    useEffect(() => {
        if (petIdToEdit) {
            petForEditRefetch(petIdToEdit?.id).then((res) => {
                setEditPetName(res?.data?.passport?.pet_name)
                setEditSex(res?.data?.passport?.sex)
                setEditPetType(res?.data?.passport?.pet_type)     
                let birthDate = new Date(res?.data?.passport?.birth_date);      
                setEditBirthDate(birthDate)
                setEditCoatType(res?.data?.passport?.coat_type)
                setEditCoatColor(res?.data?.passport?.coat_color)
                if (res?.data?.chip === null) {
                    setEditChip(1)
                } else {
                    setEditChip(2)
                    let chipDate = new Date(res?.data?.chip?.chip_date);  
                    setEditChipDate(chipDate)
                    setEditChipNumber(res?.data?.chip?.chip_number)
                    setEditChipPlace(res?.data?.chip?.chip_place)
                }
                setEditTattoo(res?.data?.passport?.tattoo_number)
                let tattoingDate = new Date(res?.data?.passport?.date_of_tattoing);  
                setEditTattooDate(tattoingDate) 

                setCreatePetType(res?.data?.passport?.pet_type)
                setEditBreed(res?.data?.passport?.breed_id)   
                
                setEditPetVisible(true)
            })
        }
    }, [petIdToEdit])



    // edit functional

    const [editPetMutation] = useEditPetMutation();

    const editPetActionHandler = () => {
        const variablesToCheck = [editPetName, editSex, editPetType, editBreed, editBirthDate, editCoatType, editCoatColor, editTattoo, editTattooDate];
    
        if (
            variablesToCheck.some(variable => !variable) || (editChip === 2 && [editChipDate, editChipNumber, editChipPlace].some(variable => !variable))
        ) {
            toast.current.show(showToastWarn('Внимание', 'Заполните все поля', 5000))
            return;
        } else {
            editPetAction()
        }
    }

    const editPetAction = async () => {
        const petData = {
            master: localStorage.getItem('user_id'),
            pet_type: editPetType?.id,
            pet_name: editPetName,
            sex: editSex,
            breed_id: editBreed?.id,
            birth_date: editBirthDate,
            coat_color: editCoatColor?.id,
            coat_type: editCoatType?.id,
            tattoo_number: editTattoo,
            date_of_tattoing: editTattooDate,
            ...(editChip !== 1 ? {
                chip: {
                    chip_number: editChipNumber,
                    chip_date: editChipDate,
                    chip_place: editChipPlace,
                }
            } : {
                chip: null
            })
        };
        console.log('PET ID: ', petIdToEdit)
        try {
            const result = await editPetMutation({
                body: petData,
                id: petIdToEdit
            });

            console.log('ALARM:', petData, petIdToEdit)
            profileRefetch()
            toast?.current?.show(showToastSuccess('Успешно', 'Изменения применены', 5000))
            setEditPetVisible(false)
            setPetIdToEdit(null)
        } catch (error) {
            toast.current.show(showToastWarn('Внимание', 'Что-то пошло не так, повторите попытку', 5000))
            console.error(error);
        }
    }


    // обновление пароля

    const [updatePasswordDialogVisible, setUpdatePasswordDialogVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');

    const [updatePasswordMutation] = useUpdatePasswordMutation();

    const updatePasswordAction = async () => {
        if (newPassword !== newPasswordRepeat) {
            toast.current.show(showToastWarn('Внимание', 'Пароли не совпадают', 5000))
            return;
        }

        console.log(newPassword)

        const request = await updatePasswordMutation({
            body: {
                password: newPassword
            },
            id: localStorage.getItem('user_id')
        }).unwrap()

        if (!request?.error) {
            toast.current.show(showToastSuccess('Успешно', 'Пароль успешно изменен', 5000))
            setUpdatePasswordDialogVisible(false)
        } else {
            toast.current.show(showToastWarn('Внимание', 'Что-то пошло не так. Повторите попытку.', 5000))
        }

    }


    // обновление профиля

    const [newLogin, setNewLogin] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newSecondName, setNewSecondName] = useState('');
    const [newLastName, setNewLastName] = useState('');


    const [updateProfileDialogVisible, setUpdateProfileDialogVisible] = useState(false);

    const [updateProfileMutation] = useEditUserMutation();

    const openEditProfileDialog = () => {
        setNewLogin(profile?.user?.login)
        setNewNickname(profile?.user?.nickname)
        setNewEmail(profile?.user?.email)
        setNewFirstName(profile?.user?.first_name)
        setNewSecondName(profile?.user?.second_name)
        setNewLastName(profile?.user?.last_name)
        setUpdateProfileDialogVisible(true)
    }
            
    const updateProfileAction = async () => {
        const profileData = {
            login: newLogin,
            nickname: newNickname,
            email: newEmail,
            first_name: newFirstName,
            second_name: newSecondName,
            last_name: newLastName
        };

        try {
            const result = await updateProfileMutation({
                body: profileData,
                id: localStorage.getItem('user_id')
            });

            profileRefetch()
            toast?.current?.show(showToastSuccess('Успешно', 'Изменения применены', 5000))
            setUpdateProfileDialogVisible(false)

        } catch (error) {
            console.error(error);
        }

    }


    const footerContent = (
        <div className='footer-content create-dialog-footer'>
            <Button
                label="Отмена"
                icon="pi pi-times"
                onClick={() => setCreateDialogVisible(false)}
                autoFocus
                className="p-button-cancel p-button-text"
            />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => createPetActionHandler()} className="p-button-submit" />
        </div>
    );

    const footerDeleteContent = (
        <div className='footer-content create-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => setDeleteDialogVisible(false)} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Удалить" icon="pi pi-check" onClick={() => deletePetAction()} className="p-button-submit" />
        </div>
    );

    const footerEditContent = (
        <div className='footer-content create-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setPetIdToEdit(null)
                setEditPetVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => editPetActionHandler()} className="p-button-submit" />
        </div>
    );

    const footerUpdatePasswordContent = (
        <div className='footer-content create-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setUpdatePasswordDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => updatePasswordAction()} className="p-button-submit" />
        </div>
    );

    const footerUpdateProfileContent = (
        <div className='footer-content create-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setUpdateProfileDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => updateProfileAction()} className="p-button-submit" />
        </div>
    );

    // CHART

    const { data: popularServices, error: popularServicesError, isLoading: popularServicesIsLoading, isFetching: popularServicesIsFetching } = useGetPopularServicesQuery(localStorage.getItem('user_id'))

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const labels = popularServices?.services?.map(service => service.service_name);
        const data = popularServices?.services?.map(service => service.count);
    
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Самые популярные услуги',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }
            ]
        };
    
        const chartOptions = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
    
        setChartData(chartData);
        setChartOptions(chartOptions);
    }, [popularServices]);

    return (
        <div className={styles['profile']}>
            <Toast ref={toast} className="" />
            <div className={styles['profile-top']}>
                <div className={styles['profile-top__left']}>
                    <div className={styles['profile-top__left-top']}>
                        <p>{profile?.user?.email}</p>
                    </div>
                    <p className={styles['profile-top__left-full-name']}>
                        {profile?.user?.second_name} {profile?.user?.first_name} {profile?.user?.last_name}
                    </p>
                </div>
                <ul className={styles['profile-top__right__actions-list']}>
                    <li onClick={() => openEditProfileDialog()} className={styles['profile-top__right__actions-list-item']}>
                        <i className='pi pi-pencil' />Редактировать профиль
                    </li>
                    <li onClick={() => setUpdatePasswordDialogVisible(true)} className={styles['profile-top__right__actions-list-item']}>
                        <i className='pi pi-key' />Изменить пароль
                    </li>
                </ul>
            </div>

            {profile?.user?.role?.id !== '2' && profile?.user?.role?.id !== '3' ? (
                <div className={styles['profile-pets']}>
                <h2>Питомцы</h2>
                <div className={styles['profile-pets__list']}>
                    {profile?.user?.pets.map((pet) => (
                        <div key={pet.id} className={styles['profile-pets__list-item']}>
                            <div className={styles['pet-top']}>
                                <p className={styles['pet-top__name']}>{pet?.pet_name}</p>
                                <div className={styles['pet-top__buttons']}>
                                    <button onClick={() => {
                                        editPetFetch(pet)
                                    }}>
                                        <i className='pi pi-pencil' />
                                    </button>
                                    <button onClick={() => {
                                        setSelectedPetToDelete(pet.id)
                                        setDeleteDialogVisible(true)
                                    }}>
                                        <i className='pi pi-trash' />
                                    </button>
                                </div>
                            </div>
                            <div className={styles['pet-info']}>
                                <div className={styles['pet-info__row']}>
                                    <div className={styles['pet-info__row-item']}>
                                        <p>Род</p>
                                        <p>{pet?.pet_type?.name}</p>
                                    </div>
                                    <div className={styles['pet-info__row-item']}>
                                        <p>Пол</p>
                                        <p>{pet?.sex === 1 ? 'М' : 'Ж'}</p>
                                    </div>
                                </div>
                                <div className={styles['pet-info__row']}>
                                    <div className={styles['pet-info__row-item']}>
                                        <p>Тип шерсти</p>
                                        <p>{pet?.coat?.type?.name}</p>
                                    </div>
                                    <div className={styles['pet-info__row-item']}>
                                        <p>Окрас</p>
                                        <p>{pet?.coat?.color?.name}</p>
                                    </div>
                                </div>
                                {pet?.chip?.id && (
                                    <div className={styles['pet-info__row']}>
                                      <div className={styles['pet-info__row-item']}>
                                        <p>Чип</p>
                                        <p>{pet?.chip?.number}</p>
                                      </div>
                                      <div className={styles['pet-info__row-item']}>
                                        <p>Место чипа</p>
                                        <p>{pet?.chip?.chip_place}</p>
                                      </div>
                                    </div>
                                )}
                                <div className={styles['pet-info__row']}>
                                    <div className={styles['pet-info__row-item']}>
                                        <p>Возраст</p>
                                        <p>{
                                            (() => {
                                                const currentDate = new Date();
                                                const birthDate = new Date(pet?.birth_date);
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
                                    </div>
                                    <div className={styles['pet-info__row-item']}>
                                        <p>Порода</p>
                                        <p>{pet?.breed?.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div>
                        <button onClick={() => {setCreateDialogVisible(true)}} className={styles['profile-pets__list-item__add-button']}>
                            <i className='pi pi-plus' />
                            Добавить питомца
                        </button>
                    </div>
                </div>
            </div>
            ) : profile?.user?.role?.id === '3' ? '' : 
                (
                    <div className={styles['profile-pets']}>
                        <h2>Статистика работы</h2>
                        <div className={styles['stat-rows']}>
                            <div className={styles['stat-rows-item']}>
                                <p>Услуг за текущий месяц (все)</p>
                                <p>{popularServices?.total_services_current_month}</p>
                            </div>
                            <div className={styles['stat-rows-item']}>
                                <p>Выручено за месяц</p>
                                <p>{popularServices?.total_revenue_current_month ? popularServices?.total_revenue_current_month : 0} ₽</p>
                            </div>
                        </div>
                        <Chart type="bar" data={chartData} options={chartOptions} />
                    </div>
                )
            }
            
            <Dialog
				header="Добавление питомца"
				footer={footerContent}
				visible={createPetVisible}
				style={{ borderRadius: '30px' }}
				onHide={() => setCreateDialogVisible(false)}
                className='create-dialog'
			>
                <div className='create-dialog-field-wrapper'>
                    <div className="create-dialog-field">
                        <label htmlFor="createSex">Пол</label>
                        <Dropdown
                            value={createSex}
                            id="createSex"
                            options={sexOptions}
                            optionLabel='name'
                            onChange={(e) => {
                                setCreateSex(e.target.value)
                            }}
                            className='create-dialog-field-input'
                        />
                    </div>
                    <div className="create-dialog-field">
                        <label htmlFor="createPetType">Тип питомца</label>
                        <Dropdown
                            value={createPetType}
                            id="createPetType"
                            options={petTypes?.pet_types}
                            optionLabel='pet_type_name'
                            onChange={(e) => {
                                setCreatePetType(e.target.value)
                            }}
                            className='create-dialog-field-input'
                        />
                    </div>
                </div>
                <div className='create-dialog-field-wrapper'>
                    <div className="create-dialog-field">
                        <label htmlFor="createBreed">Порода</label>
                        <Dropdown
                            value={createBreed}
                            id="createBreed"
                            options={Array.isArray(breeds?.breeds) ? breeds?.breeds : []}
                            optionLabel='breed_name'
                            onChange={(e) => {
                                setCreateBreed(e.target.value)
                            }}
                            className='create-dialog-field-input'
                            disabled={createPetType === null}
                        />
                    </div>
                    <div className="create-dialog-field">
                        <label htmlFor="createBirthDate">Дата рождения</label>
                        <Calendar
                            value={createBirthDate}
                            id="createBirthDate"
                            locale='ru'
                            maxDate={new Date()}
                            showIcon
                            onChange={(e) => {
                                setCreateBirthDate(e.target.value)
                            }}
                            className='create-dialog-field-input create-dialog-field-input-calendar'
                        />
                    </div>
                </div>
				<div className="create-dialog-field">
                    <label htmlFor="createPetName">Кличка питомца</label>
                    <InputText
                        value={createPetName}
                        onChange={(e) => {
                            setCreatePetName(e.target.value)
                        }}
                        id="createPetName"
                        className='create-dialog-field-input'
                    />
                </div>
                <div className='create-dialog-field-wrapper'>
                    <div className="create-dialog-field">
                        <label htmlFor="createCoatType">Тип шерсти</label>
                        <Dropdown
                            value={createCoatType}
                            id="createCoatType"
                            options={coatTypes?.coatTypes}
                            optionLabel='coat_type_name'
                            onChange={(e) => {
                                setCreateCoatType(e.target.value)
                            }}
                            className='create-dialog-field-input'
                        />
                    </div>
                    <div className="create-dialog-field">
                        <label htmlFor="createCoatColor">Окрас</label>
                        <Dropdown
                            value={createCoatColor}
                            id="createCoatColor"
                            options={coatColors?.coatColors}
                            optionLabel='color_name'
                            onChange={(e) => {
                                setCreateCoatColor(e.target.value)
                            }}
                            className='create-dialog-field-input'
                        />
                    </div>
                </div>
                <div className='create-dialog-field-wrapper'>
                    <div className="create-dialog-field">
                        <label htmlFor="createChip">Чип</label>
                        <Dropdown
                            value={createChip}
                            id="createChip"
                            options={[{ name: 'Отсутствует', value: 1 }, { name: 'Есть', value: 2 }]}
                            optionLabel='name'
                            onChange={(e) => {
                                setCreateChip(e.target.value)
                            }}
                            className='create-dialog-field-input'
                        />
                    </div>
                    {createChip === 2 && (
                        <div className="create-dialog-field">
                            <label htmlFor="createChipDate">Дата чипирования</label>
                            <Calendar
                                value={createChipDate}
                                id="createChipDate"
                                showIcon
                                maxDate={new Date()}
                                locale='ru'
                                onChange={(e) => {
                                    setCreateChipDate(e.target.value)
                                }}
                                className='create-dialog-field-input create-dialog-field-input-calendar'
                                disabled={createChip === 1}
                            />
                        </div>
                    )}
                </div>
                {createChip === 2 && (
                    <div className='create-dialog-field-wrapper'>
                        <div className="create-dialog-field">
                            <label htmlFor="createChipNumber">Номер чипа</label>
                            <InputText
                                value={createChipNumber}
                                onChange={(e) => {
                                    setCreateChipNumber(e.target.value)
                                }}
                                id="createChipNumber"
                                className='create-dialog-field-input'
                                disabled={createChip === 1}
                            />
                        </div>
                        <div className="create-dialog-field">
                            <label htmlFor="createChipPlace">Место чипа</label>
                            <InputText
                                value={createChipPlace}
                                onChange={(e) => {
                                    setCreateChipPlace(e.target.value)
                                }}
                                id="createChipPlace"
                                tooltip='Напишите, где находится чип, например: Холка'
                                tooltipOptions={{ position: 'right' }}
                                className='create-dialog-field-input'
                                disabled={createChip === 1}
                            />
                        </div>
                    </div>
                )}
                <div className='create-dialog-field-wrapper'>
                    <div className="create-dialog-field">
                        <label htmlFor="createTattoo">Клеймо</label>
                        <InputText
                            value={createTattoo}
                            id="createTattoo"
                            tooltip='Номер клейма обычно находится на внутренней стороне уха или на животе питомца.'
                            tooltipOptions={{ position: 'left' }}
                            onChange={(e) => {
                                setCreateTattoo(e.target.value)
                            }}
                            className='create-dialog-field-input'
                        />
                    </div>
                    <div className="create-dialog-field">
                            <label htmlFor="createTattooDate">Дата клеймения</label>
                            <Calendar
                                value={createTattooDate}
                                id="createTattooDate"
                                showIcon
                                maxDate={new Date()}
                                locale='ru'
                                onChange={(e) => {
                                    setCreateTattooDate(e.target.value)
                                }}
                                className='create-dialog-field-input create-dialog-field-input-calendar'
                            />
                        </div>
                </div>
			</Dialog>
            <Dialog
				header="Изменение данных о питомце"
				footer={footerEditContent}
				visible={editPetVisible}
				style={{ borderRadius: '30px' }}
				onHide={() => {
                    setPetIdToEdit(null)
                    setEditPetVisible(false)
                }}
                className='create-dialog'
			>
                <div className='create-dialog-field-wrapper'>
                    <div className="create-dialog-field">
                        <label htmlFor="editSex">Пол</label>
                        <Dropdown
                            value={editSex}
                            id="editSex"
                            options={sexOptions}
                            optionLabel='name'
                            onChange={(e) => {
                                setEditSex(e.target.value)
                            }}
                            className='create-dialog-field-input'
                        />
                    </div>
                    <div className="create-dialog-field">
                        <label htmlFor="editPetType">Тип питомца</label>
                        <Dropdown
                            value={editPetType}
                            id="editPetType"
                            options={petTypes?.pet_types}
                            optionLabel='pet_type_name'
                            onChange={(e) => {
                                setCreatePetType(e.target.value)
                                setEditPetType(e.target.value)
                            }}
                            className='create-dialog-field-input'
                        />
                    </div>
                </div>
                <div className='create-dialog-field-wrapper'>
                    <div className="create-dialog-field">
                        <label htmlFor="editBreed">Порода</label>
                        <Dropdown
                            value={editBreed}
                            id="editBreed"
                            options={Array.isArray(breeds?.breeds) ? breeds?.breeds : []}
                            optionLabel='breed_name'
                            onChange={(e) => {
                                setEditBreed(e.target.value)
                            }}
                            className='create-dialog-field-input'
                            disabled={editPetType === null}
                        />
                    </div>
                    <div className="create-dialog-field">
                        <label htmlFor="editBirthDate">Дата рождения</label>
                        <Calendar
                            value={editBirthDate}
                            id="editBirthDate"
                            showIcon
                            maxDate={new Date()}
                            onChange={(e) => {
                                setEditBirthDate(e.target.value)
                            }}
                            dateFormat="yy-mm-dd"
                            className='create-dialog-field-input create-dialog-field-input-calendar'
                        />
                    </div>
                </div>
				<div className="create-dialog-field">
                    <label htmlFor="editPetName">Кличка питомца</label>
                    <InputText
                        value={editPetName}
                        onChange={(e) => {
                            setEditPetName(e.target.value)
                        }}
                        id="createPetName"
                        className='create-dialog-field-input'
                    />
                </div>
                <div className='create-dialog-field-wrapper'>
                    <div className="create-dialog-field">
                        <label htmlFor="editCoatType">Тип шерсти</label>
                        <Dropdown
                            value={editCoatType}
                            id="editCoatType"
                            options={coatTypes?.coat_types}
                            optionLabel='coat_type'
                            onChange={(e) => {
                                setEditCoatType(e.target.value)
                            }}
                            className='create-dialog-field-input'
                        />
                    </div>
                    <div className="create-dialog-field">
                        <label htmlFor="editCoatColor">Окрас</label>
                        <Dropdown
                            value={editCoatColor}
                            id="editCoatColor"
                            options={coatColors?.coat_colors}
                            optionLabel='coat_color'
                            onChange={(e) => {
                                setEditCoatColor(e.target.value)
                            }}
                            className='create-dialog-field-input'
                        />
                    </div>
                </div>
                <div className='create-dialog-field-wrapper'>
                    <div className="create-dialog-field">
                        <label htmlFor="editChip">Чип</label>
                        <Dropdown
                            value={editChip}
                            id="editChip"
                            options={[{ name: 'Отсутствует', value: 1 }, { name: 'Есть', value: 2 }]}
                            optionLabel='name'
                            onChange={(e) => {
                                setEditChip(e.target.value)
                            }}
                            className='create-dialog-field-input'
                        />
                    </div>
                    {editChip === 2 && (
                        <div className="create-dialog-field">
                            <label htmlFor="editChipDate">Дата чипирования</label>
                            <Calendar
                                value={editChipDate}
                                id="createChipDate"
                                showIcon
                                locale='ru'
                                maxDate={new Date()}
                                dateFormat="yy-mm-dd"
                                onChange={(e) => {
                                    setEditChipDate(e.target.value)
                                }}
                                className='create-dialog-field-input create-dialog-field-input-calendar'
                                disabled={editChip === 1}
                            />
                        </div>
                    )}
                </div>
                {editChip === 2 && (
                    <div className='create-dialog-field-wrapper'>
                        <div className="create-dialog-field">
                            <label htmlFor="editChipNumber">Номер чипа</label>
                            <InputText
                                value={editChipNumber}
                                onChange={(e) => {
                                    setEditChipNumber(e.target.value)
                                }}
                                id="editChipNumber"
                                className='create-dialog-field-input'
                                disabled={editChip === 1}
                            />
                        </div>
                        <div className="create-dialog-field">
                            <label htmlFor="editChipPlace">Место чипа</label>
                            <InputText
                                value={editChipPlace}
                                onChange={(e) => {
                                    setEditChipPlace(e.target.value)
                                }}
                                id="editChipPlace"
                                tooltip='Напишите, где находится чип, например: Холка'
                                tooltipOptions={{ position: 'right' }}
                                className='create-dialog-field-input'
                                disabled={editChip === 1}
                            />
                        </div>
                    </div>
                )}
                <div className='create-dialog-field-wrapper'>
                    <div className="create-dialog-field">
                        <label htmlFor="editTattoo">Клеймо</label>
                        <InputText
                            value={editTattoo}
                            id="editTattoo"
                            tooltip='Номер клейма обычно находится на внутренней стороне уха или на животе питомца.'
                            tooltipOptions={{ position: 'left' }}
                            onChange={(e) => {
                                setEditTattoo(e.target.value)
                            }}
                            className='create-dialog-field-input'
                        />
                    </div>
                    <div className="create-dialog-field">
                            <label htmlFor="editTattooDate">Дата клеймения</label>
                            <Calendar
                                value={editTattooDate}
                                id="editTattooDate"
                                showIcon
                                maxDate={new Date()}
                                locale='ru'
                                dateFormat="yy-mm-dd"
                                onChange={(e) => {
                                    setEditTattooDate(e.target.value)
                                }}
                                className='create-dialog-field-input create-dialog-field-input-calendar'
                            />
                        </div>
                </div>
			</Dialog>
            <Dialog
				header="Удаление питомца"
				footer={footerDeleteContent}
				visible={deletePetVisible}
				style={{ borderRadius: '30px' }}
				onHide={() => setDeleteDialogVisible(false)}
                className='create-dialog'
			>
                <i className='pi pi-info-circle' style={{ marginRight: '10px' }} />Вы действительно хотите удалить питомца?
            </Dialog>

            <Dialog
				header="Обновление пароля"
				footer={footerUpdatePasswordContent}
				visible={updatePasswordDialogVisible}
				style={{ borderRadius: '30px' }}
				onHide={() => setUpdatePasswordDialogVisible(false)}
                className='create-dialog'
			>
                <div className="create-dialog-field">
                    <label htmlFor="newPassword">Новый пароль</label>
                    <InputText
                        value={newPassword}
                        id="newPassword"
                        onChange={(e) => {
                            setNewPassword(e.target.value)
                        }}
                        className='create-dialog-field-input'
                    />
                </div>
                <div className="create-dialog-field">
                    <label htmlFor="newPasswordRepeat">Повторите пароль</label>
                    <InputText
                        value={newPasswordRepeat}
                        id="newPasswordRepeat"
                        onChange={(e) => {
                            setNewPasswordRepeat(e.target.value)
                        }}
                        className='create-dialog-field-input'
                    />
                </div>
            </Dialog>

            <Dialog
				header="Обновление профиля"
				footer={footerUpdateProfileContent}
				visible={updateProfileDialogVisible}
				style={{ borderRadius: '30px' }}
				onHide={() => setUpdateProfileDialogVisible(false)}
                className='create-dialog'
			>
                <div className="create-dialog-field">
                    <label htmlFor="newEmail">E-Mail</label>
                    <InputText
                        value={newEmail}
                        id="newEmail"
                        onChange={(e) => {
                            setNewEmail(e.target.value)
                        }}
                        className='create-dialog-field-input'
                    />
                </div>
                <div className="create-dialog-field">
                    <label htmlFor="newNickname">Никнейм</label>
                    <InputText
                        value={newNickname}
                        id="newNickname"
                        onChange={(e) => {
                            setNewNickname(e.target.value)
                        }}
                        className='create-dialog-field-input'
                    />
                </div>
                <div className="create-dialog-field">
                    <label htmlFor="newSecondName">Фамилия</label>
                    <InputText
                        value={newSecondName}
                        id="newSecondName"
                        onChange={(e) => {
                            setNewSecondName(e.target.value)
                        }}
                        className='create-dialog-field-input'
                    />
                </div>
                <div className="create-dialog-field">
                    <label htmlFor="newFirstName">Имя</label>
                    <InputText
                        value={newFirstName}
                        id="newFirstName"
                        onChange={(e) => {
                            setNewFirstName(e.target.value)
                        }}
                        className='create-dialog-field-input'
                    />
                </div>
                <div className="create-dialog-field">
                    <label htmlFor="newLastName">Отчество</label>
                    <InputText
                        value={newLastName}
                        id="newLastName"
                        onChange={(e) => {
                            setNewLastName(e.target.value)
                        }}
                        className='create-dialog-field-input'
                    />
                </div>
            </Dialog>
        </div>
    )
}

export default ProfileComponent;