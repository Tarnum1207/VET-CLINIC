import { apiWrapper } from '../apiWrapper';

export const servicesAPI = apiWrapper
    .enhanceEndpoints({ addTagTypes: ['Services'] })
    .injectEndpoints({
    endpoints: (builder) => ({
        getServices: builder.query({
            query: () => ({
                url: `services/get_all`,
                responseHandler: (response) => [response.json()]
            })
        }),
    })
})

export const {
    useGetServicesQuery
} = servicesAPI
