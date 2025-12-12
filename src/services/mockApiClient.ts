import { ApiClient, AuthResponse, Credentials, User, WaterRecord, SleepRecord, ActivityRecord, CustomItem, Category } from './types';

// Simple in-memory mock implementing the ApiClient interface.
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

type InternalUser = User & { password?: string };

const db: {
  users: InternalUser[];
  water: Record<string, Array<WaterRecord>>;
  sleep: Record<string, Array<SleepRecord>>;
  activity: Record<string, Array<ActivityRecord>>;
  customCategories?: Category[];
  customData?: Record<string, Array<CustomItem>>;
} = {
  users: [
    { id: '1', name: 'alice', age: 30, weightKg: 60, heightM: 1.65, gender: 'female', password: 'password' },
    { id: '2', name: 'bob', age: 28, weightKg: 75, heightM: 1.8, gender: 'male', password: 'password' },
  ],
  water: {},
  sleep: {},
  activity: {},
  customCategories: [
    { id: 'cat-1', categoryName: 'Food' },
    { id: 'cat-2', categoryName: 'Medications' },
  ],
  customData: {
    'cat-1': [],
    'cat-2': [],
  },
};

let nextId = 3;
let nextRecId = 1;

function tokenFor(userId: string) {
  return `fake-token-${userId}`;
}

function userIdFromToken(token: string) {
  if (!token.startsWith('fake-token-')) {return null;}
  return token.replace('fake-token-', '');
}

