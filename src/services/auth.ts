import * as mockApi from './mockApi';

type Credentials = { username: string; password: string };

export async function login(creds: Credentials) {
  // For UI testing use the mock API. To simulate success use password 'password'.
  return mockApi.login(creds);
}

export async function register(data: {
  username: string;
  password: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
}) {
  return mockApi.register(data);
}

export async function getProfile(token: string) {
  return mockApi.getProfile(token);
}
