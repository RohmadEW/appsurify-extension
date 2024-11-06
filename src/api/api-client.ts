import axios, { AxiosInstance, isAxiosError } from "axios";
import { API_URL } from "../libs/constants";

interface ApiClientOptions {
  baseURL: string;
}

/**
 * Create an Axios instance with baseURL
 *
 * @param {{ baseURL: string }} param0
 * @param {string} param0.baseURL
 * @returns {AxiosInstance}
 */ /**
 *
 *
 * @param {*} error
 */
const ApiClient = (options: ApiClientOptions): AxiosInstance => {
  const instance = axios.create({
    baseURL: options.baseURL,
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      // if unauthorized auto logout
      if (403 === error?.response?.status || 401 === error?.response?.status) {
        // Remove all cookies when the path url doesn't contains /teams/api/teams/
        // const urlRequest = error.config.url;
        // if (!urlRequest.includes("/teams/api/teams/")) {
        document.cookie =
          "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        window.location.href = "/";
        // console.warn("Unauthorized, redirecting to login page");
        // }

        throw error;
      }

      // skip login error logging
      if (
        isAxiosError(error) &&
        error.response?.status === 400 &&
        error.config?.method === "post" &&
        error.config?.url?.includes("login")
      ) {
        throw error;
      }

      if (isAxiosError(error) && error.response?.status !== 401) {
        // skip cancelled error logging
        if (error.message === "Query was cancelled by React Query") {
          throw error;
        }

        throw error;
      }

      console.error(error);

      throw error;
    }
  );

  return instance;
};

const setClientToken = (instance: AxiosInstance, token: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  instance.defaults.headers.common["Content-Type"] = "application/json";
};

const removeClientToken = (instance: AxiosInstance) => {
  delete instance.defaults.headers.common["Authorization"];
};

const apiClient = ApiClient({
  baseURL: API_URL ?? "",
});

export { apiClient, removeClientToken, setClientToken };
