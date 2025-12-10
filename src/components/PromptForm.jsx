// src/components/PromptForm.jsx
import React from "react";
import SuggestionInput from "./SuggestionInput";
import TextAreaField from "./TextAreaField";
import Toggle from "./Toggle";
import OutputFormatSelect from "./OutputFormatSelect";

// jednoduché návrhy
const PERSONA_SUGGESTIONS = [
  "Senior copywriter",
  "Právnik špecializovaný na obchodné zmluvy",
  "Dátový analytik",
  "Senior Python vývojár",
  "HR špecialista",
];

const TONE_SUGGESTIONS = [
  "Formálny",
  "Neformálny",
  "Priateľský",
  "Technický",
  "Kreatívny",
  "Sebavedomý",
  "Uvoľnený",
];



export default function PromptForm({
  form,
  setForm,
  cot,
  setCot,
  jsonMode,
  setJsonMode,
  status,
  onClear,
  onGenerateFromApi,
  favorites,
  setFavorites,
}) {
  const handleChange = (key) => (val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <section className="bg-white border border-slate-200 rounded-3xl shadow-xl p-4 md:p-5 flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Vstupné bloky
          </h2>
          <p className="text-xs text-slate-500">
            Persona • Task • Goal • Tone • Output
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            🧹 Clear All
          </button>
          <span className="text-[11px] text-slate-400">
            Backend: <code className="font-mono">/generate-basic-prompt</code>
          </span>
        </div>
      </header>

      <SuggestionInput
        id="persona"
        label="Persona"
        hint="(Kto má AI byť?)"
        placeholder="Napr. Senior právnik pre obchodné zmluvy"
        value={form.persona}
        onChange={handleChange("persona")}
        suggestions={PERSONA_SUGGESTIONS}
        enableEnterAdd={true}
        favorites={favorites.personas}                // NEW
        onToggleFavorite={(val) => {
          setFavorites((prev) => ({
            ...prev,
            personas: prev.personas.includes(val)
              ? prev.personas.filter((v) => v !== val)
              : [...prev.personas, val]
          }));
        }}
      />

      <TextAreaField
        id="task"
        label="Task"
        hint="(Čo má AI urobiť?)"
        placeholder="Napr. Napíš email klientovi s pripomenutím nezaplatenej faktúry."
        value={form.task}
        onChange={handleChange("task")}
        required
      />

      <TextAreaField
        id="goal"
        label="Goal / Context"
        hint="(Prečo má AI úlohu vykonať?)"
        placeholder="Napr. Chcem, aby klient zaplatil do piatku a zároveň ostal dobrý obchodný vzťah."
        value={form.goal}
        onChange={handleChange("goal")}
        required
      />

      <SuggestionInput
        id="tone"
        label="Tón výstupu"
        hint="(formálny, priateľský…)"
        placeholder="Napr. formálny, priateľský, technický…"
        value={form.tone}
        onChange={handleChange("tone")}
        suggestions={TONE_SUGGESTIONS}
        multiSelect={true}
        favorites={favorites.tones}                    // NEW
        onToggleFavorite={(val) => {
          setFavorites((prev) => ({
            ...prev,
            tones: prev.tones.includes(val)
              ? prev.tones.filter((v) => v !== val)
              : [...prev.tones, val]
          }));
        }}
      />

      <OutputFormatSelect
        id="output"
        label="Output format"
        hint="(ako má vyzerať odpoveď?)"
        value={form.output}
        onChange={handleChange("output")}
        maxSelected={6}
        favorites={favorites.outputs}
        onToggleFavorite={(val) => {
          if (!val) return;
          setFavorites((prev) => ({
            ...prev,
            outputs: prev.outputs.includes(val)
              ? prev.outputs.filter((v) => v !== val)
              : [...prev.outputs, val],
          }));
        }}
      />




      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col gap-3">
        <Toggle
          label="Zapnúť CoT (Chain-of-Thought)"
          description="– krok po kroku uvažovanie v odpovedi"
          checked={cot}
          onChange={setCot}
        />
        <p className="text-[11px] text-slate-500">
          Pre bežné emaily a statusy CoT nepotrebuješ. Hodí sa pri zložitejších
          úlohách (argumentácia, analýza, postupy).
        </p>
      </div>

      {status && (
        <div className="text-[11px] text-slate-500 min-h-[14px]">
          {status}
        </div>
      )}

      {/* API button je stále voliteľný:
      <button
        type="button"
        onClick={onGenerateFromApi}
        className="self-start mt-1 inline-flex items-center gap-2 rounded-full bg-blue-600 text-white text-sm font-medium px-4 py-2 shadow-md hover:shadow-lg"
      >
        ⚡ Generate Prompt (API)
      </button>
      */}
    </section>
  );
}
