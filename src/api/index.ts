import axios from 'axios';
import Cookies from 'js-cookie';

axios.interceptors.request.use(
  (config) => {
    const isAuthorizationRequired = ![
      `${import.meta.env.VITE_APP_API_URL}${
        import.meta.env.VITE_SIGN_IN_ENDPOINT
      }`,
    ].includes(config.url!);

    if (isAuthorizationRequired) {
      config.headers.Authorization = `Bearer ${Cookies.get(
        import.meta.env.VITE_ACCESS_TOKEN_COOKIE
      )}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
