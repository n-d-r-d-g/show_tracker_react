import axios from 'axios';
import Cookies from 'js-cookie';
import { isTokenValid, tokenExpiryDateAccessor } from '../functions';
import { MockSignInResponse } from '../@types/auth';

/**
 * If the tokens are not valid, this function tries to refresh them.
 * If refreshing fails, an exception is thrown.
 * @param accessTokenCookieName The name of the cookie that stores the access token
 * @param refreshTokenCookieName The name of the cookie that stores the refresh token
 * @param refreshEndpoint The refresh token API endpoint
 * @returns
 */
export async function validateTokens(
  accessTokenCookieName: string,
  refreshTokenCookieName: string,
  refreshEndpoint: string
) {
  const accessToken = Cookies.get(accessTokenCookieName);

  if (isTokenValid(accessToken)) return;

  const refreshToken = Cookies.get(refreshTokenCookieName);

  if (!isTokenValid(refreshToken)) throw new Error('User needs to log in!');

  const resp = await axios.get(refreshEndpoint, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      framework: import.meta.env.VITE_APP_FRAMEWORK as string,
    },
  });

  const { access_token: newAccessToken, refresh_token: newRefreshToken } =
    resp.data as MockSignInResponse;

  const accessTokenExpires = tokenExpiryDateAccessor(newAccessToken);
  const refreshTokenExpires = tokenExpiryDateAccessor(newRefreshToken);
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

  Cookies.set(accessTokenCookieName, newAccessToken, accessTokenCookieOpts);
  Cookies.set(refreshTokenCookieName, newRefreshToken, refreshTokenCookieOpts);
}
