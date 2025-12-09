import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { useAppData } from '@/AppDataContext';
import AddCustomItemModal from '@/components/Modals/AddCustomItemModal/AddCustomItemModal';
import { CustomItem } from '@/services/types';
import RecordList from '../../components/RecordList/RecordList';

type UiCustomRecord = { id: string; date: string; time: string; note: string };

const CustomCategoryPage = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelected] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<CustomItem | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();
  const {
    customCategories,
    customData,
    refreshCustomData,
    createCustomCategory,
    addCustomItem,
    updateCustomItem,
    deleteCustomItem,
  } = useAppData();

  useEffect(() => {
    setCategories(customCategories ?? []);
    // set default selection to first category when none selected
    if (
      (!selectedCategory || selectedCategory === null) &&
      customCategories &&
      customCategories.length > 0
    ) {
      setSelected(customCategories[0]);
    }
  }, [customCategories]);

  const uiRecords: UiCustomRecord[] = (customData?.[selectedCategory ?? ''] ?? []).map((item) => ({
    id: String(item.id ?? ''),
    date: item.datetime ? String(item.datetime).split('T')[0] : '',
    time: item.datetime ? (String(item.datetime).split('T')[1] ?? '') : '',
    note: item.note,
  }));

  const createCategory = async () => {
    if (!newCategory) return;
    try {
      setError(null);
      if (!createCustomCategory) throw new Error(t('endpoint_not_implemented'));
      await createCustomCategory(newCategory);
      setNewCategory('');
    } catch (err: any) {
      setError(err?.message ?? t('failed_create_category'));
      setNewCategory('');
    }
  };

  return (
    <Stack gap="md">
      <h1>{t('custom_category')}</h1>
      <Grid>
        <Grid.Col span={6}>
          <Select
            data={categories}
            value={selectedCategory}
            onChange={setSelected}
            placeholder={t('select_category')}
            searchable
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Group>
            <TextInput
              value={newCategory}
              onChange={(e) => setNewCategory(e.currentTarget.value)}
              placeholder={t('new_category_name')}
            />
            <Button onClick={createCategory}>{t('create')}</Button>
          </Group>
        </Grid.Col>
      </Grid>

      {error && (
        <Text c="red" size="sm">
          {error}
        </Text>
      )}

      {/** derive which fields to show and explicitly hide `datetime` for custom categories */}
      <RecordList
        style={{ width: '100%' }}
        title={selectedCategory ? `${selectedCategory} ${t('records')}` : t('select_a_category')}
        records={uiRecords}
        onEdit={(r) => {
          setEditItem(
            customData[selectedCategory ?? ''].find(
              (item) => String(item.id) === r.id
            ) as CustomItem
          );
          setAddOpen(true);
        }}
        onDelete={async (r) => {
          try {
            setError(null);
            if (selectedCategory && deleteCustomItem) {
              await deleteCustomItem(selectedCategory, r.id);
              await refreshCustomData?.(selectedCategory);
            }
          } catch (err: any) {
            setError(err?.message ?? t('failed_delete_custom_item'));
          }
        }}
        onAddClick={
          selectedCategory
            ? () => {
                setEditItem(null);
                setAddOpen(true);
              }
            : undefined
        }
      />

      <AddCustomItemModal
        opened={addOpen}
        onClose={() => {
          setAddOpen(false);
          setEditItem(null);
        }}
        initialValues={editItem ? { datetime: editItem.datetime, note: editItem.note } : undefined}
        onAdd={async ({ datetime, note }) => {
          try {
            if (!selectedCategory) throw new Error(t('no_category_selected'));
            if (editItem) {
              if (updateCustomItem) {
                await updateCustomItem(selectedCategory, editItem.id, datetime, note);
                await refreshCustomData?.(selectedCategory);
              }
            } else {
              if (addCustomItem) {
                await addCustomItem(selectedCategory, datetime, note);
                await refreshCustomData?.(selectedCategory);
              }
            }
          } catch (err: any) {
            if (editItem) setError(err?.message ?? t('failed_update_custom_item'));
          } finally {
            setAddOpen(false);
            setEditItem(null);
          }
        }}
      />
    </Stack>
  );
};

export default CustomCategoryPage;
