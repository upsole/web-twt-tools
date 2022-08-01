import axios from "axios"

const api_url = import.meta.env.VITE_API_URL

const instance = axios.create({ baseURL: api_url })

export const getOk = async () => {
  const res = await instance.get(`/ok`);
  return res;
};

export const getThreadPDF = async (url: string) => {
  const res = await instance.get(`/thread?id=${url}`, {responseType: 'blob'})
  // const res = await axios({ method: 'GET', responseType: "blob", url: `${api_url}/thread?id=${url}` })
  return res;
}

export const getUserArchive = async (url: string, limit = 10) => {
  const res = await instance.get(`/user/archive?id=${url}&limit=${limit}`, {responseType: 'text'})
  return res;
}

