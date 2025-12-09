// src/utils/buildPreview.js
export default function buildPreview(form, cot, jsonMode) {
  const { persona, task, goal, tone, output } = form;

  if (jsonMode) {
    return JSON.stringify(
      {
        persona,
        task,
        goal,
        tone,
        output_format: output,
        cot,
      },
      null,
      2
    );
  }

  return `
=== Persona ===
${persona}

=== Task ===
${task}

=== Goal / Kontext ===
${goal}

=== Tone ===
${tone}

=== Output Format ===
${output}

=== Chain-of-Thought (CoT) ===
${cot ? "zapnúť" : "vypnúť"}
  `.trim();
}
