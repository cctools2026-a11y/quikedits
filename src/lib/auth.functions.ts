import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { isOwnerEmail } from "@/lib/owner";

/** Emails a one-time sign-in code, but only to the workspace owner. Always answers the same way. */
export const requestSignInCode = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; redirectTo: string }) => {
    const email = String(input?.email ?? "").trim().slice(0, 254);
    const redirectTo = String(input?.redirectTo ?? "").slice(0, 300);
    return { email, redirectTo };
  })
  .handler(async ({ data }) => {
    if (!isOwnerEmail(data.email)) return { ok: true as const };
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const sb = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { error } = await sb.auth.signInWithOtp({
      email: data.email.toLowerCase(),
      options: { shouldCreateUser: true, emailRedirectTo: data.redirectTo || undefined },
    });
    if (error) console.error("sign-in code failed", error.status, error.message);
    return { ok: true as const };
  });
