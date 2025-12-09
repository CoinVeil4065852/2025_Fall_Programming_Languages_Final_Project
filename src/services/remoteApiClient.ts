import { ApiClient, AuthResponse, Credentials, User, WaterRecord, SleepRecord, ActivityRecord, CustomItem } from './types';

const base = import.meta.env.VITE_API_BASE || '';

async function req(path: string, opts: RequestInit = {}) {
  const res = await fetch(base + path, opts);
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    // ignore parse error
  }
  if (!res.ok) {
    const err = (json && json.message) || res.statusText || 'API error';
    throw new Error(err);
  }
  return json;
}

export const remoteApiClient: ApiClient = {
  async login(creds) {
    const body = JSON.stringify({ name: creds.username, password: creds.password });
    const json = await req('/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    const token: string = json?.token;
    if (!token) throw new Error('Login failed: no token returned');
    return { token } as AuthResponse;
  },

  async register(data) {
    const payload: any = { name: data.username, password: data.password };
    if (data.age != null) payload.age = data.age;
    if (data.weight != null) payload.weightKg = data.weight;
    if (data.height != null) payload.heightM = data.height;
    if (data.gender != null) payload.gender = data.gender;
    const json = await req('/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const token: string = json?.token;
    if (!token) throw new Error('Register failed: no token returned');
    return { token } as AuthResponse;
  },

  async getProfile(token) {
    const json = await req('/user/profile', { headers: { Authorization: `Bearer ${token}` } });
    return json as User;
  },

  async getBMI(token) {
    const json = await req('/user/bmi', { headers: { Authorization: `Bearer ${token}` } });
    return json.bmi as number;
  },

  async addWater(token, datetime, amountMl) {
    const body = JSON.stringify({ datetime, amountMl });
    const json = await req('/waters', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body });
    return json as WaterRecord;
  },

  async getAllWater(token) {
    const json = await req('/waters', { headers: { Authorization: `Bearer ${token}` } });
    return (json || []) as WaterRecord[];
  },

  async updateWater(token, id, datetime, amountMl) {
    const body = JSON.stringify({ datetime, amountMl });
    await req(`/waters/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body });
  },

  async deleteWater(token, id) {
    await req(`/waters/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  },


  async addSleep(token, datetime, hours) {
    const body = JSON.stringify({ datetime, hours });
    const json = await req('/sleeps', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body });
    return json as SleepRecord;
  },

  async getAllSleep(token) {
    const json = await req('/sleeps', { headers: { Authorization: `Bearer ${token}` } });
    return (json || []) as SleepRecord[];
  },

  async updateSleep(token, id, datetime, hours) {
    await req(`/sleeps/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ datetime, hours }) });
  },

  async addActivity(token, datetime, minutes, intensity) {
    const body = JSON.stringify({ datetime, minutes, intensity });
    const json = await req('/activities', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body });
    return json as ActivityRecord;
  },

  async getAllActivity(token) {
    const json = await req('/activities', { headers: { Authorization: `Bearer ${token}` } });
    return (json || []) as ActivityRecord[];
  },

  async updateActivity(token, id, datetime, minutes, intensity) {
    const body = JSON.stringify({ datetime, minutes, intensity });
    await req(`/activities/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body });
  },

  async deleteActivity(token, id) {
    await req(`/activities/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  },

  async sortActivityByDuration(token) {
    await req('/activities?sortBy=duration', { headers: { Authorization: `Bearer ${token}` } });
  },
  async getCustomCategories(token?) {
    const json = await req('/category/list', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    // server may return array of { id, categoryName } or array of strings; normalize to string[]
    if (Array.isArray(json) && json.length && typeof json[0] === 'object') return (json as any[]).map((c) => c.categoryName) as string[];
    return (json || []) as string[];
  },
  async getCustomData(categoryName, token?) {
    const json = await req(`/category/${encodeURIComponent(categoryName)}/list`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    return (json || []) as CustomItem[];
  },
  async createCustomCategory(categoryName, token?) {
    await req('/category/create', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ categoryName }) });
  },
  async addCustomItem(token, categoryName, datetime, note) {
    const body = JSON.stringify({ datetime, note });
    const json = await req(`/category/${encodeURIComponent(categoryName)}/add`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body });
    return json as CustomItem;
  },
  async updateCustomItem(token, categoryName, itemId, datetime, note) {
    const body = JSON.stringify({ datetime, note });
    await req(`/category/${encodeURIComponent(categoryName)}/${encodeURIComponent(itemId)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body });
  },
  async deleteCustomItem(token, categoryName, itemId) {
    await req(`/category/${encodeURIComponent(categoryName)}/${encodeURIComponent(itemId)}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} });
  },
};

export default remoteApiClient;
