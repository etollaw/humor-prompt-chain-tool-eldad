import { requirePromptChainAccess } from "@/lib/auth";

export default async function ToolHomePage() {
  const { supabase } = await requirePromptChainAccess();

  const [flavorsRes, stepsRes, captionsRes] = await Promise.all([
    supabase.from("humor_flavors").select("*", { count: "exact", head: true }),
    supabase.from("humor_flavor_steps").select("*", { count: "exact", head: true }),
    supabase.from("captions").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold">Prompt Chain Dashboard</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Manage humor flavors, manage steps, reorder chains, and test generation with image test sets.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Humor Flavors" value={flavorsRes.count ?? 0} />
        <Stat label="Flavor Steps" value={stepsRes.count ?? 0} />
        <Stat label="Captions" value={captionsRes.count ?? 0} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}
