import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "62d1e0c07914a5c2f5d35b91", //hook up later to login userid
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {},
});

export const {} = globalSlice.actions;

export default globalSlice.reducer;