export const mockApiClient: ApiClient = {
  async login(creds: Credentials) {
    await delay(300 + Math.random() * 200);
    const user = db.users.find((u) => u.name === creds.name);
    if (!user || creds.password !== 'password') {
      throw new Error('Invalid name or password (mock)');
    }
    return { token: tokenFor(user.id) } as AuthResponse;
  },

  async register(data) {
    await delay(400 + Math.random() * 300);
    if (!data.name || !data.password) {throw new Error('Missing name or password');}
    if (db.users.find((u) => u.name === data.name)) {throw new Error('Name taken (mock)');}
    const newUser: InternalUser = {
      id: String(nextId++),
      name: data.name,
      age: data.age,
      weightKg: data.weightKg,
      heightM: data.heightM,
      gender: data.gender,
      password: data.password,
    };
    db.users.push(newUser);
    return { token: tokenFor(newUser.id) } as AuthResponse;
  },

  async getProfile(token) {
    await delay(150);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    const user = db.users.find((u) => u.id === uid);
    if (!user) {throw new Error('User not found (mock)');}
    const { password, ...safe } = user as InternalUser;
    return { ...safe } as User;
  },

  async getBMI(token) {
    await delay(100);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    const user = db.users.find((u) => u.id === uid);
    if (!user || !user.weightKg || !user.heightM) {throw new Error('User data incomplete (mock)');}
    const bmi = user.weightKg / (user.heightM * user.heightM);
    return Math.round(bmi * 10) / 10;
  },

  async addWater(token, datetime, amountMl) {
    await delay(80);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    db.water[uid] = db.water[uid] || [];
    const rec: WaterRecord = { id: String(nextRecId++), datetime, amountMl };
    db.water[uid].push(rec);
    return rec;
  },

  async getAllWater(token) {
    await delay(100);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    return (db.water[uid] || []).slice();
  },

  async updateWater(token, id, datetime, amountMl) {
    await delay(80);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    db.water[uid] = db.water[uid] || [];
    const idx = db.water[uid].findIndex((r) => r.id === id);
    if (idx === -1) {throw new Error('Record not found (mock)');}
    const old = db.water[uid][idx];
    const updatedWater: WaterRecord = { id, datetime: datetime ?? old.datetime, amountMl: amountMl ?? old.amountMl };
    db.water[uid][idx] = updatedWater;
    return updatedWater;
  },

  async deleteWater(token, id) {
    await delay(80);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    db.water[uid] = (db.water[uid] || []).filter((r) => r.id !== id);
  },


  async addSleep(token, datetime, hours) {
    await delay(80);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    db.sleep[uid] = db.sleep[uid] || [];
    const rec: SleepRecord = { id: String(nextRecId++), datetime, hours };
    db.sleep[uid].push(rec);
    return rec;
  },

  async getAllSleep(token) {
    await delay(100);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    return (db.sleep[uid] || []).slice();
  },

  async updateSleep(token, id, datetime, hours) {
    await delay(80);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    db.sleep[uid] = db.sleep[uid] || [];
    const idx = db.sleep[uid].findIndex((r) => r.id === id);
    if (idx === -1) {throw new Error('Sleep record not found (mock)');}
    const old = db.sleep[uid][idx];
    const updatedSleep: SleepRecord = { id, datetime: datetime ?? old.datetime, hours: hours ?? old.hours };
    db.sleep[uid][idx] = updatedSleep;
    return updatedSleep;
  },

  async deleteSleep(token, id) {
    await delay(80);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    db.sleep[uid] = (db.sleep[uid] || []).filter((r) => r.id !== id);
  },


  async addActivity(token, datetime, minutes, intensity) {
    await delay(80);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    db.activity[uid] = db.activity[uid] || [];
    const rec: ActivityRecord = { id: String(nextRecId++), datetime, minutes, intensity };
    db.activity[uid].push(rec);
    return rec;
  },

  async getAllActivity(token) {
    await delay(120);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    return (db.activity[uid] || []).slice();
  },

  async updateActivity(token, id, datetime, minutes, intensity) {
    await delay(80);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    db.activity[uid] = db.activity[uid] || [];
    const idx = db.activity[uid].findIndex((r) => r.id === id);
    if (idx === -1) {throw new Error('Activity record not found (mock)');}
    const old = db.activity[uid][idx];
    const updatedAct: ActivityRecord = { id, datetime: datetime ?? old.datetime, minutes: minutes ?? old.minutes, intensity: intensity ?? old.intensity };
    db.activity[uid][idx] = updatedAct;
    return updatedAct;
  },

  async deleteActivity(token, id) {
    await delay(80);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    db.activity[uid] = (db.activity[uid] || []).filter((r) => r.id !== id);
  },

  async sortActivityByDuration(token) {
    await delay(60);
    const uid = userIdFromToken(token);
    if (!uid) {throw new Error('Invalid token (mock)');}
    db.activity[uid] = (db.activity[uid] || []).sort((a, b) => b.minutes - a.minutes);
  },
  async getCustomCategories(_token?) {
    await delay(80);
    return db.customCategories ? db.customCategories.map((c) => ({ ...c })) : [];
  },
  async getCustomData(categoryId, _token?) {
    await delay(100);
    const list = (db.customData && db.customData[categoryId]) || [];
    return list.slice();
  },
  async createCustomCategory(categoryName, _token?) {
    await delay(80);
    db.customCategories = db.customCategories || [];
    const existing = db.customCategories.find((c) => c.categoryName === categoryName);
    if (!existing) {
      const newCat: Category = { id: `cat-${nextId++}`, categoryName };
      db.customCategories.push(newCat);
      db.customData = db.customData || {};
      db.customData[newCat.id] = [];
      return newCat;
    }
    return existing;
  },
  async addCustomItem(_token, categoryId, datetime, note) {
    await delay(80);
    db.customData = db.customData || {};
    db.customData[categoryId] = db.customData[categoryId] || [];
      const item: CustomItem = { id: String(nextRecId++), categoryId, datetime, note };
      db.customData[categoryId].push(item);
    return item;
  },
  async updateCustomItem(_token, categoryId, itemId, datetime, note) {
    await delay(80);
    db.customData = db.customData || {};
    db.customData[categoryId] = db.customData[categoryId] || [];
    const idx = db.customData[categoryId].findIndex((it) => it.id === itemId);
    if (idx === -1) {throw new Error('Custom item not found (mock)');}
    const old = db.customData[categoryId][idx];
    const updated = { id: itemId, categoryId, datetime: datetime ?? old.datetime, note: note ?? old.note };
    db.customData[categoryId][idx] = updated;
    return db.customData[categoryId][idx];
  },
  async deleteCustomItem(_token, categoryId, itemId) {
    await delay(80);
    db.customData = db.customData || {};
    db.customData[categoryId] = (db.customData[categoryId] || []).filter((it) => it.id !== itemId);
  },
  async deleteCustomCategory(_token, categoryId) {
    await delay(60);
    // If categoryId is passed as a name, try to find by id or by name
    // Here mock uses category id as id in db.customCategories
    db.customCategories = (db.customCategories || []).filter((c) => c.id !== categoryId && c.categoryName !== categoryId);
    if (db.customData) {delete db.customData[categoryId];}
  },
};

export default mockApiClient;
