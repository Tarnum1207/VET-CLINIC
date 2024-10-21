import { apiWrapper } from '../apiWrapper';

export const petTypesAPI = apiWrapper
    .enhanceEndpoints({ addTagTypes: ['Pets'] })
    .injectEndpoints({
    endpoints: (builder) => ({
        getAllPets: builder.query({
            query: () => ({
                url: `pets/get_all`,
                method: 'get',
                responseHandler: (response) => response.json()
            }),
            providesTags: ['Pets']
        }),
        getPetForProfile: builder.query({
            query: (id) => ({
                url: `pets/get_one/${id}`,
                method: 'get',
                responseHandler: (response) => response.json()
            })
        }),
        createPet: builder.mutation({
            query: (body) => ({
                url: 'pets/create',
                method: 'POST',
                body,
                responseHandler: (response) => response.json()
            }),
            invalidatesTags: ['Pets']
        }),
        editPet: builder.mutation({
            query: ({ body, id }) => ({
                url: `pets/edit/${id}`,
                method: 'PUT',
                body,
                responseHandler: (response) => response.json()
            })
        }),
        deletePet: builder.mutation({
            query: (id) => ({
                url: `pets/delete/${id}`,
                method: 'DELETE',
            })
        }),
    })
})

export const {
    useGetAllPetsQuery,
    useGetPetForProfileQuery,
    useCreatePetMutation,
    useEditPetMutation,
    useDeletePetMutation
} = petTypesAPI
