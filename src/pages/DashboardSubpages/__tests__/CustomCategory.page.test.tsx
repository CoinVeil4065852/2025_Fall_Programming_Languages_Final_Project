import { render, screen } from '../../../../test-utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import CustomCategoryPage from '../CustomCategory.page';
import AppDataContext from '../../../AppDataContext';
import type { Category, CustomItem } from '@/services/types';

describe('CustomCategoryPage', () => {
  test('selects newly created category and refreshes data', async () => {
    const fakeCats: Category[] = [];
    const fakeData: Record<string, CustomItem[]> = {};
    const created: Category = { id: 'new-id', categoryName: 'New Cat' };
    let createdCalled = false;
    const createCustomCategory = async (name: string) => {
      createdCalled = true;
      return created;
    };
    const refreshCustomData = vi.fn(async (categoryId: string) => {
      fakeData[categoryId] = [];
    });

    render(
      <AppDataContext.Provider
        value={
          // minimal stubbed context
          {
            profile: null,
            bmi: undefined,
            water: [],
            sleep: [],
            activity: [],
            customCategories: fakeCats,
            customData: fakeData,
            loading: false,
            error: undefined,
            refreshAll: async () => {},
            refreshProfile: async () => {},
            refreshWater: async () => {},
            refreshSleep: async () => {},
            refreshActivity: async () => {},
            refreshCustomCategories: async () => {},
            refreshCustomData,
            refreshBmi: async () => {},
            addWater: async () => {},
            addSleep: async () => {},
            addActivity: async () => {},
            createCustomCategory,
            addCustomItem: async () => {},
            updateCustomItem: async () => {},
            deleteCustomItem: async () => {},
          } as any
        }
      >
        <CustomCategoryPage />
      </AppDataContext.Provider>
    );

    // add new category
    const input = screen.getByPlaceholderText(/new_category_name/i);
    await userEvent.type(input, 'New Cat');
    const createBtn = screen.getByRole('button', { name: /create/i });
    await userEvent.click(createBtn);

    // assert our create was called and the page requested data refresh for the new category
    expect(createdCalled).toBe(true);
    expect(refreshCustomData).toHaveBeenCalledWith('new-id');
  });

  test('loads data for selected category on first render', async () => {
    const fakeCats: Category[] = [{ id: 'cat1', categoryName: 'Cat 1' }];
    const fakeData: Record<string, CustomItem[]> = {};
    const refreshCustomData = vi.fn(async (categoryId: string) => {
      fakeData[categoryId] = [];
    });

    render(
      <AppDataContext.Provider
        value={
          // minimal stubbed context
          {
            profile: null,
            bmi: undefined,
            water: [],
            sleep: [],
            activity: [],
            customCategories: fakeCats,
            customData: fakeData,
            loading: false,
            error: undefined,
            refreshAll: async () => {},
            refreshProfile: async () => {},
            refreshWater: async () => {},
            refreshSleep: async () => {},
            refreshActivity: async () => {},
            refreshCustomCategories: async () => {},
            refreshCustomData,
            refreshBmi: async () => {},
            addWater: async () => {},
            addSleep: async () => {},
            addActivity: async () => {},
            createCustomCategory: async () => {},
            addCustomItem: async () => {},
            updateCustomItem: async () => {},
            deleteCustomItem: async () => {},
          } as any
        }
      >
        <CustomCategoryPage />
      </AppDataContext.Provider>
    );

    expect(refreshCustomData).toHaveBeenCalledWith('cat1');
  });

  test('deletes selected category when delete button clicked', async () => {
    const fakeCats: Category[] = [{ id: 'cat1', categoryName: 'Cat 1' }];
    const fakeData: Record<string, CustomItem[]> = { cat1: [] };
    let deleteCalledWith: string | null = null;
    const deleteCustomCategory = vi.fn(async (categoryId: string) => {
      deleteCalledWith = categoryId;
    });
    const refreshCustomCategories = vi.fn(async () => {
      // simulate removal
    });

    render(
      <AppDataContext.Provider
        value={
          // minimal stubbed context
          {
            profile: null,
            bmi: undefined,
            water: [],
            sleep: [],
            activity: [],
            customCategories: fakeCats,
            customData: fakeData,
            loading: false,
            error: undefined,
            refreshAll: async () => {},
            refreshProfile: async () => {},
            refreshWater: async () => {},
            refreshSleep: async () => {},
            refreshActivity: async () => {},
            refreshCustomCategories,
            refreshCustomData: async () => {},
            refreshBmi: async () => {},
            addWater: async () => {},
            addSleep: async () => {},
            addActivity: async () => {},
            createCustomCategory: async () => {},
            addCustomItem: async () => {},
            updateCustomItem: async () => {},
            deleteCustomItem: async () => {},
            deleteCustomCategory,
          } as any
        }
      >
        <CustomCategoryPage />
      </AppDataContext.Provider>
    );

    const btn = screen.getByRole('button', { name: /delete/i });
    // confirm() is blocked; use vi stub to auto-approve
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    await userEvent.click(btn);
    expect(deleteCustomCategory).toHaveBeenCalledWith('cat1');
    confirmSpy.mockRestore();
  });
});
