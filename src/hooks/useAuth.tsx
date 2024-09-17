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
  useState,
} from 'react';
import { MockSignInResponse, Payload, User } from '../@types/auth';

export interface AuthProviderProps {
  signInEndpoint: string;
  signOutEndpoint: string;
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
  signIn: (requestBody: unknown) => void;
  signOut: () => void;
}

const AuthContext = createContext<TAuthContext | undefined>(undefined);
AuthContext.displayName = 'AuthContext';

export const AuthProvider = ({
  signInEndpoint = '',
  signOutEndpoint = '',
  accessTokenCookieName = import.meta.env.VITE_ACCESS_TOKEN_COOKIE as string,
  refreshTokenCookieName = import.meta.env.VITE_REFRESH_TOKEN_COOKIE as string,
  accessTokenAccessor = (r: unknown) => (r as MockSignInResponse).access_token,
  refreshTokenAccessor = (r: unknown) =>
    (r as MockSignInResponse).refresh_token,
  expiryDateAccessor = (jwtToken: string) => {
    const parts = jwtToken.split('.');
    const strPayload = parts[1];
    const payload = JSON.parse(atob(strPayload)) as Payload;
    const expiryDate = payload.exp * 1000;
    const expiry = (expiryDate - Date.now()) / (24 * 60 * 60 * 1000);

    return expiry;
  },
  userAccessor = (accessToken: string) => ({
    username: (JSON.parse(atob(accessToken.split('.')[1])) as User)?.username,
  }),
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get(accessTokenCookieName);

    if (!accessToken) return;

    const newUser = userAccessor(accessToken);

    if (!newUser) return;

    setUser(newUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(
    (requestBody: unknown) => {
      axios
        .post(signInEndpoint, requestBody, { headers: { framework: 'react' } })
        .then((r) => {
          const accessToken = accessTokenAccessor(r.data);
          const refreshToken = refreshTokenAccessor(r.data);
          const accessTokenExpires = expiryDateAccessor(
            (r.data as MockSignInResponse).access_token
          );
          const refreshTokenExpires = expiryDateAccessor(
            (r.data as MockSignInResponse).refresh_token
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

          Cookies.set(
            accessTokenCookieName,
            accessToken,
            accessTokenCookieOpts
          );
          Cookies.set(
            refreshTokenCookieName,
            refreshToken,
            refreshTokenCookieOpts
          );
        })
        .catch((e) => {
          console.log('e :>> ', e);
        });
    },
    [
      accessTokenAccessor,
      accessTokenCookieName,
      expiryDateAccessor,
      refreshTokenAccessor,
      refreshTokenCookieName,
      signInEndpoint,
      userAccessor,
    ]
  );

  const signOut = useCallback(() => {
    axios
      .get(signOutEndpoint)
      .then(() => {
        setUser(null);

        const opts: Cookies.CookieAttributes = {
          secure: true,
          sameSite: 'Lax',
        };

        Cookies.remove(accessTokenCookieName, opts);
      })
      .catch((e) => console.log('e :>> ', e));
  }, [accessTokenCookieName, signOutEndpoint]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        setUser,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
