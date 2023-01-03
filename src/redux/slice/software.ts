import { createSlice } from "@reduxjs/toolkit";
import { getSoftwares } from "../apis/software";
import { ISoftware } from "../models/software";

type SoftwareState = {
    isLoading: boolean,
    status: "" | "pending" | "success" | "failed";
    list: ISoftware[];
};

const initialState: SoftwareState = {
    isLoading: false,
    status: "",
    list: []
};

export const softwareSlice = createSlice({
    name: "software",
    initialState,
    reducers: {
        clearSuccessMessage: (state, payload) => {
            // TODO: Update state to clear success message
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSoftwares.pending, (state) => {
                state.status = "pending"
                state.isLoading = true
            })
            .addCase(getSoftwares.fulfilled, (state, { payload }) => {
                state.status = "success"
                state.list = payload
                state.isLoading = false
            })
            .addCase(getSoftwares.rejected, (state) => {
                state.status = "failed"
                state.isLoading = false
            });
    }
})

export default softwareSlice.reducer
