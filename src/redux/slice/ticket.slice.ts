import { createSlice } from "@reduxjs/toolkit";
import { addTicket } from "../apis/ticket.api";

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
    extraReducers: { 
        [addTicket.pending.type]: (state, action) => {
            state.isLoading = true
            state.status = "pending"
        },
        [addTicket.fulfilled.type]: (state, action) => {
            state.isLoading = false
            state.status = "success"
        },
        [addTicket.rejected.type]: (state, action) => {
            state.isLoading = false
            state.status = "failed"
        }
    }
})

export default ticketSlice.reducer
