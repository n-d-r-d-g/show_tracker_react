import { Payload } from './@types/auth';

export function tokenExpiryDateAccessor(jwt: string) {
  const parts = jwt.split('.');
  const strPayload = parts[1];
  const payload = JSON.parse(atob(strPayload)) as Payload;
  const expiryDate = payload.exp * 1000;
  const expiry = (expiryDate - Date.now()) / (24 * 60 * 60 * 1000);

  return expiry;
}

export function isTokenValid(jwt?: string) {
  if (!jwt) return false;

  try {
    const tokenParts = jwt.split('.');
    const tokenPayload = atob(tokenParts[1]);
    const parsedTokenPayload = JSON.parse(tokenPayload) as { exp: number };
    const tokenExpiryDate = new Date(parsedTokenPayload.exp * 1000);
    const isTokenExpired = new Date().getTime() >= tokenExpiryDate.getTime();

    return !isTokenExpired;
  } catch (e) {
    console.log('e :>> ', e);
    return false;
  }
}
