import { apiWrapper } from '../apiWrapper';

export const coatsAPI = apiWrapper
    .enhanceEndpoints({ addTagTypes: ['coat'] })
    .injectEndpoints({
    endpoints: (builder) => ({
        getCoatTypes: builder.query({
            query: () => ({
                url: `coat/types/get_all`,
                method: 'GET',
                responseHandler: (response) => response.json()
            })
        }),
        getCoatColors: builder.query({
            query: () => ({
                url: `coat/colors/get_all`,
                method: 'GET',
                responseHandler: (response) => response.json()
            })
        })
    })
})

export const {
    useGetCoatTypesQuery,
    useGetCoatColorsQuery
} = coatsAPI
