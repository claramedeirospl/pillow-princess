import { create } from "zustand";
import type { User } from "@/@types";

const STORAGE_KEY_USERS = "pp_users";
const STORAGE_KEY_SESSION = "pp_session";

const INITIAL_ADMIN: User = {
  id: "u0",
  name: "Admin",
  email: "admin@pillowprincess.com",
  password: "admin123",
  role: "admin",
  createdAt: new Date().toISOString(),
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    // React Native: use expo-secure-store or AsyncStorage in production.
    // For now, using a module-level in-memory map (works across the app session).
    const raw = storageMap.get(key);
    return raw !== undefined ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown): void {
  storageMap.set(key, JSON.stringify(value));
}

// Module-level in-memory store (replace with AsyncStorage/SecureStore for persistence)
const storageMap = new Map<string, string>();

interface AuthState {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
  updateUserData: (updates: Partial<User>) => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  users: readStorage<User[]>(STORAGE_KEY_USERS, [INITIAL_ADMIN]),

  login(email, password) {
    const all = readStorage<User[]>(STORAGE_KEY_USERS, [INITIAL_ADMIN]);
    const found = all.find((u) => u.email === email && u.password === password);
    if (!found) return "E-mail ou senha incorretos.";
    writeStorage(STORAGE_KEY_SESSION, found);
    set({ user: found, users: all });
    return null;
  },

  register(name, email, password) {
    const all = readStorage<User[]>(STORAGE_KEY_USERS, [INITIAL_ADMIN]);
    if (all.find((u) => u.email === email)) return "E-mail já cadastrado.";
    const newUser: User = {
      id: "u" + Date.now(),
      name,
      email,
      password,
      role: "user",
      createdAt: new Date().toISOString(),
      addresses: [],
      payments: [],
    };
    const updated = [...all, newUser];
    writeStorage(STORAGE_KEY_USERS, updated);
    writeStorage(STORAGE_KEY_SESSION, newUser);
    set({ user: newUser, users: updated });
    return null;
  },

  logout() {
    storageMap.delete(STORAGE_KEY_SESSION);
    set({ user: null });
  },

  updateUserData(updates) {
    const { user, users } = get();
    if (!user) return;
    const updated = { ...user, ...updates };
    const updatedUsers = users.map((u) => (u.id === user.id ? updated : u));
    writeStorage(STORAGE_KEY_SESSION, updated);
    writeStorage(STORAGE_KEY_USERS, updatedUsers);
    set({ user: updated, users: updatedUsers });
  },

  isAdmin() {
    return get().user?.role === "admin";
  },
}));
