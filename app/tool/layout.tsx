import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import { requirePromptChainAccess } from "@/lib/auth";
import { signOutAction } from "./actions";

const links = [
  { href: "/tool", label: "Dashboard" },
  { href: "/tool/flavors", label: "Humor Flavors" },
  { href: "/tool/steps", label: "Flavor Steps" },
  { href: "/tool/captions", label: "Generated Captions" },
  { href: "/tool/test", label: "Test Generator" },
];

export default async function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user } = await requirePromptChainAccess();

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, email")
    .eq("id", user.id)
    .single();

  const displayName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ") || profile?.email || user.email;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-zinc-200 p-6 dark:border-zinc-800">
          <h1 className="text-xl font-bold">Prompt Chain Tool</h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Week 8-10 Workspace</p>

          <div className="mt-5 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Signed in as</p>
            <p className="text-sm font-medium break-all">{displayName}</p>
            <ThemeToggle />
            <form action={signOutAction}>
              <button className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
