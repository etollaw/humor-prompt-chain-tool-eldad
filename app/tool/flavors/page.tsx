import { requirePromptChainAccess } from "@/lib/auth";
import {
  createHumorFlavor,
  deleteHumorFlavor,
  duplicateHumorFlavor,
  updateHumorFlavor,
} from "../actions";

export default async function FlavorsPage() {
  const { supabase } = await requirePromptChainAccess();

  const { data: flavors, error } = await supabase
    .from("humor_flavors")
    .select("id, slug, description, created_datetime_utc")
    .order("created_datetime_utc", { ascending: false });

  if (error) return <p className="text-red-500">Failed to load flavors: {error.message}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">Humor Flavors</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Create, update, and delete flavor definitions.</p>

      <form action={createHumorFlavor} className="mt-6 grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-900">
        <input
          name="slug"
          required
          placeholder="flavor-slug"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
        <input
          name="description"
          placeholder="Description"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
          Create Flavor
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {flavors?.map((flavor) => (
          <div key={String(flavor.id)} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <form action={updateHumorFlavor} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto_auto]">
              <input type="hidden" name="id" value={String(flavor.id)} />
              <input
                name="slug"
                defaultValue={flavor.slug}
                required
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
              <input
                name="description"
                defaultValue={flavor.description ?? ""}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
              <button className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">Save</button>
              <button formAction={deleteHumorFlavor} className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 dark:border-red-800 dark:text-red-400">
                Delete
              </button>
            </form>

            <form action={duplicateHumorFlavor} className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
              <input type="hidden" name="source_flavor_id" value={String(flavor.id)} />
              <input
                name="new_slug"
                required
                defaultValue={`${flavor.slug}-copy`}
                placeholder="new-unique-slug"
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
              <button className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">
                Duplicate Flavor + Steps
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
