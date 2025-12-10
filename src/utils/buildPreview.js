export default function buildPreview(form, cot, jsonMode) {
  const { persona, task, goal, tone, output } = form;

  const toneDisplay = Array.isArray(tone) ? tone.join(", ") : tone || "";
  const outputDisplay = Array.isArray(output)
    ? output.join(", ")
    : output || "";

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
${toneDisplay}

=== Output Format ===
${outputDisplay}

=== Chain-of-Thought (CoT) ===
${cot ? "zapnúť" : "vypnúť"}
  `.trim();
}
