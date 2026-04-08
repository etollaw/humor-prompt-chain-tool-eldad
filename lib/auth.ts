import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requirePromptChainAccess() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, is_superadmin, is_matrix_admin")
    .eq("id", user.id)
    .single();

  if (!profile || (!profile.is_superadmin && !profile.is_matrix_admin)) {
    redirect("/login?error=unauthorized");
  }

  return { supabase, user, profileId: profile.id };
}
