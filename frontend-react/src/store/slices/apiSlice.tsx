import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL, AUTHORIZATION_TOKEN, ENDPOINTS} from '../../config';

import {
  ProductType,
  BannerType,
  CarouselType,
  TagType,
  CategoryType,
  PromocodeType,
} from '../../types';
import { OrderType } from '../../types/OrderType';

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('authorization', `Bearer ${AUTHORIZATION_TOKEN}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<{products: ProductType[]}, void>({
      query: () => ENDPOINTS.get.products,
    }),
    getBanners: builder.query<{banners: BannerType[]}, void>({
      query: () => ENDPOINTS.get.banners,
    }),
    getCarousel: builder.query<{carousel: CarouselType[]}, void>({
      query: () => ENDPOINTS.get.carousel,
    }),
    getCategories: builder.query<{categories: CategoryType[]}, void>({
      query: () => ENDPOINTS.get.categories,
    }),
    getReviews: builder.query<{reviews: any[]}, void>({
      query: () => ENDPOINTS.get.reviews,
    }),
    getUsers: builder.query<{users: any[]}, void>({
      query: () => ENDPOINTS.get.users,
    }),
    getTags: builder.query<{tags: TagType[]}, void>({
      query: () => ENDPOINTS.get.tags,
    }),
    getPromocodes: builder.query<{promocodes: PromocodeType[]}, void>({
      query: () => ENDPOINTS.get.promocodes,
    }),

    createOrder: builder.mutation<{ id: number }, OrderType>({
      query: (orderData) => ({
        url: ENDPOINTS.post.order,
        method: 'POST',
        body: orderData,
      }),
    }),
    
  }),
});

export const {
  useGetTagsQuery,
  useGetUsersQuery,
  useGetBannersQuery,
  useGetReviewsQuery,
  useGetProductsQuery,
  useGetCarouselQuery,
  useGetCategoriesQuery,
  useGetPromocodesQuery,
  useCreateOrderMutation,
} = apiSlice;

export default apiSlice.reducer;
