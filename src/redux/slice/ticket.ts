import { createSlice } from "@reduxjs/toolkit";
import { addTicket } from "../apis/ticket";

type TicketState = {
    isLoading: boolean,
    status: "" | "pending" | "success" | "failed";
};

const initialState: TicketState = {
    isLoading: false,
    status: ""
};

export const ticketSlice = createSlice({
    name: "ticket",
    initialState,
    reducers: {
        clearSuccessMessage: (state, payload) => {
            // TODO: Update state to clear success message
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTicket.pending, (state) => {
                state.isLoading = true
                state.status = "pending"
            })
            .addCase(addTicket.fulfilled, (state) => {
                state.isLoading = false
                state.status = "success"
            })
            .addCase(addTicket.rejected, (state) => {
                state.isLoading = false
                state.status = "failed"
            });
    }
})

export default ticketSlice.reducer
