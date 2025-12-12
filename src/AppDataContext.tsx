import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from './services';
import type { WaterRecord, SleepRecord, ActivityRecord, CustomItem, User, Category } from './services/types';

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
  addActivity: (datetime: string, minutes: number, intensity: string) => Promise<ActivityRecord | void>;
  updateActivity?: (id: string, datetime: string, minutes: number, intensity: string) => Promise<void>;
  deleteActivity?: (id: string) => Promise<void>;

  // custom
  createCustomCategory?: (categoryName: string) => Promise<Category | void>;
  addCustomItem?: (categoryId: string, datetime: string, note: string) => Promise<CustomItem | void>;
  updateCustomItem?: (categoryId: string, itemId: string, datetime: string, note: string) => Promise<CustomItem | void>;
  deleteCustomItem?: (categoryId: string, itemId: string) => Promise<void>;
  deleteCustomCategory?: (categoryId: string) => Promise<void>;
};

const AppDataContext = createContext<AppData | undefined>(undefined);

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {throw new Error('useAppData must be used within AppDataProvider');}
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

  const token = () => (localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '') as string;

  const { t } = useTranslation();

  const refreshProfile = async () => {
    try {
      const auth = token();
      if (!auth) {return setProfile(null);}
      const p = await api.getProfile(auth);
      setProfile(p || null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_load_profile'));
      setProfile(null);
    }
  };

  const refreshWater = async () => {
    try {
      const auth = token();
      if (!auth) {return setWater([]);}
      const recs = await api.getAllWater(auth);
      setWater(recs || []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_load_water'));
      setWater([]);
    }
  };

  const refreshSleep = async () => {
    try {
      const auth = token();
      if (!auth) {return setSleep([]);}
      const recs = (api.getAllSleep ? await api.getAllSleep(auth) : []) as SleepRecord[];
      setSleep(recs || []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_load_sleep'));
      setSleep([]);
    }
  };

  const refreshActivity = async () => {
    try {
      const auth = token();
      if (!auth) {return setActivity([]);}
      const recs = await api.getAllActivity(auth);
      setActivity(recs || []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_load_activity'));
      setActivity([]);
    }
  };

  const refreshCustomCategories = async () => {
    try {
      const auth = token();
      if (!auth) {return setCustomCategories([]);}
      if (!api.getCustomCategories) {return setCustomCategories([]);}
      const cats = (await api.getCustomCategories(auth)) || [];
      setCustomCategories(cats);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_load_categories'));
      setCustomCategories([]);
    }
  };

  const refreshCustomData = async (categoryId: string) => {
    try {
      const auth = token();
      if (!auth) {return;}
      if (!api.getCustomData) {return;}
      const data = await api.getCustomData(categoryId, auth);
      setCustomData((prev) => ({ ...prev, [categoryId]: data || [] }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_load_custom_data'));
      setCustomData((prev) => ({ ...prev, [categoryId]: [] }));
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([refreshProfile(), refreshWater(), refreshSleep(), refreshActivity(), refreshCustomCategories(), refreshBmi()]);
    setLoading(false);
  };

  const [bmi, setBmi] = useState<number | undefined>(undefined);

  const refreshBmi = async () => {
    try {
      const auth = token();
      if (!auth) {return setBmi(undefined);}
      if (!api.getBMI) {return setBmi(undefined);}
      const v = await api.getBMI(auth);
      setBmi(v);
    } catch (e) {
      setBmi(undefined);
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_load_bmi'));
    }
  };

  // ops
  const addWater = async (datetime: string, amountMl: number) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      const created = await api.addWater(auth, datetime, amountMl);
      await refreshWater();
      return created;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_add_water'));
    }
  };

  const updateWater = async (id: string, datetime: string, amountMl: number) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      if (api.updateWater) {await api.updateWater(auth, id, datetime, amountMl);}
      await refreshWater();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_update_water'));
    }
  };

  const deleteWater = async (id: string) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      if (api.deleteWater) {await api.deleteWater(auth, id);}
      await refreshWater();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_delete_water'));
    }
  };

  const addSleep = async (datetime: string, hours: number) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      const created = api.addSleep ? await api.addSleep(auth, datetime, hours) : undefined;
      await refreshSleep();
      return created;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_add_sleep'));
    }
  };

  const updateSleep = async (id: string, datetime: string, hours: number) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      if (api.updateSleep) {await api.updateSleep(auth, id, datetime, hours);}
      await refreshSleep();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_update_sleep'));
    }
  };

  const deleteSleep = async (id: string) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      if (api.deleteSleep) {await api.deleteSleep(auth, id);}
      await refreshSleep();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_delete_sleep'));
    }
  };

  const addActivity = async (datetime: string, minutes: number, intensity: string) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      const created = await api.addActivity(auth, datetime, minutes, intensity);
      await refreshActivity();
      return created;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_add_activity'));
    }
  };

  const updateActivity = async (id: string, datetime: string, minutes: number, intensity: string) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      if (api.updateActivity) {await api.updateActivity(auth, id, datetime, minutes, intensity);}
      await refreshActivity();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_update_activity'));
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      if (api.deleteActivity) {await api.deleteActivity(auth, id);}
      await refreshActivity();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_delete_activity'));
    }
  };

  const createCustomCategory = async (categoryName: string) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      const created = api.createCustomCategory ? await api.createCustomCategory(categoryName, auth) : undefined;
      await refreshCustomCategories();
      return created;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_create_category'));
    }
  };

  const addCustomItem = async (categoryId: string, datetime: string, note: string) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      if (api.addCustomItem) {await api.addCustomItem(auth, categoryId, datetime, note);}
      await refreshCustomData(categoryId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_add_custom_item'));
    }
  };

  const updateCustomItem = async (categoryId: string, itemId: string, datetime: string, note: string) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      if (api.updateCustomItem) {await api.updateCustomItem(auth, categoryId, itemId, datetime, note);}
      await refreshCustomData(categoryId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_update_custom_item'));
    }
  };

  const deleteCustomItem = async (categoryId: string, itemId: string) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      if (api.deleteCustomItem) {await api.deleteCustomItem(auth, categoryId, itemId);}
      await refreshCustomData(categoryId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_delete_custom_item'));
    }
  };

  const deleteCustomCategory = async (categoryId: string) => {
    try {
      const auth = token();
      if (!auth) {throw new Error(t('not_authenticated'));}
      if (api.deleteCustomCategory) {await api.deleteCustomCategory(auth, categoryId);}
      // refresh categories and remove any local data for that category
      await refreshCustomCategories();
      setCustomData((prev) => {
        const copy = { ...prev };
        delete copy[categoryId];
        return copy;
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg ?? t('failed_delete_category'));
    }
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
