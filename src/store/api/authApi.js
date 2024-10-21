import { apiWrapper } from '../apiWrapper';

export const authAPI = apiWrapper
    .enhanceEndpoints({ addTagTypes: ['Users'] })
    .injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: 'auth/login',
                method: 'POST',
                body,
                responseHandler: (response) => [response.json()]
            })
        }),
        registration: builder.mutation({
            query: (body) => ({
                url: 'auth/registration',
                method: 'POST',
                body,
                responseHandler: (response) => [response.json()]
            })
        })
    })
})

export const {
    useLoginMutation,
    useRegistrationMutation
} = authAPI
