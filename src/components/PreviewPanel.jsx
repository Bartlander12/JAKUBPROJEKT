// src/components/PreviewPanel.jsx
import React from "react";
import Toggle from "./Toggle";
import SavedPrompts from "./SavedPrompts";

export default function PreviewPanel({
  preview,
  cot,
  jsonMode,
  setJsonMode,
  onCopy,
  onSave,
  savedPrompts,
  onLoadPrompt,
  onDeletePrompt,
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-3xl shadow-xl p-4 md:p-5 flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Náhľad promptu
          </h2>
          <p className="text-xs text-slate-500">
            To, čo skopíruješ do ChatGPT, Claude, Gemini…
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">
          <span>CoT:</span>
          <span className="font-semibold">{cot ? "ON" : "OFF"}</span>
        </div>
      </header>

      <pre className="font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 h-64 md:h-72 overflow-auto whitespace-pre-wrap">
        {preview}
      </pre>

      <div className="flex flex-col gap-3 items-start">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            📋 Copy Prompt
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            💾 Save current
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Skopíruj a vlož do svojho obľúbeného LLM.
        </p>
        <div className="border-t border-dashed border-slate-200 w-full pt-3 flex items-center gap-3">
          <Toggle
            label="Výstup ako JSON"
            checked={jsonMode}
            onChange={setJsonMode}
          />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-900">
            Uložené prompty
          </span>
        </div>
        <SavedPrompts
          savedPrompts={savedPrompts}
          onLoad={onLoadPrompt}
          onDelete={onDeletePrompt}
        />
      </div>
    </section>
  );
}
