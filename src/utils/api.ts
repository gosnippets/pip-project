import axios from 'axios';

export default axios.create({
    baseURL: "http://10.65.0.105:8080",
    headers: { "Content-type": "application/json" }
});