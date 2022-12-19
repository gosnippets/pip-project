import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

export const getSoftwares = createAsyncThunk("software/getSoftwares", async () => {
    try {
        const response = await API.get("/approved/softwarelist");
        return response.data.data
    } catch (error) {
        console.log(error)
    }
})
 