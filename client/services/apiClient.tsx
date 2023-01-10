import axios from "axios";

let token = localStorage.getItem('accessToken');

const {NEXT_PUBLIC_SITE_URL_BE} = process.env

const api = axios.create({
  baseURL: NEXT_PUBLIC_SITE_URL_BE,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const originalRequests: any[] = [];
let refreshingToken = false;

const refreshToken = async () => {
  if (refreshingToken) {
    return;
  }

  refreshingToken = true;

  try {
    const response = await axios.post(`${NEXT_PUBLIC_SITE_URL_BE}/refresh-token`);
    token = response.data.token;
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
    originalRequests.forEach((request) => {
      request.headers["Authorization"] = `Bearer ${token}`;
      api(request);
    });
    originalRequests.length = 0;
  } catch (error) {
    console.error(error);
  } finally {
    refreshingToken = false;
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response.status === 401) {
      originalRequests.push(originalRequest);
      if (!refreshingToken) {
        refreshToken();
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export const get = (url: string, config = {}) => api.get(url, config);
export const post = (url: string, data = {}, config = {}) =>
  api.post(url, data, config);
export const put = (url: string, data = {}, config = {}) =>
  api.put(url, data, config);
export const remove = (url: string, config = {}) => api.delete(url, config);
