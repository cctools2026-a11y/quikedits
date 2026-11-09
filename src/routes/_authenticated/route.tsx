import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isOwnerEmail } from "@/lib/owner";
import { PaletteSwitcher } from "@/components/PaletteSwitcher";
import { Motion } from "@/components/Motion";
import { LanguageHint } from "@/components/LanguageHint";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    if (!isOwnerEmail(data.user.email)) {
      await supabase.auth.signOut();
      throw redirect({ to: "/" });
    }
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: Workspace,
});

function Workspace() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }
  return (
    <>
      <Outlet />
      <button
        type="button"
        onClick={signOut}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-xs font-bold shadow-float hover:border-primary"
      >
        <LogOut className="h-3.5 w-3.5" /> Sign out
      </button>
      <PaletteSwitcher />
      <LanguageHint />
      <Motion />
    </>
  );
}
