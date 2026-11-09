import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { requestSignInCode } from "@/lib/auth.functions";
import { isOwnerEmail } from "@/lib/owner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in" },
      { name: "description", content: "Sign in." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Sign in" },
      { property: "og:description", content: "Sign in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const send = useServerFn(requestSignInCode);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    await send({ data: { email, redirectTo: `${window.location.origin}/workspace/` } }).catch(() => {});
    setBusy(false); setStep("code");
  }

  async function onCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const { data, error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: "email" });
    setBusy(false);
    if (error || !isOwnerEmail(data.user?.email)) {
      if (data.session) await supabase.auth.signOut();
      return setError("That code didn't work. Check it and try again.");
    }
    navigate({ to: "/workspace/" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      {step === "email" ? (
        <form onSubmit={onEmail} className="w-full max-w-sm space-y-4 rounded-[1.5rem] border-4 border-foreground bg-card p-6 shadow-float">
          <h1 className="font-display text-4xl">Sign in</h1>
          <label className="block text-sm font-semibold">Email
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-foreground bg-background px-3 py-2" />
          </label>
          <button disabled={busy} className="w-full rounded-full bg-primary px-4 py-2.5 font-bold text-primary-foreground disabled:opacity-60">{busy ? "Sending…" : "Send code"}</button>
        </form>
      ) : (
        <form onSubmit={onCode} className="w-full max-w-sm space-y-4 rounded-[1.5rem] border-4 border-foreground bg-card p-6 shadow-float">
          <h1 className="font-display text-4xl">Check your inbox</h1>
          <p className="text-sm text-muted-foreground">If this email can sign in, a code is on its way. You can also click the link in the email.</p>
          <label className="block text-sm font-semibold">Code
            <input inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-foreground bg-background px-3 py-2 tracking-[0.3em]" />
          </label>
          {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
          <button disabled={busy} className="w-full rounded-full bg-primary px-4 py-2.5 font-bold text-primary-foreground disabled:opacity-60">{busy ? "Checking…" : "Sign in"}</button>
          <button type="button" onClick={() => { setStep("email"); setCode(""); setError(""); }} className="w-full text-sm underline">Use a different email</button>
        </form>
      )}
    </main>
  );
}
