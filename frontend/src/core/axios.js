import axios from "axios";


export const useAxios = axios.create({
    baseURL: "http://192.168.0.7:8000/video-sharing-app/api/v1/",
    headers:{
        authorization: JSON.parse(localStorage.getItem('token'))
    }
})