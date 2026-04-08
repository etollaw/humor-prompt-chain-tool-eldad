import { requirePromptChainAccess } from "@/lib/auth";
import {
  createHumorStep,
  deleteHumorStep,
  updateHumorStep,
} from "../actions";
import ReorderButtons from "./ReorderButtons";

export default async function StepsPage() {
  const { supabase } = await requirePromptChainAccess();

  const [
    stepsRes,
    flavorsRes,
    modelsRes,
    inputTypesRes,
    outputTypesRes,
    stepTypesRes,
  ] = await Promise.all([
    supabase
      .from("humor_flavor_steps")
      .select("id, humor_flavor_id, order_by, llm_input_type_id, llm_output_type_id, llm_model_id, humor_flavor_step_type_id, llm_temperature, llm_system_prompt, llm_user_prompt, description")
      .order("humor_flavor_id", { ascending: true })
      .order("order_by", { ascending: true }),
    supabase.from("humor_flavors").select("id, slug").order("slug", { ascending: true }),
    supabase.from("llm_models").select("id, name").order("name", { ascending: true }),
    supabase.from("llm_input_types").select("id, name").order("name", { ascending: true }),
    supabase.from("llm_output_types").select("id, name").order("name", { ascending: true }),
    supabase.from("humor_flavor_step_types").select("id, name").order("name", { ascending: true }),
  ]);

  if (stepsRes.error) return <p className="text-red-500">Failed to load steps: {stepsRes.error.message}</p>;

  const flavors = flavorsRes.data ?? [];
  const models = modelsRes.data ?? [];
  const inputTypes = inputTypesRes.data ?? [];
  const outputTypes = outputTypesRes.data ?? [];
  const stepTypes = stepTypesRes.data ?? [];

  return (
    <div>
      <h2 className="text-2xl font-bold">Humor Flavor Steps</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Create, edit, delete, and reorder steps for each humor flavor.
      </p>

      <form action={createHumorStep} className="mt-6 grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 md:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-900">
        <Select name="humor_flavor_id" label="Flavor" options={flavors.map((f) => ({ value: String(f.id), label: f.slug }))} required />
        <Input name="order_by" label="Order" required />
        <Select name="llm_model_id" label="LLM Model" options={models.map((m) => ({ value: String(m.id), label: m.name }))} required />
        <Select name="llm_input_type_id" label="Input Type" options={inputTypes.map((i) => ({ value: String(i.id), label: i.name }))} required />
        <Select name="llm_output_type_id" label="Output Type" options={outputTypes.map((o) => ({ value: String(o.id), label: o.name }))} required />
        <Select name="humor_flavor_step_type_id" label="Step Type" options={stepTypes.map((s) => ({ value: String(s.id), label: s.name }))} required />
        <Input name="llm_temperature" label="Temperature" />
        <Input name="description" label="Description" />
        <Input name="llm_system_prompt" label="System Prompt" />
        <Input name="llm_user_prompt" label="User Prompt" />
        <button className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900 md:col-span-3">
          Create Step
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {stepsRes.data?.map((step) => (
          <form key={String(step.id)} action={updateHumorStep} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <input type="hidden" name="id" value={String(step.id)} />
            <div className="grid gap-3 md:grid-cols-5">
              <Select name="humor_flavor_id" label="Flavor" options={flavors.map((f) => ({ value: String(f.id), label: f.slug }))} defaultValue={String(step.humor_flavor_id)} required />
              <Input name="order_by" label="Order" defaultValue={String(step.order_by)} required />
              <Select name="llm_model_id" label="LLM Model" options={models.map((m) => ({ value: String(m.id), label: m.name }))} defaultValue={String(step.llm_model_id)} required />
              <Select name="llm_input_type_id" label="Input Type" options={inputTypes.map((i) => ({ value: String(i.id), label: i.name }))} defaultValue={String(step.llm_input_type_id)} required />
              <Select name="llm_output_type_id" label="Output Type" options={outputTypes.map((o) => ({ value: String(o.id), label: o.name }))} defaultValue={String(step.llm_output_type_id)} required />
              <Select name="humor_flavor_step_type_id" label="Step Type" options={stepTypes.map((s) => ({ value: String(s.id), label: s.name }))} defaultValue={String(step.humor_flavor_step_type_id)} required />
              <Input name="llm_temperature" label="Temperature" defaultValue={step.llm_temperature == null ? "" : String(step.llm_temperature)} />
              <Input name="description" label="Description" defaultValue={step.description ?? ""} />
              <Input name="llm_system_prompt" label="System Prompt" defaultValue={step.llm_system_prompt ?? ""} />
              <Input name="llm_user_prompt" label="User Prompt" defaultValue={step.llm_user_prompt ?? ""} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700">Save</button>
              <button formAction={deleteHumorStep} className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-600 dark:border-red-800 dark:text-red-400">Delete</button>
              <ReorderButtons stepId={String(step.id)} />
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

function Input({
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
      />
    </label>
  );
}

function Select({
  name,
  label,
  options,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
      >
        {!defaultValue ? <option value="">Select</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
