import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from './services';
import type {
  ActivityRecord,
  Category,
  CustomItem,
  SleepRecord,
  User,
  WaterRecord,
} from './services/types';

type AppData = {
  profile: User | null;
  water: WaterRecord[];
  sleep: SleepRecord[];
  activity: ActivityRecord[];
  bmi?: number | undefined;
  customCategories: Category[];
  customData: Record<string, CustomItem[]>;
  loading: boolean;
  error?: string | null;

  // refreshers
  refreshAll: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshWater: () => Promise<void>;
  refreshSleep: () => Promise<void>;
  refreshActivity: () => Promise<void>;
  refreshCustomCategories: () => Promise<void>;
  refreshCustomData: (categoryId: string) => Promise<void>;
  refreshBmi: () => Promise<void>;

  // water ops
  addWater: (datetime: string, amountMl: number) => Promise<WaterRecord | void>;
  updateWater?: (id: string, datetime: string, amountMl: number) => Promise<void>;
  deleteWater?: (id: string) => Promise<void>;

  // sleep ops
  addSleep: (datetime: string, hours: number) => Promise<SleepRecord | void>;
  updateSleep?: (id: string, datetime: string, hours: number) => Promise<void>;
  deleteSleep?: (id: string) => Promise<void>;

  // activity ops
  addActivity: (
    datetime: string,
    minutes: number,
    intensity: string
  ) => Promise<ActivityRecord | void>;
  updateActivity?: (
    id: string,
    datetime: string,
    minutes: number,
    intensity: string
  ) => Promise<void>;
  deleteActivity?: (id: string) => Promise<void>;

  // custom
  createCustomCategory?: (categoryName: string) => Promise<Category | void>;
  addCustomItem?: (
    categoryId: string,
    datetime: string,
    note: string
  ) => Promise<CustomItem | void>;
  updateCustomItem?: (
    categoryId: string,
    itemId: string,
    datetime: string,
    note: string
  ) => Promise<CustomItem | void>;
  deleteCustomItem?: (categoryId: string, itemId: string) => Promise<void>;
  deleteCustomCategory?: (categoryId: string) => Promise<void>;
};

