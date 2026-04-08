import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginButton from "./LoginButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_superadmin, is_matrix_admin")
      .eq("id", user.id)
      .single();

    if (profile?.is_superadmin || profile?.is_matrix_admin) {
      redirect("/tool");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-3 text-3xl font-bold">Prompt Chain Tool</h1>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Sign in with a superadmin or matrix admin account to manage humor flavors and steps.
      </p>
      {params.error === "unauthorized" ? (
        <p className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          You are logged in but do not have required permissions.
        </p>
      ) : null}
      <LoginButton />
    </main>
  );
}
