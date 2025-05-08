import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { APIError } from "@/errors/APIError";
import { useAuthStore } from "@/store/useAuthStore";

/** Базовый URL API */
// src/api/base.ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ---------- request interceptor: подставляем токены ---------- */
api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const { adminKey, traderToken } = useAuthStore.getState();

  const key =
    adminKey ??
    Cookies.get("x-admin-key") ??
    localStorage.getItem("x-admin-key");
  const token =
    traderToken ??
    Cookies.get("x-trader-token") ??
    localStorage.getItem("x-trader-token");

  if (key) cfg.headers["x-admin-key"] = key;
  if (token) cfg.headers["x-trader-token"] = token;

  return cfg;
});

/* ---------- response interceptor: унификация ошибок ---------- */
api.interceptors.response.use(
  (r) => r,
  (err: AxiosError<{ error?: string }>) => {
    if (!err.response) {
      return Promise.reject(new APIError("NETWORK", "Сервер недоступен"));
    }

    const { status, data } = err.response;
    const serverMsg = data?.error ?? "Неизвестная ошибка";

    const codeMap: Record<number, string> = {
      400: "Некорректный запрос",
      401: "Не авторизован",
      403: "Недостаточно прав",
      404: "Не найдено",
      409: "Конфликт данных",
    };

    return Promise.reject(
      new APIError(status.toString(), codeMap[status] ?? serverMsg),
    );
  },
);

export default api;
