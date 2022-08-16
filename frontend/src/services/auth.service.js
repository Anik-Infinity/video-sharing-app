import { useAxios as axios } from "../core/axios"

export const login = async (payload) => {
    try {
        const res = await axios.post('/auth/login', payload)
        return res
    } catch (error) {
        return error
    }
}