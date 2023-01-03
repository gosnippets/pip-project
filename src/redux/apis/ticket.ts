import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";
import { ITicket } from "../models/ticket";

export const addTicket = createAsyncThunk("ticket/addTicket", async (ticket: ITicket) => {
    try {
        const response = await API.post("/tms/tickets/addTicket", ticket);
        return response.data;
    } catch (error) {
    }
})
 