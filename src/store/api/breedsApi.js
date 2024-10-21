import { apiWrapper } from '../apiWrapper';

export const breedsAPI = apiWrapper
    .enhanceEndpoints({ addTagTypes: ['breeds'] })
    .injectEndpoints({
    endpoints: (builder) => ({
        getBreedsByPetTypeId: builder.query({
            query: (id) => ({
                url: `breeds/get_one/by_pet_type/${id}`,
                method: 'GET',
                responseHandler: (response) => response.json()
            })
        })
    })
})

export const {
    useGetBreedsByPetTypeIdQuery
} = breedsAPI
