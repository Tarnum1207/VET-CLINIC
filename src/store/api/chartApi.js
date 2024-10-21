import { apiWrapper } from '../apiWrapper';

export const chartAPI = apiWrapper
    .enhanceEndpoints({ addTagTypes: [''] })
    .injectEndpoints({
    endpoints: (builder) => ({
        getPopularServices: builder.query({
            query: (id) => ({
                url: `chart/popular_services/${id}`,
                method: 'GET',
                responseHandler: (response) => response.json()
            })
        }),
        getServicesComparison: builder.query({
            query: ({ start_date, end_date }) => ({
                url: `chart/services_comparison/${start_date}/${end_date}`,
                method: 'GET',
                responseHandler: (response) => response.json()
            })
        }),
    })
})

export const {
    useGetPopularServicesQuery,
    useGetServicesComparisonQuery
} = chartAPI
