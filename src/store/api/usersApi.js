import { apiWrapper } from '../apiWrapper';

export const usersAPI = apiWrapper
    .enhanceEndpoints({ addTagTypes: ['Users', 'Roles'] })
    .injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => ({
                url: 'users/get_all',
                responseHandler: (response) => [response.json()]
            }),
            providesTags: ['Users']
        }),
        getUserById: builder.query({
            query: (id) => ({
                url: `users/get_one/${id}`,
                responseHandler: (response) => [response.json()]
            }),
            providesTags: ['Users']
        }),
        getProfileByUserId: builder.query({
            query: (id) => ({
                url: `users/get_profile/${id}`,
                responseHandler: (response) => [response.json()]
            }),
            providesTags: ['Users']
        }),
        updatePassword: builder.mutation({
            query: ({ body, id }) => ({
                url: `users/new_password/${id}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Users']
        }),
        editUser: builder.mutation({
            query: ({ body, id }) => ({
                url: `users/edit/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['Users']
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `users/delete/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Users']
        }),
        editRole: builder.mutation({
            query: ({ body, id }) => ({
                url: `users/change_role/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['Users']
        }),

        getRoles: builder.query({
            query: () => ({
                url: `roles/get_all`,
                responseHandler: (response) => [response.json()]
            }),
            invalidatesTags: ['Roles']
        }),
    })
})

export const {
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useGetProfileByUserIdQuery,
    useUpdatePasswordMutation,
    useEditUserMutation,
    useDeleteUserMutation,
    useEditRoleMutation,

    useGetRolesQuery
} = usersAPI
