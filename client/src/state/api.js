import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../utils/baseQueryWithReauth";

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Admin",
    "Transaction",
    "landingPage",
    "Donation",
    "ActivityLog",
    "Feedbak",
    "Contact",
    "Comment",
  ],
  endpoints: (build) => ({
    login: build.mutation({
      query: (loginData) => ({
        url: "general/checkCustomer",
        method: "POST",
        body: loginData,
      }),
    }),
    refreshToken: build.mutation({
      query: (refreshToken) => ({
        url: "general/refreshToken",
        method: "POST",
        body: { refreshToken },
      }),
    }),
    register: build.mutation({
      query: (userData) => ({
        url: "general/register",
        method: "POST",
        body: userData,
      }),
    }),
    getAllDonations: build.query({
      query: () => ({
        url: "donations/getAllDonations",
        method: "GET",
      }),
      providesTags: ["Donation"],
    }),
    getDonationHistory: build.query({
      query: (id) => ({
        url: `donations/getAllDonationHistory/${id}`,
        method: "GET",
      }),
      providesTags: ["Donation"],
    }),
    getAllContacts: build.query({
      query: () => ({
        url: "contacts/getAllContacts",
        method: "GET",
      }),
      providesTags: ["Contact"],
    }),
    getDonationById: build.query({
      query: (id) => ({
        url: `donations/${id}`,
        method: "GET",
      }),
      providesTags: ["Donation"],
    }),
    getUserInfo: build.query({
      query: () => ({
        url: "general/userInfo",
        method: "GET",
      }),
      providesTags: ["User", "Admin"],
    }),
    getUserActivityLogs: build.query({
      query: () => ({
        url: "activity/getLogs",
        method: "GET",
      }),
      providesTags: ["ActivityLog"],
    }),
    getTransactionLogs: build.query({
      query: () => ({
        url: "activity/transactionLogs",
        method: "GET",
      }),
      providesTags: ["ActivityLog"],
    }),
    getFeedback: build.query({
      query: () => ({
        url: "feedback/getFeedback",
        method: "GET",
      }),
      providesTags: ["Feedback"],
    }),
    getCommentsByDonationId: build.query({
      query: (donationId) => ({
        url: `general/comments/${donationId}`,
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),
    addDonation: build.mutation({
      query: (donationData) => ({
        url: "donations/add",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      }),
      invalidatesTags: ["Donation"],
    }),
    addFeedback: build.mutation({
      query: (feedbackData) => ({
        url: "feedback/addFeedback",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      }),
      invalidatesTags: ["Feedback"],
    }),
    addContact: build.mutation({
      query: (contactData) => ({
        url: 'general/addContact', 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      }),
      invalidatesTags: ['Contact'], 
    }),
    editDonation: build.mutation({
      query: ({ id, ...donationData }) => ({
        url: `donations/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      }),
      invalidatesTags: ["Donation"],
    }),
    deleteDonation: build.mutation({
      query: (id) => ({
        url: `donations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Donation"],
    }),
    changePassword: build.mutation({
      query: ({ userId, oldPassword, newPassword }) => ({
        url: "general/changePassword",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, oldPassword, newPassword }),
      }),
    }),
    createPaymentIntent: build.mutation({
      query: (amount) => ({
        url: "payment/create-payment-intent",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { amount },
      }),
      }),
      addDonorToDonation: build.mutation({
        query: (donorData) => ({
          url: "donations/addDonor",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(donorData),
        }),
        invalidatesTags: ["Donation"],
      }),
      logTransaction: build.mutation({
        query: (transactionData) => ({
          url: "activity/logTransaction", 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionData),
        }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
  useGetAllDonationsQuery,
  useGetDonationHistoryQuery,
  useGetAllContactsQuery,
  useGetFeedbackQuery,
  useGetDonationByIdQuery,
  useGetUserInfoQuery,
  useGetCommentsByDonationIdQuery,
  useGetUserActivityLogsQuery,
  useGetTransactionLogsQuery,
  useAddDonationMutation,
  useAddDonorToDonationMutation,
  useLogTransactionMutation,
  useAddFeedbackMutation,
  useCreatePaymentIntentMutation,
  useAddContactMutation,
  useEditDonationMutation,
  useDeleteDonationMutation,
  useChangePasswordMutation,
} = api;
