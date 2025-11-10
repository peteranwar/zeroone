import axios from "axios";
import LocaleService from "./locale-service";
import StorageService from "./storage-service";

class HttpHelpers {
  constructor() {
    this.subscribers = [];
  }

  setBaseUrl(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
    this.authenticatedAxios = axios.create({ baseURL: this.apiBaseUrl });
    this.unAuthenticatedAxios = axios.create({ baseURL: this.apiBaseUrl });
    this.addAuthenticationInterceptor();
    this.addUnauthenticationInterceptor();
  }

  getToken() {
    return StorageService.get("token");
  }

  getLocale() {
    return LocaleService.get();
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  addAuthenticationInterceptor() {
    this.authenticatedAxios.interceptors.request.use(
      async (config) => {
        const locale = await this.getLocale();
        config.headers["X-localization"] = locale;
        // ** Get token from AsyncStorage/LocalStorage
        const accessToken = await this.getToken();
        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.authenticatedAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        // window.location.pathname = '/';

        if (error.response.status === 401) {
          window.location.pathname = '/login';

          // ** If token is expired or invalid, remove it from AsyncStorage/LocalStorage
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          // ** Notify all subscribers that token has been removed
          this.onAccessTokenFetched(null);
          // ** Redirect to login page
        }


        return Promise.reject(error);
      }
    );

  }

  addUnauthenticationInterceptor() {
    this.unAuthenticatedAxios.interceptors.request.use(
      async (config) => {
        const locale = await this.getLocale();
        config.headers["Accept-Language"] = locale;
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
}

export default new HttpHelpers();
