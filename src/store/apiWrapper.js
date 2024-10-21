import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from './customBaseQuery'

// Обертка для всех остальных эндпоинтов, 
// позволяющая сбрасывать кэш одним действием apiWrapper.util.resetApiState(),
// который вызываем в месте смены региона.
// Эндпоинт оборачиваем во враппер при помощи injectEndpoints. 
// Если нужны теги, добавляем перед inject.. вызов enhanceEndpoints

export const apiWrapper = createApi({
    reducerPath: 'apiWrapper',
    baseQuery: customBaseQuery,
    keepUnusedDataFor: window?.Cypress?.env('CYPRESS_NODE_ENV') === 'test' ? 0 : 60,
    endpoints: () => ({}),
});
