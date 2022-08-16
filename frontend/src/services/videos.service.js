import { useAxios } from "../core/axios";
import axios from "axios";
import { videoLinks } from "../mock/data";

export const getAllVideos = async () => {
    try {
      const res = await useAxios.get("video/video-list");
			// return videoLinks; //mock links 
      return res;

    } catch (error) {
      return error
    } 
} 

export const addNewVideo = async(payload) => {
  try {
    const res = await useAxios.post('video', payload)
    return res;
  } catch (error) {
    return error
  }
}

export const countView = async (uuid) => {
  try {
    const res = await useAxios.get(`video/increment-view-count/${uuid}`)
    return res;
  } catch (error) {
    return error
  }
}


export const getVideoInfo = async(uuid) => {
  try {
    const res = await useAxios.get(`video/single-video-info/${uuid}`)
    return res;
  } catch (error) {
    return error
  }
}


export const addReaction = async (payload) => {
  try {
    const res = await useAxios.post(`video/reaction`, payload);
    return res;
  } catch (error) {
    return error
  }
}