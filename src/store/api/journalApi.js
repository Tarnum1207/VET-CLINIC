import { apiWrapper } from '../apiWrapper';

export const journalAPI = apiWrapper
    .enhanceEndpoints({ addTagTypes: ['Journal'] })
    .injectEndpoints({
    endpoints: (builder) => ({
        getJournalList: builder.query({
            query: () => ({
                url: `journal/get_all`,
                responseHandler: (response) => [response.json()]
            }),
            providesTags: ['Journal']
        }),
        getJournalListByPassportId: builder.query({
            query: ({ user, passport }) => ({
                url: `journal/get_by_pet_passport/${user}/${passport}`,
                responseHandler: (response) => [response.json()]
            }),
            providesTags: ['Journal']
        }),
        getJournalListByUserId: builder.query({
            query: (user) => ({
                url: `journal/get_by_user/${user}`,
                responseHandler: (response) => [response.json()]
            }),
            providesTags: ['Journal']
        }),
        getJournalListByVeterinarianId: builder.query({
            query: (id) => ({
                url: `journal/get_by_vet/${id}`,
                responseHandler: (response) => [response.json()]
            }),
            providesTags: ['Journal']
        }),
        getJournalItemById: builder.query({
            query: (id) => ({
                url: `journal/get_one/${id}`,
                responseHandler: (response) => response.json()
            }),
            providesTags: ['Journal']
        }),
        createJournal: builder.mutation({
            query: (body) => ({
                url: 'journal/create',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Journal']
        }),
        updateJournal: builder.mutation({
            query: ({ id, body }) => ({
                url: `journal/edit/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['Journal']
        }),
        deleteJournal: builder.mutation({
            query: (id) => ({
                url: `journal/delete/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Journal']
        })
    })
})

export const {
    useGetJournalListQuery,
    useGetJournalListByPassportIdQuery,
    useGetJournalListByUserIdQuery,
    useGetJournalListByVeterinarianIdQuery,
    useCreateJournalMutation,
    useGetJournalItemByIdQuery,
    useUpdateJournalMutation,
    useDeleteJournalMutation
} = journalAPI
