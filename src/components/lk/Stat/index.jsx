import React, { useRef, useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { Dialog } from 'primereact/dialog';
import { showToastError, showToastSuccess, showToastWarn } from '../../../utils/showToast'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { FilterMatchMode } from 'primereact/api';
import { Chart } from 'primereact/chart';
import { Calendar } from 'primereact/calendar';
import { format } from 'date-fns';

import { useGetServicesComparisonQuery } from '../../../store/api/chartApi';

import styles from './Index.module.scss';

const StatComponent = () => {

	const date = new Date();
	date.setMonth(date.getMonth() - 1);
	const [startDate, setStartDate] = useState(date);

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const [endDate, setEndDate] = useState(today);

	const { data: servicesComparison, refetch: servicesComparisonRefetch } = useGetServicesComparisonQuery({ 
	    start_date: format(startDate, 'yyyy-MM-dd'), 
	    end_date: format(endDate, 'yyyy-MM-dd') 
	});

	useEffect(() => {
		console.log('AAA:', servicesComparison)
	}, [servicesComparison])

	const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

	useEffect(() => {
		const documentStyle = getComputedStyle(document.documentElement);
		const textColor = documentStyle.getPropertyValue('--text-color');
		const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
		const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
	
		// Используем services из props вместо статического массива
		const services = servicesComparison?.services;
	
		const labels = [...new Set(services?.map(service => service.event_date))];

		function shadeColor(color, percent) {
			const R = parseInt(color.substring(1,3),16);
			const G = parseInt(color.substring(3,5),16);
			const B = parseInt(color.substring(5,7),16);
		
			const getHex = c => ("0" + parseInt(c).toString(16)).slice(-2);
		
			const t = percent < 0 ? 0 : 255;
			const p = percent < 0 ? percent * -1 : percent;
			const converted = 255 * p;
		
			return "#" + getHex((t - R) * p + R) + getHex((t - G) * p + G) + getHex((t - B) * p + B);
		}
	
		const datasets = services?.reduce((acc, service) => {
			const index = acc.findIndex(dataset => dataset.label === service?.veterinarian_nickname);
			if (index === -1) {
				acc.push({
					label: service.veterinarian_nickname,
					data: labels.map(label => label === service.event_date ? Number(service.service_count) : 0),
					fill: false,
					borderColor: documentStyle.getPropertyValue('--blue-500'),
					backgroundColor: shadeColor('#576C70', Math.random() - 0.5), // Генерируем оттенок основного цвета
					tension: 0.4
				});
			} else {
				acc[index].data[labels.indexOf(service.event_date)] = Number(service.service_count);
			}
			return acc;
		}, []);
	
		const data = {
			labels: labels,
			datasets: datasets
		};
	
		const options = {
			maintainAspectRatio: false,
			aspectRatio: 0.6,
			plugins: {
				legend: {
					labels: {
						color: textColor
					}
				}
			},
			scales: {
				x: {
					ticks: {
						color: textColorSecondary
					},
					grid: {
						color: surfaceBorder
					}
				},
				y: {
					ticks: {
						color: textColorSecondary
					},
					grid: {
						color: surfaceBorder
					}
				}
			}
		};
	
		setChartData(data);
		setChartOptions(options);
	}, [servicesComparison]); // Добавляем props.services в зависимости useEffect, чтобы он обновлялся при изменении данных

	const [dateStart, setDateStart] = useState(new Date());
	const [dateEnd, setDateEnd] = useState(new Date());

    return (
		<div className={styles['stat-wrapper']}>
			<div className={styles['stat-wrapper-title']}>
				<h2 className=''>Статистика за указанный период</h2>
			</div>
			<div className={styles['stat-wrapper-form']}>
				<div className={styles['stat-wrapper-form-item']}>
					<label className='form-item__label' htmlFor="date">Время</label>
                    <Calendar
                        className='form-item__input'
                        value={startDate}
                        onChange={(e) => setStartDate(e.value)}
                        showIcon
                        icon={() => <i className="pi pi-clock" />}
                    />  
				</div>
				<div className={styles['stat-wrapper-form-item']}>
					<label className='form-item__label' htmlFor="date">Время</label>
					<Calendar
						className='form-item__input'
						value={endDate}
						onChange={(e) => setEndDate(e.value)}
						showIcon
						icon={() => <i className="pi pi-clock" />}
					/>
				</div>
				<Button onClick={servicesComparisonRefetch} className='p-button-submit' icon='pi pi-refresh' label='Обновить'></Button>
			</div>
			<Chart className={styles['stat-wrapper-chart']} type="bar" data={chartData} options={chartOptions} />
			<ul className={styles['journal-pet']}>
                <li className={styles['journal-pet__item']}>
                    <p>Самый популярный вид</p>
                    <p>{servicesComparison?.most_common_animal_type?.pet_type_name}</p>
                </li>
                <li className={styles['journal-pet__item']}>
                    <p>Самая популярная услуга</p>
                    <p>{servicesComparison?.most_common_service}</p>
                </li>
                <li className={styles['journal-pet__item']}>
                    <p>Самый продуктивный работник</p>
                    <p>{servicesComparison?.most_productive_employee?.second_name} {servicesComparison?.most_productive_employee?.first_name} {servicesComparison?.most_productive_employee?.last_name}</p>
                </li>
				<li className={styles['journal-pet__item']}>
                    <p>Общая выручка</p>
                    <p>{servicesComparison?.total_revenue === null ? 0 : servicesComparison?.total_revenue}</p>
                </li>
            </ul>
		</div>
    )
}

export default StatComponent;