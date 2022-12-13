import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

export const getApprovers = createAsyncThunk("approver/getApprovers", async () => {
    try {
        const response = await API.get("/tms/users?requestor=approvers");
        return response.data.data
    } catch (error) {
        console.log(error)
    }
})
 