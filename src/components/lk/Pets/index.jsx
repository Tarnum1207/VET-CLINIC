import React, { useRef, useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { Dialog } from 'primereact/dialog';
import { showToastError, showToastSuccess, showToastWarn } from '../../../utils/showToast'
import { Toast } from 'primereact/toast'
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

import { useGetServicesQuery } from '../../../store/api/servicesApi';

import { useCreateJournalMutation } from '../../../store/api/journalApi';

import { useGetUserByIdQuery } from '../../../store/api/usersApi';

import styles from './Index.module.scss';

import { useGetAllPetsQuery } from '../../../store/api/petsApi';

import { useNavigate } from 'react-router-dom';

const PetsComponent = () => {
	const current_pet_id = localStorage.getItem('current_pet_id');
	const toast = useRef(null);
	const [selectedTableRow, setSelectedTableRow] = useState(null)
	const navigation = useNavigate()

    const { data: user } = useGetUserByIdQuery(localStorage.getItem('user_id'));

    useEffect(() => {
        if (user) {
            console.log("USER:", user)
            if (user?.role_id !== '2' && user?.role_id !== '3') {
                navigation('/lk/profile')
            }
        }
    }, [user])

    const [date, setDate] = useState(null)
    const [time, setTime] = useState(null)
    const [service, setService] = useState(null)
    const [problem, setProblem] = useState(null)

    const { data: services } = useGetServicesQuery();
    const { data: pets } = useGetAllPetsQuery();

    const actionsMenuData = [
		{
			label: 'Записать на прием',
			icon: 'pi pi-plus',
			command: () => {
                setCreateJournalVisible(true)
            }
		}
	]

    // Фильтрация таблицы

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Поиск" />
            </IconField>
        );
    };

    const header = renderHeader();

    const menu = useRef(null)

    const actionsOverlay = (event, rowData) => {
		menu?.current?.toggle(event)
		setSelectedTableRow(rowData)
	}

    const [createCalendarTaskLoading, setCreateCalendarTaskLoading] = useState(false)

    const [createJournalVisible, setCreateJournalVisible] = useState(false)

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
                pet_passport_id: selectedTableRow?.id,
                veterinarian_id: user?.role_id !== '2' ? undefined : localStorage.getItem('user_id')
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

    const createJournalFooter = (
        <div className='footer-content'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => setSelectedTableRow(null)} className="p-button-cancel p-button-text" />
            <Button label="Записать" icon="pi pi-check" onClick={() => createCalendarTaskAction()} autoFocus className="p-button-submit" />
        </div>
    )

    const displayActions = (rowData) => {
		return (
			<>
				<TieredMenu
					model={actionsMenuData}
					popup
					ref={menu}
					id='popup_menu'
					className='vm-actions pets-actions'
					style={{ width: 'auto' }}
				/>
				<Button
					onClick={(event) => actionsOverlay(event, rowData)}
					icon='pi pi-ellipsis-v'
					className='p-button-rounded actions-button'
				/>
			</>
		)
	}

    return (
		<>
			<Toast ref={toast} className="" />
        	<DataTable
        	    className={styles.table}
        	    value={pets?.pets}
        	    rows={13}
        	    stripedRows
        	    removableSort
        	    size='small'
        	    paginator
                filters={filters} 
                onFilter={(e) => setFilters(e.filters)}
                header={header}
				emptyMessage={'Нет подходящих питомцев по ваш запрос'}
        	    currentPageReportTemplate='Показано {first}-{last} из {totalRecords}'
        	    paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
        	>
        	    <Column style={{height: '20px'}} field="name" sortable header="Кличка"></Column>
                <Column style={{height: '20px'}} field="master_second_name" sortable header="Фамилия хозяина"></Column>
                <Column style={{height: '20px'}} field="master_first_name" sortable header="Имя хозяина"></Column>
                <Column style={{height: '20px'}} field="master_last_name" sortable header="Отчество хозяина"></Column>
                <Column style={{height: '20px'}} field="pet_type" sortable header="Вид"></Column>
        	    <Column style={{height: '20px'}} header="Действия" body={displayActions}></Column>
        	</DataTable>
            <Dialog
                visible={createJournalVisible}
                onHide={() => setCreateJournalVisible(false)}
                header='Запись на прием'
                footer={createJournalFooter}
            >
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
            </Dialog>
		</>
    )
}

export default PetsComponent;