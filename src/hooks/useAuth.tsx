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
import { MockSignInResponse, User } from '../@types/auth';

export interface AuthProviderProps {
  signInEndpoint: string;
  signOutEndpoint: string;
  cookieName?: string;
  accessTokenAccessor?: (r: unknown) => string;
  expiryDateAccessor?: (r: unknown) => number;
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
  cookieName = import.meta.env.VITE_ACCESS_TOKEN_COOKIE,
  accessTokenAccessor = (r: unknown) => (r as MockSignInResponse).access_token,
  expiryDateAccessor = (r: unknown) => {
    const token = (r as MockSignInResponse).access_token;
    const parts = token.split('.');
    const strPayload = parts[1];
    const payload = JSON.parse(atob(strPayload));
    const expiryDate = payload.exp * 1000;
    const expiry = Math.round(
      (expiryDate - Date.now()) / (24 * 60 * 60 * 1000)
    );

    return expiry;
  },
  userAccessor = (token: string) => ({
    username: JSON.parse(atob(token.split('.')[1]))?.username,
  }),
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get(cookieName);

    if (!token) return;

    const newUser = userAccessor(token);

    if (!newUser) return;

    setUser(newUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(
    (requestBody: unknown) => {
      axios
        .post(signInEndpoint, requestBody, { headers: { framework: 'react' } })
        .then((r) => {
          const token = accessTokenAccessor(r.data);
          const expires = expiryDateAccessor(r.data);
          const opts: Cookies.CookieAttributes = {
            expires,
            secure: true,
            sameSite: 'Lax',
          };

          setUser(userAccessor(token));
          Cookies.set(cookieName, token, opts);
        })
        .catch((e) => {
          console.log('e :>> ', e);
        });
    },
    [
      accessTokenAccessor,
      cookieName,
      expiryDateAccessor,
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

        Cookies.remove(cookieName, opts);
      })
      .catch((e) => console.log('e :>> ', e));
  }, [cookieName, signOutEndpoint]);

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

export const useAuth = () => useContext(AuthContext) as TAuthContext;
