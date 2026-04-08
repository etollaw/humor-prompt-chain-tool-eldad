import { requirePromptChainAccess } from "@/lib/auth";
import TestForm from "./TestForm";

export default async function TestPage() {
  const { supabase } = await requirePromptChainAccess();

  const [flavorsRes, imagesRes] = await Promise.all([
    supabase.from("humor_flavors").select("id, slug").order("slug", { ascending: true }),
    supabase
      .from("images")
      .select("id, url, is_common_use")
      .eq("is_common_use", true)
      .order("created_datetime_utc", { ascending: false })
      .limit(100),
  ]);

  const flavorOptions =
    flavorsRes.data?.map((f) => ({ id: String(f.id), label: f.slug })) ?? [];
  const imageOptions =
    imagesRes.data?.map((i) => ({ id: String(i.id), label: `${String(i.id).slice(0, 8)}...` })) ?? [];

  return (
    <div>
      <h2 className="text-2xl font-bold">Test Humor Flavor via REST API</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Uses api.almostcrackd.ai to generate captions from a selected flavor and image test set item.
      </p>

      <div className="mt-4">
        <TestForm flavorOptions={flavorOptions} imageOptions={imageOptions} />
      </div>
    </div>
  );
}
