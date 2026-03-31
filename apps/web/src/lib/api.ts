import { hc } from "hono/client";
import type { AppType } from "@portfolio/api";

export const api = hc<AppType>(import.meta.env.VITE_API_URL, {
  init: { credentials: "include" },
});
