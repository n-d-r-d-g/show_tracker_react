export interface User {
  username: string;
}

export interface SignInResponse {
  [key: string]: unknown;
}

export interface MockSignInResponse {
  access_token: string;
}

export interface IApiShow {
  id: 'string';
  name: 'TestShow';
  season: number;
  episode: number;
  url?: string | null;
  image?: string | null;
  order: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
