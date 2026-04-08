"use client";

import { useState } from "react";
import { testFlavorGenerateCaptions } from "../actions";

type Option = { id: string; label: string };

export default function TestForm({
  flavorOptions,
  imageOptions,
}: {
  flavorOptions: Option[];
  imageOptions: Option[];
}) {
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setResult("");

    const response = await testFlavorGenerateCaptions(formData);

    if (response.error) {
      setError(response.error);
    } else {
      setResult(JSON.stringify(response.data, null, 2));
    }

    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <form action={onSubmit} className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-zinc-500 dark:text-zinc-400">Humor Flavor</span>
          <select
            name="humor_flavor_id"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="">Select flavor</option>
            {flavorOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs">
          <span className="text-zinc-500 dark:text-zinc-400">Image Test Set Item</span>
          <select
            name="image_id"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="">Select image</option>
            {imageOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          disabled={loading}
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 sm:col-span-2"
        >
          {loading ? "Generating..." : "Generate Captions"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
      {result ? (
        <pre className="mt-3 max-h-96 overflow-auto rounded-md bg-zinc-950 p-3 text-xs text-zinc-100">
          {result}
        </pre>
      ) : null}
    </div>
  );
}
