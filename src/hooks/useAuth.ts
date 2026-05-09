import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigationStore } from "@/store/navigationStore";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigationStore((s) => s.navigate);

  async function submit(email: string, password: string) {
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const err = login(email, password);
    if (err) setError(err);
    else navigate("home");
    setLoading(false);
  }

  return { loading, error, submit };
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigationStore((s) => s.navigate);

  async function submit(name: string, email: string, password: string, confirm: string) {
    if (!name || !email || !password || !confirm) { setError("Preencha todos os campos."); return; }
    if (password.length < 6) { setError("Senha: mínimo 6 caracteres."); return; }
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const err = register(name, email, password);
    if (err) setError(err);
    else navigate("home");
    setLoading(false);
  }

  return { loading, error, submit };
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const clear = useCartStore((s) => s.clear);
  const navigate = useNavigationStore((s) => s.navigate);

  return function () {
    logout();
    clear();
    navigate("login");
  };
}
