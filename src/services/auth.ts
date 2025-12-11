import api from './index';
import type { Credentials, AuthResponse, User } from './types';

export async function login(creds: Credentials): Promise<AuthResponse> {
  return api.login(creds);
}

export async function register(data: {
  name: string;
  password: string;
  age: number;
  weightKg: number;
  heightM: number;
  gender: 'male' | 'female' | 'other';
}): Promise<AuthResponse> {
  return api.register(data);
}

export async function getProfile(token: string): Promise<User> {
  return api.getProfile(token);
}
