import axios from "axios"

const api_url = import.meta.env.VITE_API_URL

const instance = axios.create({ baseURL: api_url })

export const getOk = async () => {
  const res = await instance.get(`/ok`);
  return res;
};

export const getThreadPDF = async (url: string) => {
  const res = await instance.get(`/thread/${url}`, {responseType: 'blob'})
  return res;
}

export const getUserArchive = async ({url, limit = 10}: {url: string, limit?: number}) => {
  const res = await instance.get(`/user/archive?id=${url}&limit=${limit}`, {responseType: 'text'})
  return res;
}
