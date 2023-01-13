import axios from "axios";
import { toast } from "react-toastify";

let token = localStorage.getItem("accessToken");

const { NEXT_PUBLIC_SITE_URL_BE } = process.env;

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
    const response = await axios.post(
      `${NEXT_PUBLIC_SITE_URL_BE}/refresh-token`
    );
    token = response.data.token;
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
    originalRequests.forEach((request) => {
      request.headers["Authorization"] = `Bearer ${token}`;
      api(request);
    });
    originalRequests.length = 0;
  } catch (error) {
    console.error(error);
    toast("Lỗi rồi");
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

// API GET
export const get = (
  url: string,
  config = {},
  successCallback: (response: any) => void,
  errCallback?: (err: any) => void
) =>
  api
    .get(url, config)
    .then((response) => successCallback(response.data))
    .catch((error) => errCallback?.(error));
// API POST
export const post = (
  url: string,
  data = {},
  config = {},
  successCallback: (response: any) => void,
  errCallback?: (err: any) => void
) =>
  api
    .post(url, data, config)
    .then((response) => successCallback(response.data))
    .catch((error) => {
      errCallback?.(error);
      toast("Lỗi rồi");
    });
//API PUT
export const put = (
  url: string,
  data = {},
  config = {},
  successCallback: (response: any) => void,
  errCallback?: (err: any) => void
) =>
  api
    .put(url, data, config)
    .then((response) => successCallback(response.data))
    .catch((error) => {
      errCallback?.(error);
      toast("Lỗi rồi");
    });
// API DELETE
export const remove = (
  url: string,
  config = {},
  successCallback: (response: any) => void,
  errCallback?: (err: any) => void
) =>
  api
    .delete(url, config)
    .then((response) => successCallback(response.data))
    .catch((error) => {
      errCallback?.(error);
      toast("Lỗi rồi");
    });
