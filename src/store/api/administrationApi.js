import { apiWrapper } from '../apiWrapper';

export const authAPI = apiWrapper
    .enhanceEndpoints({ addTagTypes: ['Services'] })
    .injectEndpoints({
    endpoints: (builder) => ({
        getServices: builder.query({
            query: () => ({
                url: 'services/get_all',
                method: 'GET',
                responseHandler: (response) => [response.json()]
            })
        }),
        createService: builder.mutation({
            query: ({ body }) => ({
                url: 'services/create',
                method: 'POST',
                body
            })
        }),
        deleteService: builder.mutation({
            query: ({ id }) => ({
                url: `services/delete/${id}`,
                method: 'DELETE'
            })
        }),
        editService: builder.mutation({
            query: ({ body, id }) => ({
                url: `services/edit/${id}`,
                method: 'PUT',
                body
            })
        }),




        getRoles: builder.query({
            query: () => ({
                url: 'roles/get_all',
                method: 'GET',
                responseHandler: (response) => [response.json()]
            })
        }),
        createRole: builder.mutation({
            query: ({ body }) => ({
                url: 'roles/create',
                method: 'POST',
                body
            })
        }),
        deleteRole: builder.mutation({
            query: ({ id }) => ({
                url: `roles/delete/${id}`,
                method: 'DELETE'
            })
        }),
        editRole: builder.mutation({
            query: ({ body, id }) => ({
                url: `roles/edit/${id}`,
                method: 'PUT',
                body
            })
        }),



        getPetTypes: builder.query({
            query: () => ({
                url: 'pet_types/get_all',
                method: 'GET',
                responseHandler: (response) => [response.json()]
            })
        }),
        createPetType: builder.mutation({
            query: ({ body }) => ({
                url: 'pet_types/create',
                method: 'POST',
                body
            })
        }),
        deletePetType: builder.mutation({
            query: ({ id }) => ({
                url: `pet_types/delete/${id}`,
                method: 'DELETE'
            })
        }),
        editPetType: builder.mutation({
            query: ({ body, id }) => ({
                url: `pet_types/edit/${id}`,
                method: 'PUT',
                body
            })
        }),



        getCoatColors: builder.query({
            query: () => ({
                url: 'coat_colors/get_all',
                method: 'GET',
                responseHandler: (response) => [response.json()]
            })
        }),
        createCoatColor: builder.mutation({
            query: ({ body }) => ({
                url: 'coat_colors/create',
                method: 'POST',
                body
            })
        }),
        deleteCoatColor: builder.mutation({
            query: ({ id }) => ({
                url: `coat_colors/delete/${id}`,
                method: 'DELETE'
            })
        }),
        editCoatColor: builder.mutation({
            query: ({ body, id }) => ({
                url: `coat_colors/edit/${id}`,
                method: 'PUT',
                body
            })
        }),


        getCoatTypes: builder.query({
            query: () => ({
                url: 'coat_types/get_all',
                method: 'GET',
                responseHandler: (response) => [response.json()]
            })
        }),
        createCoatType: builder.mutation({
            query: ({ body }) => ({
                url: 'coat_types/create',
                method: 'POST',
                body
            })
        }),
        deleteCoatType: builder.mutation({
            query: ({ id }) => ({
                url: `coat_types/delete/${id}`,
                method: 'DELETE'
            })
        }),
        editCoatType: builder.mutation({
            query: ({ body, id }) => ({
                url: `coat_types/edit/${id}`,
                method: 'PUT',
                body
            })
        }),



        getBreeds: builder.query({
            query: () => ({
                url: 'breeds/get_all',
                method: 'GET',
                responseHandler: (response) => [response.json()]
            })
        }),
        createBreed: builder.mutation({
            query: ({ body }) => ({
                url: 'breeds/create',
                method: 'POST',
                body
            })
        }),
        deleteBreed: builder.mutation({
            query: ({ id }) => ({
                url: `breeds/delete/${id}`,
                method: 'DELETE'
            })
        }),
        editBreed: builder.mutation({
            query: ({ body, id }) => ({
                url: `breeds/edit/${id}`,
                method: 'PUT',
                body
            })
        }),
    })
})

export const {
    useGetServicesQuery,
    useCreateServiceMutation,
    useDeleteServiceMutation,
    useEditServiceMutation,

    useGetRolesQuery,
    useCreateRoleMutation,
    useDeleteRoleMutation,
    useEditRoleMutation,

    useGetPetTypesQuery,
    useCreatePetTypeMutation,
    useDeletePetTypeMutation,
    useEditPetTypeMutation,

    useGetCoatColorsQuery,
    useCreateCoatColorMutation,
    useDeleteCoatColorMutation,
    useEditCoatColorMutation,

    useGetCoatTypesQuery,
    useCreateCoatTypeMutation,
    useDeleteCoatTypeMutation,
    useEditCoatTypeMutation,

    useGetBreedsQuery,
    useCreateBreedMutation,
    useDeleteBreedMutation,
    useEditBreedMutation,
} = authAPI
