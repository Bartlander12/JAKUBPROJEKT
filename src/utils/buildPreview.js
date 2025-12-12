


function hasAdvanced(form) {
  if (!form) return false;

  const {
    requiredPhrases,
    forbiddenPhrases,
    additionalConstraints,
    examples,
    cotEnabled,
  } = form;

  return (
    (Array.isArray(requiredPhrases) && requiredPhrases.length > 0) ||
    (Array.isArray(forbiddenPhrases) && forbiddenPhrases.length > 0) ||
    (typeof additionalConstraints === "string" &&
      additionalConstraints.trim().length > 0) ||
    (typeof examples === "string" && examples.trim().length > 0) ||
    cotEnabled === true
  );
}




export default function buildPreview(form, jsonMode) {
  const {
    persona,
    task,
    goal,
    tone,
    output,
    requiredPhrases,
    forbiddenPhrases,
    additionalConstraints,
    examples,
  } = form;

  const toneDisplay = Array.isArray(tone) ? tone.join(", ") : tone || "";
  const outputDisplay = Array.isArray(output)
    ? output.join(", ")
    : output || "";

  // --- JSON MODE ---
  if (jsonMode) {
  const payload = {};

  if (persona) payload.persona = persona;
  if (task) payload.task = task;
  if (goal) payload.goal = goal;
  if (Array.isArray(tone) && tone.length > 0) payload.tone = tone;
  if (Array.isArray(output) && output.length > 0) {
    payload.output_format = output;
  }

  if (hasAdvanced(form)) {
    payload.advanced = {};

    if (requiredPhrases?.length) {
      payload.advanced.required_phrases = requiredPhrases;
    }

    if (forbiddenPhrases?.length) {
      payload.advanced.forbidden_phrases = forbiddenPhrases;
    }

    if (additionalConstraints?.trim()) {
      payload.advanced.additional_constraints = additionalConstraints;
    }

    if (examples?.trim()) {
      payload.advanced.examples = examples;
    }

    if (form.cotEnabled) {
      payload.advanced.cot = true;
    }
  }

  return JSON.stringify(payload, null, 2);
}

  // --- TEXT MODE ---
  const sections = [];

  if (persona) {
    sections.push(`=== Persona ===\n${persona}`);
  }

  if (task) {
    sections.push(`=== Task ===\n${task}`);
  }

  if (goal) {
    sections.push(`=== Goal / Kontext ===\n${goal}`);
  }

  if (toneDisplay) {
    sections.push(`=== Tone ===\n${toneDisplay}`);
  }

  if (outputDisplay) {
    sections.push(`=== Output Format ===\n${outputDisplay}`);
  }

  // --- ADVANCED (len ak má obsah) ---
  if (hasAdvanced(form)) {
    const advanced = [];

    if (requiredPhrases?.length) {
      advanced.push(
        `Required phrases:\n${requiredPhrases.map((p) => `- ${p}`).join("\n")}`
      );
    }

    if (forbiddenPhrases?.length) {
      advanced.push(
        `Forbidden phrases:\n${forbiddenPhrases
          .map((p) => `- ${p}`)
          .join("\n")}`
      );
    }

    if (additionalConstraints?.trim()) {
      advanced.push(`Additional constraints:\n${additionalConstraints}`);
    }

    if (examples?.trim()) {
      advanced.push(`Examples:\n${examples}`);
    }

    if (form.cotEnabled) {
      advanced.push(
        `Chain-of-Thought:\nExplain your reasoning step by step before giving the final answer.`
      );
    }

    sections.push(`=== Advanced ===\n${advanced.join("\n\n")}`);
  }

  return sections.join("\n\n");
}
