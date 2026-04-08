import { requirePromptChainAccess } from "@/lib/auth";

export default async function CaptionsByFlavorPage({
  searchParams,
}: {
  searchParams: Promise<{ flavorId?: string }>;
}) {
  const { supabase } = await requirePromptChainAccess();
  const params = await searchParams;

  const { data: flavors } = await supabase
    .from("humor_flavors")
    .select("id, slug")
    .order("slug", { ascending: true });

  const selectedFlavorId = params.flavorId || String(flavors?.[0]?.id ?? "");

  let captions:
    | {
        id: string;
        content: string | null;
        created_datetime_utc: string;
        image_id: string | null;
      }[]
    | null = null;

  if (selectedFlavorId) {
    const { data } = await supabase
      .from("captions")
      .select("id, content, created_datetime_utc, image_id")
      .eq("humor_flavor_id", selectedFlavorId)
      .order("created_datetime_utc", { ascending: false })
      .limit(100);

    captions = data;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Generated Captions by Flavor</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Read captions produced by a selected humor flavor.</p>

      <form className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="text-xs text-zinc-500 dark:text-zinc-400">Humor Flavor</label>
        <div className="mt-1 flex gap-2">
          <select
            name="flavorId"
            defaultValue={selectedFlavorId}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            {flavors?.map((flavor) => (
              <option key={String(flavor.id)} value={String(flavor.id)}>
                {flavor.slug}
              </option>
            ))}
          </select>
          <button className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">Load</button>
        </div>
      </form>

      <div className="mt-4 space-y-3">
        {captions?.map((caption) => (
          <article key={caption.id} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm">{caption.content || "(empty)"}</p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {new Date(caption.created_datetime_utc).toLocaleString()} | image {caption.image_id}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
