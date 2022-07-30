import axios from "axios"
import {user_url_parser} from "./lib";

const api_url = import.meta.env.VITE_API_URL

const instance = axios.create({ baseURL: api_url})

export const getOk = async () => {
  const res = await instance.get(`/ok`);
  return res;
};

export const getUserArchive = async (url: string, limit = 10) => {
  const res = await instance.post(`/user/archive?id=${user_url_parser(url)}&limit=${limit}`)
  return res;
}
