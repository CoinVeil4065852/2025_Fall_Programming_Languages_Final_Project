import { useState } from 'react';
import { Paper, TextInput, PasswordInput, Checkbox, Button, Stack, Title, Text, Center, Box, LoadingOverlay, Anchor, Group } from '@mantine/core';
import { NavLink, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../../services/auth';
import type { AuthResponse } from '@/services/types';
import { useAppData } from '../../AppDataContext';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';

type LoginResult = AuthResponse;

const LoginForm = () => {
  const { t } = useTranslation();
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      password: '',
      rememberMe: false,
    },

    validate: {
      name: (value) => value.trim() ? null : t('invalid_username'),
      password: (value) => value.trim() ? null : t('invalid_password'),
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { refreshAll } = useAppData();

  const handleSubmit = form.onSubmit(async (values) => {
    if (loading) return;
    console.log(values)


    const { name, password, rememberMe: remember } = values;

    setLoading(true);
    try {
      const result: LoginResult = await authLogin({ name, password });
      if (result.token) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('authToken', result.token);
          // refresh app data (profile, records)
          try { await refreshAll(); } catch (e) { /* ignore */ }
      }
      // Navigate to home after successful login
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg ?? t('login_failed'));
    } finally {
      setLoading(false);
    }
  })

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Paper shadow='md' radius="md" p="xl" withBorder style={{ maxWidth: 420, margin: '2rem auto' }}>
        <form onSubmit={handleSubmit} noValidate>
          <Stack gap="sm">
            <Center>
              <Title order={3} >{t('title')}</Title>
            </Center>

            <TextInput
              label={t('username')}
              placeholder={t('username_placeholder')}
              key={form.key('name')}
              {...form.getInputProps('name')}

              autoComplete="username"
            />

            <PasswordInput
              label={t('password')}
              placeholder={t('password_placeholder')}
              key={form.key('password')}
              {...form.getInputProps('password')}

              autoComplete="current-password"
            />

            <Checkbox
              label={t('remember_me')}
              key={form.key('rememberMe')}
              {...form.getInputProps('rememberMe', { type: 'checkbox' })}
            />

            {error && (
              <Text c="red" size="sm" role="alert">
                {error}
              </Text>
            )}

            <Button type="submit" fullWidth loading={loading} mt="md">
              {t('login')}
            </Button>
            <Group  justify='center'>
              <Text size="sm" c="dimmed" >
                {t('register_prompt')}
              </Text>
              <Anchor component={NavLink} to="/register" size="sm">
                {t('register')}
              </Anchor>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginForm;


