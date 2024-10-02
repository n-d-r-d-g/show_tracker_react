import axios from 'axios';
import Cookies from 'js-cookie';
import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MockSignInResponse, User } from '../@types/auth';
import { validateTokens } from '../api';
import { tokenExpiryDateAccessor } from '../functions';

export interface AuthProviderProps {
  signInEndpoint: string;
  signOutEndpoint: string;
  signOutAllEndpoint?: string;
  refreshEndpoint?: string;
  accessTokenCookieName?: string;
  refreshTokenCookieName?: string;
  accessTokenAccessor?: (r: unknown) => string;
  refreshTokenAccessor?: (r: unknown) => string;
  expiryDateAccessor?: (t: string) => number;
  onSignInSuccess?: (r: unknown) => undefined;
  userAccessor?: (t: string) => User;
  children: ReactElement;
}

export interface TAuthContext {
  user: User | null;
  isSignedIn: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  signIn: (requestBody: unknown) => Promise<void>;
  signOut: () => Promise<void>;
  signOutAll: () => Promise<void>;
}

const AuthContext = createContext<TAuthContext | undefined>(undefined);
AuthContext.displayName = 'AuthContext';

export const AuthProvider = ({
  signInEndpoint = '',
  signOutEndpoint = '',
  signOutAllEndpoint = '',
  refreshEndpoint = '',
  accessTokenCookieName = import.meta.env.VITE_ACCESS_TOKEN_COOKIE as string,
  refreshTokenCookieName = import.meta.env.VITE_REFRESH_TOKEN_COOKIE as string,
  accessTokenAccessor = (r: unknown) => (r as MockSignInResponse).access_token,
  refreshTokenAccessor = (r: unknown) =>
    (r as MockSignInResponse).refresh_token,
  userAccessor = (accessToken: string) => ({
    username: (JSON.parse(atob(accessToken.split('.')[1])) as User)?.username,
  }),
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const isValidatingTokens = useRef(false);

  const onInit = useCallback(async () => {
    if (isValidatingTokens.current) return;

    isValidatingTokens.current = true;

    try {
      await validateTokens(
        accessTokenCookieName,
        refreshTokenCookieName,
        refreshEndpoint
      );
    } catch {
      return;
    }

    const accessToken = Cookies.get(accessTokenCookieName);

    if (!accessToken) return;

    const newUser = userAccessor(accessToken);

    if (!newUser) return;

    setUser(newUser);
  }, [
    accessTokenCookieName,
    refreshEndpoint,
    refreshTokenCookieName,
    userAccessor,
  ]);

  useEffect(() => {
    onInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(
    async (requestBody: unknown) => {
      const response = await axios.post(signInEndpoint, requestBody, {
        headers: { framework: import.meta.env.VITE_APP_FRAMEWORK as string },
      });

      const accessToken = accessTokenAccessor(response.data);
      const refreshToken = refreshTokenAccessor(response.data);
      const accessTokenExpires = tokenExpiryDateAccessor(
        (response.data as MockSignInResponse).access_token
      );
      const refreshTokenExpires = tokenExpiryDateAccessor(
        (response.data as MockSignInResponse).refresh_token
      );
      const accessTokenCookieOpts: Cookies.CookieAttributes = {
        expires: accessTokenExpires,
        secure: true,
        sameSite: 'Lax',
      };
      const refreshTokenCookieOpts: Cookies.CookieAttributes = {
        expires: refreshTokenExpires,
        secure: true,
        sameSite: 'Lax',
      };

      setUser(userAccessor(accessToken));

      Cookies.set(accessTokenCookieName, accessToken, accessTokenCookieOpts);
      Cookies.set(refreshTokenCookieName, refreshToken, refreshTokenCookieOpts);
    },
    [
      accessTokenAccessor,
      accessTokenCookieName,
      refreshTokenAccessor,
      refreshTokenCookieName,
      signInEndpoint,
      userAccessor,
    ]
  );

  const deleteCookies = useCallback(() => {
    const opts: Cookies.CookieAttributes = {
      secure: true,
      sameSite: 'Lax',
    };

    Cookies.remove(accessTokenCookieName, opts);
    Cookies.remove(refreshTokenCookieName, opts);
  }, [accessTokenCookieName, refreshTokenCookieName]);

  const signOut = useCallback(async () => {
    setUser(null);

    await axios.get(signOutEndpoint).finally(deleteCookies);
  }, [deleteCookies, signOutEndpoint]);

  const signOutAll = useCallback(async () => {
    setUser(null);

    await axios.get(signOutAllEndpoint).finally(deleteCookies);
  }, [deleteCookies, signOutAllEndpoint]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        setUser,
        signIn,
        signOut,
        signOutAll,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
