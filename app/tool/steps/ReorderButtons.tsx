"use client";

import { useTransition, useState } from "react";
import { reorderHumorStep } from "../actions";
import { useRouter } from "next/navigation";

export default function ReorderButtons({ stepId }: { stepId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const move = (direction: "up" | "down") => {
    setError(null);
    startTransition(async () => {
      const result = await reorderHumorStep(stepId, direction);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={() => move("up")}
        className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700"
      >
        Up
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => move("down")}
        className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700"
      >
        Down
      </button>
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </div>
  );
}
