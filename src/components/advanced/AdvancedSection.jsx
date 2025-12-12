// src/components/advanced/AdvancedSection.jsx
import React, { useState } from "react";
import SuggestionInput from "../SuggestionInput/SuggestionInput";
import TextAreaField from "../TextAreaField";
import Toggle from "../Toggle";

export default function AdvancedSection({
  requiredPhrases,
  forbiddenPhrases,
  additionalConstraints,
  examples,
  cotEnabled,

  onRequiredPhrasesChange,
  onForbiddenPhrasesChange,
  onAdditionalConstraintsChange,
  onExamplesChange,
  onCotChange,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* DIVIDER + TOGGLE */}
      <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center gap-3 text-xs text-slate-500 hover:text-slate-700 select-none"
            >
            <div className="flex-1 border-t border-slate-200" />

            <span className="uppercase tracking-wide">
                Advanced options
            </span>

            <span
                className={`transition-transform duration-200 ${
                open ? "rotate-180" : ""
                }`}
            >
                ⌄
            </span>

            <div className="flex-1 border-t border-slate-200" />
            </button>


      {/* ADVANCED CONTENT */}
      {open && (
        <div className="mt-4 flex flex-col gap-4">

          <SuggestionInput
            id="required_phrases"
            label="Required phrases"
            hint="Frázy, ktoré sa musia objaviť"
            placeholder="Add phrase…"
            value={requiredPhrases}
            onChange={onRequiredPhrasesChange}
            suggestions={[]}
            multiSelect
            enableEnterAdd
            favorites={[]}
          />

          <SuggestionInput
            id="forbidden_phrases"
            label="Forbidden phrases"
            hint="Frázy, ktoré sa nesmú objaviť"
            placeholder="Add forbidden phrase…"
            value={forbiddenPhrases}
            onChange={onForbiddenPhrasesChange}
            suggestions={[]}
            multiSelect
            enableEnterAdd
            favorites={[]}
          />

          <TextAreaField
            id="additionalConstraints"
            label="Additional constraints"
            hint="(voľné pravidlá, obmedzenia, požiadavky)"
            placeholder="Napr. Nepoužívaj emoji, odpovedaj stručne…"
            value={additionalConstraints}
            onChange={onAdditionalConstraintsChange}
          />

          <TextAreaField
            id="examples"
            label="Examples"
            hint="Ukážky štýlu alebo požadovaných textov"
            placeholder="Paste examples here…"
            value={examples}
            onChange={onExamplesChange}
          />

          <Toggle
            label="Chain of Thought"
            description="Model bude uvažovať krok po kroku"
            checked={cotEnabled}
            onChange={onCotChange}
          />
        </div>
      )}
    </>
  );
}
