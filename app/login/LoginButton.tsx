"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginButton() {
  const onLogin = async () => {
    const supabase = createSupabaseBrowserClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={onLogin}
      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
    >
      Sign in with Google
    </button>
  );
}