const AppDataContext = createContext<AppData | undefined>(undefined);

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return ctx;
};

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [water, setWater] = useState<WaterRecord[]>([]);
  const [sleep, setSleep] = useState<SleepRecord[]>([]);
  const [activity, setActivity] = useState<ActivityRecord[]>([]);
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [customData, setCustomData] = useState<Record<string, CustomItem[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = () =>
    (localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '') as string;

  const { t } = useTranslation();

  const refreshProfile = async () => {
    const auth = token();
    if (!auth) {
      setProfile(null);
      return;
    }
    const p = await api.getProfile(auth);
    setProfile(p || null);
  };

  const refreshWater = async () => {
    const auth = token();
    if (!auth) {
      setWater([]);
      return;
    }
    const recs = await api.getAllWater(auth);
    setWater(recs || []);
  };

  const refreshSleep = async () => {
    const auth = token();
    if (!auth) {
      setSleep([]);
      return;
    }
    const recs = (api.getAllSleep ? await api.getAllSleep(auth) : []) as SleepRecord[];
    setSleep(recs || []);
  };

  const refreshActivity = async () => {
    const auth = token();
    if (!auth) {
      setActivity([]);
      return;
    }
    const recs = await api.getAllActivity(auth);
    setActivity(recs || []);
  };

  const refreshCustomCategories = async () => {
    const auth = token();
    if (!auth) {
      setCustomCategories([]);
      return;
    }
    if (!api.getCustomCategories) {
      setCustomCategories([]);
      return;
    }
    const cats = (await api.getCustomCategories(auth)) || [];
    setCustomCategories(cats);
  };

  const refreshCustomData = async (categoryId: string) => {
    const auth = token();
    if (!auth) {
      return;
    }
    if (!api.getCustomData) {
      return;
    }
    const data = await api.getCustomData(categoryId, auth);
    setCustomData((prev) => ({ ...prev, [categoryId]: data || [] }));
  };

  const refreshAll = async () => {
    setLoading(true);
    try {
      await Promise.all([
        refreshProfile(),
        refreshWater(),
        refreshSleep(),
        refreshActivity(),
        refreshCustomCategories(),
        refreshBmi(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [bmi, setBmi] = useState<number | undefined>(undefined);

  const refreshBmi = async () => {
    const auth = token();
    if (!auth) {
      setBmi(undefined);
      return;
    }
    if (!api.getBMI) {
      setBmi(undefined);
      return;
    }
    const v = await api.getBMI(auth);
    setBmi(v);
  };

  // ops
  const addWater = async (datetime: string, amountMl: number) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    const created = await api.addWater(auth, datetime, amountMl);
    await refreshWater();
    return created;
  };

  const updateWater = async (id: string, datetime: string, amountMl: number) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    if (api.updateWater) {
      await api.updateWater(auth, id, datetime, amountMl);
    }
    await refreshWater();
  };

  const deleteWater = async (id: string) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    if (api.deleteWater) {
      await api.deleteWater(auth, id);
    }
    await refreshWater();
  };

  const addSleep = async (datetime: string, hours: number) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    const created = api.addSleep ? await api.addSleep(auth, datetime, hours) : undefined;
    await refreshSleep();
    return created;
  };

  const updateSleep = async (id: string, datetime: string, hours: number) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    if (api.updateSleep) {
      await api.updateSleep(auth, id, datetime, hours);
    }
    await refreshSleep();
  };

  const deleteSleep = async (id: string) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    if (api.deleteSleep) {
      await api.deleteSleep(auth, id);
    }
    await refreshSleep();
  };

  const addActivity = async (datetime: string, minutes: number, intensity: string) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    const created = await api.addActivity(auth, datetime, minutes, intensity);
    await refreshActivity();
    return created;
  };

  const updateActivity = async (
    id: string,
    datetime: string,
    minutes: number,
    intensity: string
  ) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    if (api.updateActivity) {
      await api.updateActivity(auth, id, datetime, minutes, intensity);
    }
    await refreshActivity();
  };

  const deleteActivity = async (id: string) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    if (api.deleteActivity) {
      await api.deleteActivity(auth, id);
    }
    await refreshActivity();
  };

  const createCustomCategory = async (categoryName: string) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    const created = api.createCustomCategory
      ? await api.createCustomCategory(categoryName, auth)
      : undefined;
    await refreshCustomCategories();
    return created;
  };

  const addCustomItem = async (categoryId: string, datetime: string, note: string) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    if (api.addCustomItem) {
      await api.addCustomItem(auth, categoryId, datetime, note);
    }
    await refreshCustomData(categoryId);
  };

  const updateCustomItem = async (
    categoryId: string,
    itemId: string,
    datetime: string,
    note: string
  ) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    if (api.updateCustomItem) {
      await api.updateCustomItem(auth, categoryId, itemId, datetime, note);
    }
    await refreshCustomData(categoryId);
  };

  const deleteCustomItem = async (categoryId: string, itemId: string) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    if (api.deleteCustomItem) {
      await api.deleteCustomItem(auth, categoryId, itemId);
    }
    await refreshCustomData(categoryId);
  };

  const deleteCustomCategory = async (categoryId: string) => {
    const auth = token();
    if (!auth) {
      throw new Error(t('not_authenticated'));
    }
    if (api.deleteCustomCategory) {
      await api.deleteCustomCategory(auth, categoryId);
    }
    // refresh categories and remove any local data for that category
    await refreshCustomCategories();
    setCustomData((prev) => {
      const copy = { ...prev };
      delete copy[categoryId];
      return copy;
    });
  };

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        profile,
        bmi,
        water,
        sleep,
        activity,
        customCategories,
        customData,
        loading,
        error,
        refreshAll,
        refreshProfile,
        refreshWater,
        refreshSleep,
        refreshActivity,
        refreshCustomCategories,
        refreshCustomData,
        refreshBmi,
        addWater,
        updateWater,
        deleteWater,
        addSleep,
        updateSleep,
        deleteSleep,
        addActivity,
        updateActivity,
        deleteActivity,
        createCustomCategory,
        addCustomItem,
        updateCustomItem,
        deleteCustomItem,
        deleteCustomCategory,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export default AppDataContext;
