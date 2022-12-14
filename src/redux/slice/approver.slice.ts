import { createSlice } from "@reduxjs/toolkit";
import { getApprovers } from "../apis/approver.api";
import { IApprover } from "../models/approver.model";

type ApproverState = {
    isLoading: boolean,
    status: "" | "pending" | "success" | "failed";
    list: IApprover[];
};

const initialState: ApproverState = {
    isLoading: false,
    status: "",
    list: []
};

export const approverSlice = createSlice({
    name: "approver",
    initialState,
    reducers: {
        clearSuccessMessage: (state, payload) => {
            // TODO: Update state to clear success message
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getApprovers.pending, (state) => {
                state.status = "pending"
                state.isLoading = true
            })
            .addCase(getApprovers.fulfilled, (state, { payload }) => {
                state.status = "success"
                state.list = payload
                state.isLoading = false
            })
            .addCase(getApprovers.rejected, (state) => {
                state.status = "failed"
                state.isLoading = false
            });
    }
})

export default approverSlice.reducer
