export interface User {
  username: string;
}

export type SignInResponse = Record<string, unknown>;

export interface MockSignInResponse {
  access_token: string;
  refresh_token: string;
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
  archived_at?: string | null;
}

export interface Payload {
  exp: number;
}
