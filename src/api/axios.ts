import axios from 'axios';
import Cookies from 'js-cookie';
import { validateTokens } from '.';

axios.interceptors.request.use(
  async (config) => {
    const isAuthorizationRequired = ![
      `${import.meta.env.VITE_APP_API_URL}${
        import.meta.env.VITE_SIGN_IN_ENDPOINT
      }`,
      `${import.meta.env.VITE_APP_API_URL}${
        import.meta.env.VITE_REFRESH_ENDPOINT
      }`,
    ].includes(config.url!);

    if (isAuthorizationRequired) {
      try {
        await validateTokens(
          import.meta.env.VITE_ACCESS_TOKEN_COOKIE as string,
          import.meta.env.VITE_REFRESH_TOKEN_COOKIE as string,
          `${import.meta.env.VITE_APP_API_URL}${
            import.meta.env.VITE_REFRESH_ENDPOINT
          }`
        );
      } catch (e) {
        Promise.reject(e as Error);
      }

      config.headers.Authorization = `Bearer ${Cookies.get(
        import.meta.env.VITE_ACCESS_TOKEN_COOKIE as string
      )}`;
    }

    return config;
  },
  (error) => Promise.reject(error as Error)
);
