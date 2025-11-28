type Credentials = { username: string; password: string };

type User = {
  id: string;
  username: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
};

type AuthResponse = { token: string; user: User };

const fakeDb: { users: User[] } = {
  users: [
    { id: '1', username: 'alice', age: 30, weight: 60, height: 165, gender: 'F' },
    { id: '2', username: 'bob', age: 28, weight: 75, height: 180, gender: 'M' },
  ],
};
history
let nextId = 3;

function delay(ms = 500) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function login(creds: Credentials): Promise<AuthResponse> {
  await delay(300 + Math.random() * 400);

  // Quick failure triggers for testing
  if (creds.username === 'error') {
    throw new Error('Server error (simulated)');
  }

  const user = fakeDb.users.find((u) => u.username === creds.username);

  // For the fake API accept password 'password' for any existing user
  if (!user || creds.password !== 'password') {
    throw new Error('Invalid username or password (fake)');
  }

  return {
    token: 'fake-jwt-token',
    user: { ...user },
  };
}

export async function register(data: {
  username: string;
  password: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
}): Promise<AuthResponse> {
  await delay(400 + Math.random() * 600);

  if (data.username === 'taken') {
    throw new Error('Username already taken (fake)');
  }

  // Simple validation
  if (!data.username || !data.password) {
    throw new Error('Missing username or password');
  }

  const newUser: User = {
    id: String(nextId++),
    username: data.username,
    age: data.age,
    weight: data.weight,
    height: data.height,
    gender: data.gender,
  };

  fakeDb.users.push(newUser);

  return {
    token: 'fake-jwt-token',
    user: { ...newUser },
  };
}

export async function getProfile(token: string): Promise<User> {
  await delay(200 + Math.random() * 200);

  if (token !== 'fake-jwt-token') {
    throw new Error('Invalid token (fake)');
  }

  // Return the first user for simplicity
  return { ...fakeDb.users[0] };
}

export default { login, register, getProfile };
