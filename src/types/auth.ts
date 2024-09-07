export interface User {
  username: string;
}

export interface SignInResponse {
  [key: string]: unknown;
}

export interface MockSignInResponse {
  access_token: string;
}
