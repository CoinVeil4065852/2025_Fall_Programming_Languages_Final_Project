export type Credentials = { name: string; password: string };

export type User = {
  id: string;
  name: string;
  age: number;
  weightKg: number;
  heightM: number;
  gender: 'male' | 'female' | 'other';
};

export type AuthResponse = { token: string };

export type WaterRecord = { id: string; datetime: string; amountMl: number };
export type SleepRecord = { id: string; datetime: string; hours: number };
export type ActivityRecord = { id: string; datetime: string; minutes: number; intensity: 'low' | 'moderate' | 'high' | string };
export type Category = { id: string; categoryName: string };
export type CustomItem = { id: string; categoryId?: string; datetime: string; note: string };

export interface ApiClient {
  // Auth
  login(creds: Credentials): Promise<AuthResponse>;
  register(data: {
    name: string;
    password: string;
    age: number;
    weightKg: number;
    heightM: number;
    gender: 'male' | 'female' | 'other';
  }): Promise<AuthResponse>;
  getProfile(token: string): Promise<User>;

  // BMI
  getBMI(token: string): Promise<number>;

  // Water
  addWater(token: string, datetime: string, amountMl: number): Promise<WaterRecord>;
  getAllWater(token: string): Promise<WaterRecord[]>;
  updateWater?(token: string, id: string, datetime?: string, amountMl?: number): Promise<WaterRecord>;
  deleteWater?(token: string, id: string): Promise<void>;

  // Sleep
  addSleep(token: string, datetime: string, hours: number): Promise<SleepRecord>;
  getAllSleep?(token: string): Promise<SleepRecord[]>;
  updateSleep?(token: string, id: string, datetime?: string, hours?: number): Promise<SleepRecord>;
  deleteSleep?(token: string, id: string): Promise<void>;

  // Activity
  addActivity(
    token: string,
    datetime: string,
    minutes: number,
    intensity: 'low' | 'moderate' | 'high' | string
  ): Promise<ActivityRecord>;
  getAllActivity(token: string): Promise<ActivityRecord[]>;
  updateActivity?(
    token: string,
    id: string,
    datetime?: string,
    minutes?: number,
    intensity?: 'low' | 'moderate' | 'high' | string
  ): Promise<ActivityRecord>;
  deleteActivity?(token: string, id: string): Promise<void>;
  sortActivityByDuration(token: string): Promise<void>;
  // Custom categories / data (optional)
  getCustomCategories?(token?: string): Promise<Category[]>;
  getCustomData?(categoryId: string, token?: string): Promise<CustomItem[]>;
  createCustomCategory?(categoryName: string, token?: string): Promise<Category>;
  addCustomItem?(
    token: string,
    categoryId: string,
    datetime: string,
    note: string
  ): Promise<CustomItem>;
  updateCustomItem?(
    token: string,
    categoryId: string,
    itemId: string,
    datetime?: string,
    note?: string
  ): Promise<CustomItem>;
  deleteCustomItem?(token: string, categoryId: string, itemId: string): Promise<void>;
  // delete a whole custom category (and all items under it)
  deleteCustomCategory?(token: string, categoryId: string): Promise<void>;
}

export default null as unknown as ApiClient;
