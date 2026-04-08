"use server";

import { requirePromptChainAccess } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type ActionResult = { success?: true; error?: string; data?: unknown };

const API_BASE = "https://api.almostcrackd.ai";

export async function signOutAction(): Promise<void> {
  const { supabase } = await requirePromptChainAccess();
  await supabase.auth.signOut();
}

export async function createHumorFlavor(formData: FormData): Promise<void> {
  const { supabase, profileId } = await requirePromptChainAccess();

  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!slug) return;

  const { error } = await supabase.from("humor_flavors").insert({
    slug,
    description: description || null,
    created_by_user_id: profileId,
    modified_by_user_id: profileId,
  });

  if (error) return;

  revalidatePath("/tool/flavors");
}

export async function updateHumorFlavor(formData: FormData): Promise<void> {
  const { supabase, profileId } = await requirePromptChainAccess();

  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!id || !slug) return;

  const { error } = await supabase
    .from("humor_flavors")
    .update({
      slug,
      description: description || null,
      modified_by_user_id: profileId,
    })
    .eq("id", id);

  if (error) return;

  revalidatePath("/tool/flavors");
}

export async function deleteHumorFlavor(formData: FormData): Promise<void> {
  const { supabase } = await requirePromptChainAccess();
  const id = String(formData.get("id") ?? "");

  if (!id) return;

  const { error } = await supabase.from("humor_flavors").delete().eq("id", id);
  if (error) return;

  revalidatePath("/tool/flavors");
  revalidatePath("/tool/steps");
}

export async function createHumorStep(formData: FormData): Promise<void> {
  const { supabase, profileId } = await requirePromptChainAccess();

  const humorFlavorId = String(formData.get("humor_flavor_id") ?? "");
  const orderBy = Number(String(formData.get("order_by") ?? ""));
  const llmInputTypeId = String(formData.get("llm_input_type_id") ?? "");
  const llmOutputTypeId = String(formData.get("llm_output_type_id") ?? "");
  const llmModelId = String(formData.get("llm_model_id") ?? "");
  const stepTypeId = String(formData.get("humor_flavor_step_type_id") ?? "");
  const llmSystemPrompt = String(formData.get("llm_system_prompt") ?? "").trim();
  const llmUserPrompt = String(formData.get("llm_user_prompt") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const tempRaw = String(formData.get("llm_temperature") ?? "").trim();
  const llmTemperature = tempRaw ? Number(tempRaw) : null;

  if (
    !humorFlavorId ||
    Number.isNaN(orderBy) ||
    !llmInputTypeId ||
    !llmOutputTypeId ||
    !llmModelId ||
    !stepTypeId
  ) {
    return;
  }

  const { error } = await supabase.from("humor_flavor_steps").insert({
    humor_flavor_id: humorFlavorId,
    order_by: orderBy,
    llm_input_type_id: llmInputTypeId,
    llm_output_type_id: llmOutputTypeId,
    llm_model_id: llmModelId,
    humor_flavor_step_type_id: stepTypeId,
    llm_temperature: llmTemperature,
    llm_system_prompt: llmSystemPrompt || null,
    llm_user_prompt: llmUserPrompt || null,
    description: description || null,
    created_by_user_id: profileId,
    modified_by_user_id: profileId,
  });

  if (error) return;

  revalidatePath("/tool/steps");
}

export async function updateHumorStep(formData: FormData): Promise<void> {
  const { supabase, profileId } = await requirePromptChainAccess();

  const id = String(formData.get("id") ?? "");
  const orderBy = Number(String(formData.get("order_by") ?? ""));
  const llmInputTypeId = String(formData.get("llm_input_type_id") ?? "");
  const llmOutputTypeId = String(formData.get("llm_output_type_id") ?? "");
  const llmModelId = String(formData.get("llm_model_id") ?? "");
  const stepTypeId = String(formData.get("humor_flavor_step_type_id") ?? "");
  const llmSystemPrompt = String(formData.get("llm_system_prompt") ?? "").trim();
  const llmUserPrompt = String(formData.get("llm_user_prompt") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const tempRaw = String(formData.get("llm_temperature") ?? "").trim();
  const llmTemperature = tempRaw ? Number(tempRaw) : null;

  if (
    !id ||
    Number.isNaN(orderBy) ||
    !llmInputTypeId ||
    !llmOutputTypeId ||
    !llmModelId ||
    !stepTypeId
  ) {
    return;
  }

  const { error } = await supabase
    .from("humor_flavor_steps")
    .update({
      order_by: orderBy,
      llm_input_type_id: llmInputTypeId,
      llm_output_type_id: llmOutputTypeId,
      llm_model_id: llmModelId,
      humor_flavor_step_type_id: stepTypeId,
      llm_temperature: llmTemperature,
      llm_system_prompt: llmSystemPrompt || null,
      llm_user_prompt: llmUserPrompt || null,
      description: description || null,
      modified_by_user_id: profileId,
    })
    .eq("id", id);

  if (error) return;

  revalidatePath("/tool/steps");
}

export async function deleteHumorStep(formData: FormData): Promise<void> {
  const { supabase } = await requirePromptChainAccess();
  const id = String(formData.get("id") ?? "");

  if (!id) return;

  const { error } = await supabase.from("humor_flavor_steps").delete().eq("id", id);
  if (error) return;

  revalidatePath("/tool/steps");
}

export async function reorderHumorStep(
  stepId: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  const { supabase, profileId } = await requirePromptChainAccess();

  const { data: currentStep, error: currentError } = await supabase
    .from("humor_flavor_steps")
    .select("id, humor_flavor_id, order_by")
    .eq("id", stepId)
    .single();

  if (currentError || !currentStep) return { error: currentError?.message || "Step not found." };

  const targetOrder = direction === "up" ? currentStep.order_by - 1 : currentStep.order_by + 1;

  const { data: swapStep, error: swapLookupError } = await supabase
    .from("humor_flavor_steps")
    .select("id, order_by")
    .eq("humor_flavor_id", currentStep.humor_flavor_id)
    .eq("order_by", targetOrder)
    .maybeSingle();

  if (swapLookupError) return { error: swapLookupError.message };
  if (!swapStep) return { error: `Cannot move ${direction}.` };

  const { error: firstUpdateError } = await supabase
    .from("humor_flavor_steps")
    .update({ order_by: targetOrder, modified_by_user_id: profileId })
    .eq("id", currentStep.id);

  if (firstUpdateError) return { error: firstUpdateError.message };

  const { error: secondUpdateError } = await supabase
    .from("humor_flavor_steps")
    .update({ order_by: currentStep.order_by, modified_by_user_id: profileId })
    .eq("id", swapStep.id);

  if (secondUpdateError) return { error: secondUpdateError.message };

  revalidatePath("/tool/steps");
  return { success: true };
}

export async function testFlavorGenerateCaptions(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requirePromptChainAccess();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return { error: "No active auth session." };

  const humorFlavorId = String(formData.get("humor_flavor_id") ?? "");
  const imageId = String(formData.get("image_id") ?? "");

  if (!humorFlavorId || !imageId) {
    return { error: "Humor flavor and image are required." };
  }

  const payload = { imageId, humorFlavorId };

  const response = await fetch(`${API_BASE}/pipeline/generate-captions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    return { error: `API error (${response.status}): ${text}` };
  }

  const data = await response.json();
  revalidatePath("/tool/captions");
  return { success: true, data };
}
