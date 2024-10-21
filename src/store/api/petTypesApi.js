import { apiWrapper } from '../apiWrapper';

export const petTypesAPI = apiWrapper
    .enhanceEndpoints({ addTagTypes: ['Users'] })
    .injectEndpoints({
    endpoints: (builder) => ({
        getTypes: builder.query({
            query: (body) => ({
                url: 'types/get_all',
                method: 'GET',
                responseHandler: (response) => response.json()
            })
        })
    })
})

export const {
    useGetTypesQuery
} = petTypesAPI
