import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import type { FileRouteTypes } from "@/routeTree.gen";
import { enPathOf, localeOf, localePath, type Locale } from "@/lib/i18n";
import { PT_UI } from "@/lib/strings/pt";

export type RoutePath = FileRouteTypes["to"];
type Vars = Record<string, string | number>;

/** Translate an English UI string. Unknown strings fall back to English. */
export function translate(locale: Locale, s: string, vars?: Vars) {
  let out = locale === "pt" ? (PT_UI[s] ?? s) : s;
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
  return out;
}

export function usePathname() {
  return useRouterState({ select: (s) => s.location.pathname });
}

export function useLocale(): Locale {
  return localeOf(usePathname());
}

/** English page key for the current URL. */
export function useEnPath() {
  return enPathOf(usePathname());
}

export function useT() {
  const l = useLocale();
  return useMemo(() => (s: string, vars?: Vars) => translate(l, s, vars), [l]);
}

/** Turns an English page path into the current language's URL. */
export function useLp() {
  const l = useLocale();
  return useMemo(() => (en: string) => localePath(en, l) as RoutePath, [l]);
}
