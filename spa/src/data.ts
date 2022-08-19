import axios from "axios";

const api_url = import.meta.env.VITE_API_URL;

let instance = axios.create({ baseURL: api_url });

export const requestThread = async (url: string) => {
  const res = await instance.get(`/thread/${url}`);
  return res;
};

export const requestUserArchive = async ({
  url,
  limit = 10,
}: {
  url: string;
  limit?: number;
}) => {
  const res = await instance.get(`/user?id=${url}&limit=${limit}`);
  return res;
};

export const checkJob = async (url: string) => {
  try {
    const res = await instance.get(url);
    return res;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return { data: { status: "failed", downloadUrl: "" } };
    } else {
      return { data: { status: "failed", downloadUrl: "" } };
    }
  }
};

export const getThreadPDF = async (url: string) => {
  const res = await instance.get(url, { responseType: "blob" });
  return res;
};

