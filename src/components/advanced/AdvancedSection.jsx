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
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
      {/* HEADER */}
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="text-sm font-medium text-slate-900">
          Advanced Options
        </div>

        <div
          className={`transition-transform duration-200 text-slate-500 ${
            open ? "rotate-90" : "-rotate-90"
          }`}
        >
          ‹‹
        </div>
      </button>

      {/* COLLAPSE AREA */}
      {open && (
        <div className="mt-4 flex flex-col gap-4">

          {/* REQUIRED PHRASES */}
          <SuggestionInput
            id="required_phrases"
            label="Required phrases"
            hint="Frázy, ktoré sa musia objaviť"
            placeholder="Add phrase…"
            value={requiredPhrases}
            onChange={onRequiredPhrasesChange}
            suggestions={[]}
            multiSelect={true}
            enableEnterAdd={true}
            favorites={[]}
          />

          {/* FORBIDDEN PHRASES */}
          <SuggestionInput
            id="forbidden_phrases"
            label="Forbidden phrases"
            hint="Frázy, ktoré sa nesmú objaviť"
            placeholder="Add forbidden phrase…"
            value={forbiddenPhrases}
            onChange={onForbiddenPhrasesChange}
            suggestions={[]}
            multiSelect={true}
            enableEnterAdd={true}
            favorites={[]}
          />

          {/* ADDITIONAL CONSTRAINTS */}
          <SuggestionInput
            id="additional_constraints"
            label="Additional constraints"
            hint="Ďalšie pravidlá, obmedzenia, špecifikácie"
            placeholder="Add constraint…"
            value={additionalConstraints}
            onChange={onAdditionalConstraintsChange}
            suggestions={[]}
            multiSelect={true}
            enableEnterAdd={true}
            favorites={[]}
          />

          {/* EXAMPLES */}
          <TextAreaField
            id="examples"
            label="Examples"
            hint="Ukážky štýlu alebo požadovaných textov"
            placeholder="Paste examples here…"
            value={examples}
            onChange={onExamplesChange}
          />

          {/* CHAIN OF THOUGHT */}
          <Toggle
            id="cot_toggle"
            label="Chain of Thought"
            hint="(Model bude premýšľať explicitne)"
            value={cotEnabled}
            onChange={onCotChange}
          />
        </div>
      )}
    </div>
  );
}
